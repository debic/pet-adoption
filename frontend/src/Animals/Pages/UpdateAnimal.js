import React, {useEffect, useState, useContext} from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Input from '../../Shared/Components/Input'
import Button from '../../Shared/Components/Button'
import {  VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../Shared/validators'
import '../Animals.css'
import {useForm} from '../../Shared/Hooks/form-hook'
import useHttpClient from '../../Shared/Hooks/http-hook'
import ErrorModal from '../../Shared/Components/UIElements/ErrorModal'
import LoadingSpinner from '../../Shared/Components/UIElements/LoadingSpinner'
import { AuthContext } from '../../Shared/Context/auth-context'

export default function UpdateAnimal() {
const auth = useContext(AuthContext)
const {isLoading, error, sendRequest, clearError} = useHttpClient();
const [loadedAnimal, setLoadedAnimal] = useState()
const animalId = useParams().animalId
const history = useHistory()
const [formState, inputHandler, setFormData] = useForm(
    {
    name:{
        value: '',
        isValid : false
    },
    type: {
        value: '',
        isValid : false
    },
    info: {
        value: '',
        isValid : false
    }
  },
false
)

useEffect(()=>{
      const fetchAnimal = async (event) => {
        try {
          const response = await sendRequest(
            `http://localhost:4000/api/animals/${animalId}`, 'GET',{
        
            },
            {
              'Content-Type': 'application/json',
            }
          );
                console.log(response.data.animal)

          setLoadedAnimal(response.data.animal)
         
          setFormData({
                name:{
                    value: response.data.animal.name,
                    isValid : true
                },
                type: {
                    value: response.data.animal.type,
                    isValid : true
                },
                info: {
                    value: response.data.animal.info,
                    isValid : true
                }
            }, true)
        

        } catch (error) {

        }
      };
      fetchAnimal()
}, [sendRequest, animalId, setFormData]);




const animalUpdateSubmitHandler = async event => {
    event.preventDefault();
    try{
        await sendRequest(
            `http://localhost:4000/api/animals/${animalId}`, 'PATCH',
            {
                name: formState.inputs.name.value,
                info: formState.inputs.info.value,
                type: formState.inputs.type.value,
              },
            {
              'Content-Type': 'application/json',
            }
          );

          history.push(`/${auth.userId}/animals`);
    }catch(error){

    }

  };

  //Si es que no se encuentra el id se despliega este mensjae
  if(!loadedAnimal && !error){
    return(
        <div className="center">
        <h2>Could not find the animal</h2>
      </div>
    )
  }else {
    return (
        <>
        <ErrorModal error = {error} onClear={clearError}/>
        {isLoading && (
      <div className="center">
        <LoadingSpinner/>
      </div>
    )}
        {!isLoading && loadedAnimal && (
        <form className='animal-form' onSubmit={animalUpdateSubmitHandler} >
            <Input 
            id="name" 
            element="input" 
            type="text" 
            label="Name" 
            labelColor='whiteLabel' 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText="Please enter a valid name" 
            onInput={inputHandler}
            initialValue={loadedAnimal.name}
            initialValid={true}
            />

        <Input 
            id="type" 
            element="input" 
            type="text" 
            label="Type" 
            labelColor='whiteLabel' 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText="Please enter a valid name" 
            onInput={inputHandler}
            initialValue={loadedAnimal.type}
            initialValid={true}
            />
    
            <Input id="description" 
            element="textarea" 
            type="text" 
            label="Info" 
            labelColor='whiteLabel' 
            validators={[VALIDATOR_MINLENGTH(5)]} 
            errorText="Please enter a valid title, min 5 characters" 
            onInput={inputHandler}
            initialValue={loadedAnimal.info}
            initialValid={true}
            />
            <Button basic type="submit" disabled={!formState.isValid}>
                Update animal
            </Button>
        </form> )}

        </>
      )

  }

}
