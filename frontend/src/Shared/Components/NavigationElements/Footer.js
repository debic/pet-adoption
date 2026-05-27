import React from "react";
import Instagram from "../../../Style/IMG/social-icon-22.svg";
import Linkedin from "../../../Style/IMG/social-icon-19.svg";
import Tiktok from "../../../Style/IMG/social-icon-20.svg";
import Facebook from "../../../Style/IMG/social-icon-21.svg";
import { NavLink } from "react-router-dom";

import "./Footer.css";

export default function Footer() {
  return (
    <>
      <div className="footer-general-div">
        
          <p className="footer-title">Bringing paws and hearts together, one adoption at a time.</p>
          <div className="footer-social-icons">
            <img className="social-media" src={Instagram} alt="logo"></img>
            <img className="social-media" src={Linkedin} alt="logo"></img>
            <img className="social-media" src={Tiktok} alt="logo"></img>
            <img className="social-media" src={Facebook} alt="logo"></img>
          </div>
          <p>© 2025 Pets Adoption. All rights reserved.</p>
       
      </div>
    </>
  );
}
