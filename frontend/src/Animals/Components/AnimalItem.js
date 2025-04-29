import React, { useState, useContext } from "react";
import FemaleImg from "../../Style/IMG/female.svg";
import MaleImg from "../../Style/IMG/male.svg";
import Button from "../../Shared/Components/Button";
import Modal from "../../Shared/Components/Modal";
import { AuthContext } from "../../Shared/Context/auth-context";
import "../Components/AnimalItem.css";
import { Link } from "react-router-dom";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import useHttpClient from "../../Shared/Hooks/http-hook";

export default function AnimalItem(props) {
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  console.log(props);
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

  const getRandomColor = () => {
    const colors = [
      "#8A5D3B", // brown
      "#553E29", // dark brown
      "#A48269", // light brown
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [bgColor] = useState(getRandomColor());

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

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

      <li className="animal-item-li">
        <div className="animal-item" style={{ backgroundColor: bgColor }}>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="animal-item-image-div">
            <img className="animal-item-image" src={props.image} alt="animal" />
          </div>
          <div className="animal-item-info">
            <div className="animal-item-title">
              <h3>{props.name}</h3>
            </div>
            <div className="animal-item-short-info">
              <p className="shortInfo">{props.age} years,</p>
              <p className="shortInfo">{props.weight} kg</p>
            </div>
            <p className="animal-item-long-info">
              {props.info.length > 100
                ? props.info.slice(0, 100) + "..."
                : props.info}
            </p>
          </div>
        </div>
      </li>
    </>
  );
}
