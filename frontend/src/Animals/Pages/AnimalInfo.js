import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import useHttpClient from "../../Shared/Hooks/http-hook";
import "./AnimalInfo.css";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import Accordion from "../../Shared/Components/UIElements/Accordion";
import { AuthContext } from "../../Shared/Context/auth-context";
import AnimalActions from "../Components/AnimalAction";


export default function AnimalInfo() {
  const aId = useParams().animalId;
  const auth = useContext(AuthContext);
  const [animalInfo, setAnimalInfo] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const fetchAnimal = useCallback(async () => {
    try {
      const response = await sendRequest(
        `http://localhost:4000/api/animals/${aId}`,
        "GET"
      );
      setAnimalInfo(response.data.animal);
    } catch (error) {}
  }, [sendRequest, aId]);

  useEffect(() => {
    fetchAnimal();
  }, [fetchAnimal]);

  let accordionSections = [];
  if (animalInfo) {
    accordionSections = [
      {
        title: "Information",
        content: (
          <>
            <p>{animalInfo.age} years</p>
            <p>{animalInfo.weight} kg</p>
          </>
        ),
      },
      {
        title: "Location",
        content: <p>{animalInfo.location}</p>,
      },
    ];
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && !animalInfo && <p className="center">No pets found.</p>}

      {!isLoading && animalInfo && (
        <div className="section-animal-info">
          <div className="animal-info-image-div">
            <img
              className="animal-info-image"
              src={animalInfo.imageURL}
              alt={animalInfo.name}
            />
          </div>
          <div className="animal-info-data">
            <h2>{animalInfo.name}</h2>
            <div className="animal-info-data-short cursive">
              <p>{animalInfo.type},</p>
              <p>{animalInfo.gender}</p>
            </div>
            <div className="animal-info-data-div">
              <p className="animal-info-data-description">{animalInfo.info}</p>
            </div>

            <Accordion sections={accordionSections} />

            <AnimalActions
              isCreator={auth.userId === animalInfo.creator}
              animalId={aId} 
              animalInfo={animalInfo}
              onUpdateAnimal={fetchAnimal}
            />
          </div>
        </div>
      )}
    </>
  );
}
