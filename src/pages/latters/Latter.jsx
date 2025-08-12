import React from "react";
import { useNavigate } from "react-router-dom";
import "./Latter.css";
function Latter() {
  const navigate = useNavigate();
  function handleofferLatter() {
    navigate("/offerlatter");
  }

  function handleRelievinglatter() {
    navigate("/Relievinglatter");
  }
  function handleSalarySlip() {
    navigate("/SalarySlip");
  }
  function handleallotment() {
    navigate("/allotment");
  }

  function handleDemand() {
    navigate("/demand");
  }
  function handleLetterhead() {
    navigate("/letterhead");
  }
  return (
    <>
      <div className="latters">
        {/* <button onClick={handleofferLatter} className='letter_buttons'> Offer Letter</button> */}
        <button
          className="letter_buttons"
          onClick={() => navigate("/AgsalarySlip")}
        >
          {" "}
          Salary Slip
        </button>
        <button onClick={handleRelievinglatter} className="letter_buttons">
          Riveling Letter
        </button>
        {/* <button onClick={handleSalarySlip} className='letter_buttons'>Salary Slip</button> */}
        <button onClick={handleallotment} className="letter_buttons">
          Allotment Letter
        </button>
        <button onClick={handleDemand} className="letter_buttons">
          Demand Letter
        </button>
        <button onClick={handleLetterhead} className="letter_buttons">
          Letter Heades
        </button>
        <button
          onClick={() => navigate("/nocletter")}
          className="letter_buttons"
        >
          Noc Letter
        </button>
        <button
          onClick={() => navigate("/possession")}
          className="letter_buttons"
        >
          possession Letter
        </button>
      </div>
    </>
  );
}

export default Latter;
