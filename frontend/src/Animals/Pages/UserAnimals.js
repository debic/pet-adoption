import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnimalList from "./../Components/AnimalsList";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import useHttpClient from "../../Shared/Hooks/http-hook";
import "../Pages/UserAnimals.css";
export default function UserAnimals() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [fostereddUsersAnimals, setFosteredUsersAnimals] = useState();
  const [postedUsersAnimals, setPostedUsersAnimals] = useState();
  const [adoptedUsersAnimals, setAdoptedUsersAnimals] = useState();

  const userId = useParams().userId;

  useEffect(() => {
    const getAnimalsFromUserId = async (event) => {
      try {
        const responsePosted = await sendRequest(
          `http://localhost:4000/api/animals/user/posted/${userId}`
        );
               const responseAdopted = await sendRequest(
          `http://localhost:4000/api/animals/user/adopted/${userId}`
        );
               const responseFostered = await sendRequest(
          `http://localhost:4000/api/animals/user/fostered/${userId}`
        );
 setPostedUsersAnimals(responsePosted.data.animals);
 setFosteredUsersAnimals(responseFostered.data.animals);
        setAdoptedUsersAnimals(responseAdopted.data.animals);
      } catch (error) {}
    };
    getAnimalsFromUserId();
  }, [sendRequest, userId]);

  const animalDeletedHandler = (deletedAnimalId) => {
    setPostedUsersAnimals((prevAnimals) =>
      prevAnimals.filter((animal) => animal._id !== deletedAnimalId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div className="grey-background">
        <h2 className="title-page">My Animals</h2>
        <div>
          <hr/>
          <h3> Aopted animals</h3>
        {!isLoading && adoptedUsersAnimals && (
          <div className="animals-section-list">
            <AnimalList
              items={adoptedUsersAnimals}
              onDeleteAnimal={animalDeletedHandler}
            />
          </div>
        )}
        </div>
        <div>
           <hr/>
          <h3>Fostered animals</h3>
        {!isLoading && fostereddUsersAnimals && (
          <div className="animals-section-list">
            <AnimalList
              items={fostereddUsersAnimals}
              onDeleteAnimal={animalDeletedHandler}
            />
          </div>
        )}
        </div>
        <div>
           <hr/>
          <h3>Posted animals</h3>
        
        {!isLoading && postedUsersAnimals && (
          <div className="animals-section-list">
            <AnimalList
              items={postedUsersAnimals}
              onDeleteAnimal={animalDeletedHandler}
            />
          </div>
        )}
        </div>
      </div>

      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}
