import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useHttpClient from "../../Shared/Hooks/http-hook";
import "./AnimalInfo.css";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import Modal from "../../Shared/Components/Modal";
import Button from "../../Shared/Components/Button";
import Accordion from "../../Shared/Components/UIElements/Accordion";

export default function AnimalInfo(props) {
  const aId = useParams().animalId;
  const [animalInfo, setAnimalInfo] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:4000/api/animals/${aId}`,
          "GET",
          {},
          {
            "Content-Type": "application/json",
          }
        );
        setAnimalInfo(response.data.animal);
      } catch (error) {}
    };
    fetchAnimal();
  }, [sendRequest]);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:4000/api/animals/${props.id}`,
        "DELETE"
      );
      props.onDelete(props.id);
    } catch (error) {}
  };

  let accordionSections = [];
  if (animalInfo) {
    //Info for the accordion
    accordionSections = [
      {
        title: "Information",
        content: (
          <>
            <p>{animalInfo.age} years, </p>
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
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Estas seguro?"
        footerClass="animal-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              {" "}
              CANCEL{" "}
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              {" "}
              DELETE{" "}
            </Button>
          </React.Fragment>
        }
      >
        <p>Seguro que deseas eliminar a este item?</p>
      </Modal>

      {!isLoading && !animalInfo && <p className="center">No pets found.</p>}
      {!isLoading && animalInfo && (
        <div className="section-animal-info">
          <div className="animal-info-image-div">
            <img
              className="animal-info-image"
              src={animalInfo.imageURL}
              alt="some of the pets adopted until now"
            ></img>
          </div>
          <div className="animal-info-data">
            <h2>{animalInfo.name}</h2>
            <div className="animal-info-data-short cursive">
              <p>{animalInfo.type}, </p>
              <p> {animalInfo.gender} </p>
            </div>
            <div className="animal-info-data-div">
              <p className="animal-info-data-description">{animalInfo.info}</p>
            </div>
            
            <Accordion sections={accordionSections} />

            <div className="animal-info-btns">
              <Button basic onClick={showDeleteWarningHandler}>
                Adopt
              </Button>
              <Button inverse onClick={showDeleteWarningHandler}>
                Foster
              </Button>
              <Button delete onClick={showDeleteWarningHandler}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
