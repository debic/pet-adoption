import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../Shared/Components/Button";
import Modal from "../../Shared/Components/Modal";
import useHttpClient from "../../Shared/Hooks/http-hook";
import UpdateAnimal from "../Pages/UpdateAnimal";
import { AuthContext } from "../../Shared/Context/auth-context"; 

export default function AnimalActions({ isCreator, animalId, animalInfo }) {
  const { sendRequest } = useHttpClient();
  const history = useHistory();
  const [pendingAction, setPendingAction] = useState(null); // 'edit', 'delete', 'adopt', 'foster'
  const auth = useContext(AuthContext)

  const openModal = (action) => setPendingAction(action);
  const closeModal = () => setPendingAction(null);

  const confirmAction = async () => {
    console.log(pendingAction);
    try {
      if (pendingAction === "delete") {
        await sendRequest(
          `http://localhost:4000/api/animals/${animalId}`,
          "DELETE"
        );
        history.push("/");
      } else if (pendingAction === "adopt" || pendingAction === "foster") {
        await sendRequest(
          `http://localhost:4000/api/animals/${animalId}`,
          "PATCH",
          {
            name: animalInfo.name,
            info: animalInfo.info,
            type: animalInfo.type,
            status: pendingAction,
            currentlyStyaingWith: auth.userId,
            userId:auth.userId
          },
          { "Content-Type": "application/json" }
        );
        closeModal();
      } else if (pendingAction === "edit") {
        history.push(`/animals/${animalId}/edit`);
      }
    } catch (err) {
      closeModal();
    }
  };

  return (
    <>
      <Modal
        show={!!pendingAction && pendingAction !== "edit"}
        onCancel={closeModal}
        header="¿Estás segura?"
        footerClass="animal-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={closeModal}>
              Cancelar
            </Button>
            <Button danger onClick={confirmAction}>
              Confirmar
            </Button>
          </>
        }
      >
        {pendingAction === "delete" && (
          <p>¿Seguro que querés eliminar este animal?</p>
        )}
        {pendingAction === "adopt" && (
          <p>¿Seguro que querés adoptar este animal?</p>
        )}
        {pendingAction === "foster" && (
          <p>¿Seguro que querés acoger este animal?</p>
        )}
      </Modal>

      <div className="animal-info-btns">
        {auth.isLoggedIn ? (
          isCreator ? (
            <>
              <Button
                basic
                onClick={() => history.push(`/animals/${animalId}/edit`)}
              >
                Edit
              </Button>
              <Button delete onClick={() => openModal("delete")}>
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button basic onClick={() => openModal("adopt")}>
                Adopt
              </Button>
              <Button inverse onClick={() => openModal("foster")}>
                Foster
              </Button>
            </>
          )
        ) : (
          <p>Please log in to interact</p>
        )}
      </div>
    </>
  );
}
