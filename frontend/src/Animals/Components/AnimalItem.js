import React, { useState } from "react";
import "../Components/AnimalItem.css";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import useHttpClient from "../../Shared/Hooks/http-hook";
import Female from "../../Style/IMG/female.svg";
import Male from "../../Style/IMG/male.svg";

export default function AnimalItem(props) {
  console.log(props.gender)
  const { isLoading } = useHttpClient();
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
      <li className="animal-item-li">
        <Link to={`/animals/${props.id}`} className="animal-item-link">
          <div className="animal-item" style={{ backgroundColor: bgColor }}>
            {isLoading && <LoadingSpinner asOverlay />}
            <div className="animal-item-image-div">
              <img
                className="animal-item-image"
                src={`http://localhost:4000/${props.image}`}
                alt="animal"
              />
              {props.gender && (
    <img
      className="animal-item-gender"
      src={props.gender === "female" ? Female : Male}
      alt={props.gender}
    />
  )}
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
        </Link>
      </li>
    </>
  );
}
