import React, { useState } from "react";
import "./Accordion.css";
import Value1 from "../../../Style/IMG/+.svg";

const Accordion = ({ sections }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {sections.map((section, index) => (
        <div key={index}>
          <button
            className={`accordion ${openIndex === index ? "active-accordion" : ""}`}
            onClick={() => handleToggle(index)}
          >
            <p>{section.title}</p>
            <span
              className={`accordion-icon ${openIndex === index ? "open-icon" : ""}`}
            >
              <img src={Value1} alt="icon" className="accordion-svg-icon" />
            </span>
          </button>
          <div className={`panel ${openIndex === index ? "open" : ""}`}>

            {section.content}
          </div>
        </div>
      ))}
    </>
  );
};

export default Accordion;
