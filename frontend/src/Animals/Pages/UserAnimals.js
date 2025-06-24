import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import AnimalList from './../Components/AnimalsList'
import ErrorModal from '../../Shared/Components/UIElements/ErrorModal'
import LoadingSpinner from '../../Shared/Components/UIElements/LoadingSpinner'
import useHttpClient from '../../Shared/Hooks/http-hook'
import '../Pages/UserAnimals.css'
export default function UserAnimals() {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedUsersAnimals,setLoadedUsersAnimals] = useState()
  
    const userId = useParams().userId;

    useEffect(()=>{
      const getAnimalsFromUserId = async (event) => {
        try {
          const response = await sendRequest(
            `http://localhost:4000/api/animals/user/${userId}`
          );
          setLoadedUsersAnimals(response.data.animals)

        } catch (error) {}
    
      };
      getAnimalsFromUserId()
    }, [sendRequest, userId]);

    const animalDeletedHandler = (deletedAnimalId) => {
      setLoadedUsersAnimals(prevAnimals =>
        prevAnimals.filter(animal => animal._id !== deletedAnimalId)
      );
    };

  return (
    <>
    <ErrorModal error = {error} onClear={clearError}/>
        <div className='grey-background'>

    <h2 className='title-page'>My Animals</h2>
      {!isLoading && loadedUsersAnimals && (
        <div className="animals-section-list">
          <AnimalList items={loadedUsersAnimals} onDeleteAnimal={animalDeletedHandler}/>
        </div>
      )}
    </div>
    
    {isLoading && (
      <div className="center">
        <LoadingSpinner/>
      </div>
    )}    
    </>
  )
}
