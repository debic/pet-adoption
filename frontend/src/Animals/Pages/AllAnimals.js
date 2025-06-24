import React, { useEffect, useState, useRef } from "react";
import AnimalList from "../Components/AnimalsList";
import useHttpClient from "../../Shared/Hooks/http-hook";

export default function AllAnimals(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAnimals, setLoadedAnimals] = useState();

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:4000/api/animals/",
          "GET",
          {},
          {
            "Content-Type": "application/json",
          }
        );
        setLoadedAnimals(response.data.animals);
      } catch (error) {}
    };
    fetchAnimals();
  }, [sendRequest]);

  return (
    <div>
      <div className='grey-background'>

    <h2 className='title-page'>All Animals</h2>
        <div className="animals-section-list">
          {!isLoading && loadedAnimals &&(
            <AnimalList items={loadedAnimals} />
          )}
          {!loadedAnimals && (
            <p>No pets find</p>
          )}
        </div>
   </div>
    </div>
  )
}
