import React, { useEffect, useState, useRef } from "react";
import AnimalList from "../Components/AnimalsList";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import useHttpClient from "../../Shared/Hooks/http-hook";
import Button from "../../Shared/Components/Button";
import "./HeroPage.css";
import "../Components/AnimalList.css";

import HeroCats from "../../Style/IMG/heroImage.jpeg";
import SocialImage from "../../Style/IMG/social.svg";
import Value1 from "../../Style/IMG/values-1.svg";
import Value2 from "../../Style/IMG/values-2.svg";
import Value3 from "../../Style/IMG/values-3.svg";
import Value4 from "../../Style/IMG/values-4.svg";
import Value5 from "../../Style/IMG/values-5.svg";
import Dog from "../../Style/IMG/dog.jpg";
import CircleType from 'circletype'; 


export default function HeroPage() {
  const [filteredAnimals, setFilteredAnimals] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
        setFilteredAnimals(response.data.animals.slice(0, 4));
      } catch (error) {}
    };
    fetchAnimals();
  }, [sendRequest]);

  const circleRef = useRef(null);

  useEffect(() => {
    if (circleRef.current) {
      const circleType = new CircleType(circleRef.current);
    circleType.radius(120);
  
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const rotation = window.scrollY * 0.2; // Ajusta el 0.2 para rotar más o menos rápido
      if (circleRef.current) {
        circleRef.current.style.transform = `rotate(${rotation}deg)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Limpieza al desmontar el componente
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <section className="hero">
        <div className="hero-round-corners">
          <div className="image-hero-div">
            <img className="image-hero" src={HeroCats} alt="logo"></img>
          </div>
          <div className="info-hero">
            <div className="info-hero-size">
              <div className="info-hero-title">
                <h1>Find Your New Best Friend</h1>
              </div>
              <div className="info-hero-text">
                <p className="info-hero-subtitle">Where love begins and second chances happen.</p>
                <div className="info-hero-btn">
                  <Button basic>Adopt now</Button>
                  <div className="info-hero-vertical-line"></div>
                  <img
                    className="social-image-adopted"
                    src={SocialImage}
                    alt="some of the pets adopted until now"
                  ></img>
                  <p>Adopted!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <h2>Find Your New Best Friend</h2>
        <div className="values-section-items">
          <div className="values-section-single-item values-section-dark-brown rotate-left">
            <img className="values-icon" src={Value1} alt="logo"></img>
            <p className="white-text">Creating Happy Endings</p>
          </div>
          <div className="values-section-single-item values-section-white rotate-right">
            <img className="values-icon" src={Value2} alt="logo"></img>
            <p>Finding Responsible Owners</p>
          </div>
          <div className="values-section-single-item values-section-grey rotate-left">
            <img className="values-icon" src={Value3} alt="logo"></img>
            <p>Clean and Safe Environment</p>
          </div>
          <div className="values-section-single-item values-section-white rotate-right">
            <img className="values-icon" src={Value4} alt="logo"></img>
            <p>Transparent Adoption Process</p>
          </div>
          <div className="values-section-single-item values-section-grey rotate-left">
            <img className="values-icon" src={Value5} alt="logo"></img>
            <p>Transparent Adoption Process</p>
          </div>
        </div>
      </section>

      <section className="justArrivingSection">
        <h2 className="animals-section-title">Meet Our Pets</h2>
        <div className="animals-section-list">
          {!isLoading && filteredAnimals && (
            <AnimalList items={filteredAnimals} />
          )}
          {!filteredAnimals && (
            <p>No pets find</p>
          )}
          <div className="animals-section-image-div">
            <img className="animals-section-image" src={Dog} alt="logo"></img>
          </div>
        </div>
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
      </section>

      <section className="process-section">
        <h2 className="process-section-title">Adoption Process</h2>
        <div className="process-section-content">
          <div className="process-steps-div">
            <div className="process-steps-item light-brown-background">
              <p className="process-steps-item-number">1</p>
              <div className="process-steps-item-content">
                <h3>Get to Know Them</h3>
                <p className="process-steps-item-text">
                  We invite you to meet our animals and spend time with them to
                  ensure it’s the right match.
                </p>
              </div>
            </div>
            <div className="process-steps-item dark-brown-background">
              <p className="process-steps-item-number">2</p>
              <div className="process-steps-item-content">
                <h3>Fill Out the Application</h3>
                <p className="process-steps-item-text">
                  Complete a short form so we can understand your lifestyle and
                  preferences.
                </p>
              </div>
            </div>
            <div className="process-steps-item dark-background">
              <p className="process-steps-item-number">3</p>
              <div className="process-steps-item-content">
                <h3>Welcome Your New Family Member</h3>
                <p className="process-steps-item-text">
                  Get ready to bring your new pet home and start a beautiful
                  life together.
                </p>
              </div>
            </div>
          </div>
          <div className="process-circle-effect">
            <p ref={circleRef}>Find Your Forever Friend* </p>
          </div>
        </div>
      </section>
    </>
  );
}
