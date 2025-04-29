//Hold all the use reducers
import {useCallback, useReducer} from 'react'

const formReducer = (state, action) => {

    switch (action.type){
      case 'INPUT_CHANGE':
        let formIsValid = true
        //para ir a travez de todos los inputs que hay en el form y ver si todos son Valid, con un for in loop, porque es un object
        for (const inputId in state.inputs){
          //If it is undefined
          if(!state.inputs[inputId]){
            //si es que es undefined, saltate el resto de las properties
            continue;
          }
          //aca se ve si el input que esta en el loop, es el mismo que hizo el trigger en esta action?
          if(inputId === action.inputId){
            formIsValid = formIsValid && action.isValid

          } else{
            formIsValid = formIsValid && state.inputs[inputId].isValid

          }
        }

        return{
          ...state,
          inputs: {
            //current input state
          ...state.inputs,
          [action.inputId]:{value: action.value, isValid: action.isValid}
          },
          isValid: formIsValid
        }
    
      case 'SET_DATA':
        return{
            inputs: action.inputs,
            isValid: action.formIsValid
        }
        
      default:
        return {
        state
        }
    }
  }

export const useForm = (initialInputs, initialFormValidity) => {



  //Este es el initial state
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs ,
    isValid: initialFormValidity
  })

 

  //useCallback se usa para envolver una funcion y definir dependencies en la funcion para ver cuando se activa, para evitar un infitite loop
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
          type: 'INPUT_CHANGE',
          value: value,
          isValid: isValid,
          inputId: id
        });
    }, []);

    const setFormData = useCallback((inputData, formValidity)=> {
        dispatch({
                type: "SET_DATA",
                inputs: inputData,
                formIsValid: formValidity
        })
    }, [])


    return [formState, inputHandler, setFormData]
}