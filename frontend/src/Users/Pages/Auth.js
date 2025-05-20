import React, {useState, useContext,useEffect} from 'react'
import './Auth.css'
import {useParams,useHistory} from 'react-router-dom'
import Card from '../../Shared/Components/Card'
import Input from '../../Shared/Components/Input'
import Button from '../../Shared/Components/Button'
import ErrorModal from '../../Shared/Components/UIElements/ErrorModal'
import LoadingSpinner from '../../Shared/Components/UIElements/LoadingSpinner'
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../Shared/validators"
import { useForm } from '../../Shared/Hooks/form-hook'
import { AuthContext } from '../../Shared/Context/auth-context'
import useHttpClient from '../../Shared/Hooks/http-hook'
import authImage from '../../Style/IMG/auth.jpg'


export default function Auth() {
  const auth = useContext(AuthContext)
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const loginOrSignup = useParams().type;

    useEffect(()=>{
      if(loginOrSignup === "login"){
        setIsLoginMode(true)
      }else{
        setIsLoginMode(false)
      }
    }, [loginOrSignup]);


    console.log(isLoginMode,loginOrSignup)

  //Este es el initial state del form, donde todo parte sin valores y invalido. 
  //El use form devuelve 2 valores, el formState y el inputhandler
  
  const [formState, inputhandler, setFormData] = useForm({
    email:{
        value:'',
        isValid: false
    },
    password:{
        value:'',
        isValid: false
    }
  }, false)



const switchModeHandler = () =>{
    //para manejar que inputs tiene que ser validos, si uno sign up se necesitan 3 inputs si uno inicia sesion  solo necestas 2
    if(!isLoginMode){
        setFormData({
            ...formState.inputs,
            name: undefined
        }, 
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else{
      setFormData({
        ...formState.inputs,
        name:{
          value:'',
          isValid: false  
        }
      }, false)  
    }
    setIsLoginMode(prevMode => !prevMode)
}




const authSubmitHandler = async event => {
    event.preventDefault();
    //setIsloading(true);

    if(isLoginMode){
      try {
        const responseData = await sendRequest('http://localhost:4000/api/users/login', 'POST', {
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          },
          {
            'Content-Type': 'application/json',
          }
        );
        auth.login(responseData.data.user.id);
      } catch (error) {
        console.log("Error en login:", error);
        // No necesitas hacer más, el error ya fue capturado en el hook y se muestra con el modal
      }
      
    }else{
    try{
      const responseData = await sendRequest('http://localhost:4000/api/users/signup','POST',{
        name: formState.inputs.name.value,
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
      }, {
        
          'Content-Type': 'application/json',
        },
      );
      auth.login(responseData.user.id)
 
    }catch (error) {

    }
  }

}



  return (
    <>
    <ErrorModal error = {error} onClear={clearError}/>
    <div className="auth-section">
      <div className="auth-image-div">
      <img className="auth-image" src={authImage} alt="group of pets"></img>
      </div>
      <div className='authentication-div'>
    <Card className='authentication'>
      {isLoading && <LoadingSpinner asOverlay/>}
      {isLoginMode ? <h2>Login Required</h2> : <h2>Signup Required</h2>}
        
        <hr/>
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
          <Input 
            element='input' 
            id='name' 
            type="text" 
            label='Your Name' 
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a Name' 
            onInput={inputhandler}
        />)}
          <Input 
            element='input' 
            id="email" 
            type="email" 
            label="E-mail" 
            validators={[VALIDATOR_EMAIL()]} 
            errorText="Please enter a valid email adress" 
            onInput={inputhandler}
          />
          <Input 
            element='input' 
            id="password" 
            type="password" 
            label="Password" 
            validators={[VALIDATOR_MINLENGTH(6)]} 
            errorText="Please enter a valid password, at leats 6 characters" 
            onInput={inputhandler}
          />
          <Button  form type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : "SIGNUP"}
          </Button>
        </form>
        <div className='flex-row flex-center'> 
        {isLoginMode ? <p>You dont have an account?</p> : <p>You already have an account?</p>}
        
        <Button link className="switch-button" type="submit" onClick={switchModeHandler}>
        {isLoginMode ? 'SIGNUP' : "LOGIN"}
         </Button>
        </div>

    </Card>
    </div>
    </div>
    </>
  )
}
