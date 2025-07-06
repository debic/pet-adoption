import React, { useContext } from "react";
import "../Pages/NewAnimal.css";
import Input from "../../Shared/Components/Input.js";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../Shared/validators.js";
import Button from "../../Shared/Components/Button.js";
import { useForm } from "../../Shared/Hooks/form-hook.js";
import useHttpClient from "../../Shared/Hooks/http-hook.js";
import { AuthContext } from "../../Shared/Context/auth-context.js";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal.js";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner.js";
import { useHistory } from "react-router-dom";
import ImageUpload from "./../../Shared/Components/UIElements/ImageUpload.js";

export default function NewAnimal() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      type: {
        value: "",
        isValid: false,
      },
      gender: {
        value: "",
        isValid: false,
      },
      info: {
        value: "",
        isValid: false,
      },
      age: {
        value: "",
        isValid: false,
      },
      weight: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  //Para mandar esta info al backend y al database
  const animalSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("info", formState.inputs.info.value);
      formData.append("type", formState.inputs.type.value);
      formData.append("gender", formState.inputs.gender.value);
      formData.append("age", formState.inputs.age.value);
      formData.append("weight", formState.inputs.weight.value);
formData.append("creator", auth.userId);
      formData.append("currentlyStyaingWith", auth.userId);
      formData.append("status", "In adoption");
      formData.append("image", formState.inputs.image.value);

      await sendRequest(
        "http://localhost:4000/api/animals/",
        "POST",
        formData

      );
       console.log(formData);
      history.push("/");
    } catch (error) {}

  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className="form-section">
        <h2 className="animals-section-title">Introduce a New Friend</h2>
        <p className="animals-section-text">
          let's find a home for this animal
        </p>

        <form className="animal-form" onSubmit={animalSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            labelColor="blackLabel"
            //llama a la funcion del file de validacion para verificar que el input no este vacio
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name"
            onInput={inputHandler}
          />

          <ImageUpload center id="image" onInput={inputHandler} />

          <Input
            id="type"
            type="select"
            label="Choose a type"
            labelColor="blackLabel"
            options={[
              { label: "Dog", value: "dog" },
              { label: "Cat", value: "cat" },
              { label: "Hamster", value: "hamster" },
              { label: "Bird", value: "bird" },
            ]}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please choose an animal type"
            onInput={inputHandler}
          />

          <Input
            id="gender"
            type="radio-group"
            label="Gender"
            labelColor="blackLabel"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please choose a gender"
            onInput={inputHandler}
          />

          <Input
            id="age"
            element="input"
            type="text"
            label="Age"
            labelColor="blackLabel"
            //llama a la funcion del file de validacion para verificar que el input no este vacio
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid age"
            onInput={inputHandler}
          />

          <Input
            id="weight"
            element="input"
            type="text"
            label="Weight"
            labelColor="blackLabel"
            //llama a la funcion del file de validacion para verificar que el input no este vacio
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid weight"
            onInput={inputHandler}
          />

          <Input
            id="info"
            element="textarea"
            type="text"
            label="info"
            labelColor="blackLabel"
            //llama a la funcion del file de validacion para verificar que el input no este vacio
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description, at least 5 characters"
            onInput={inputHandler}
          />

          <Button basic type="submit" disabled={!formState.isValid}>
            Add Animal
          </Button>
        </form>
      </section>
    </>
  );
}
