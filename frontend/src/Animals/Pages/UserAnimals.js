import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import AnimalList from './../Components/AnimalsList'
import ErrorModal from '../../Shared/Components/UIElements/ErrorModal'
import LoadingSpinner from '../../Shared/Components/UIElements/LoadingSpinner'
import useHttpClient from '../../Shared/Hooks/http-hook'

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

    {!isLoading && loadedUsersAnimals && (
      <AnimalList items={loadedUsersAnimals} onDeleteAnimal={animalDeletedHandler}/>
    )}
    
    {isLoading && (
      <div className="center">
        <LoadingSpinner/>
      </div>
    )}    
    </>
  )
}
