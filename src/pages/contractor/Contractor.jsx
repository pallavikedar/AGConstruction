import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsFillBuildingsFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

// import "./Material.css"
import { BASE_URL } from "../../config";
function Contractor() {
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [myLand, setMyLand] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function getLand() {
      try {
        const response = await axios.get(`${BASE_URL}/getAllProjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setMyLand(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getLand();
  }, []);

  function handleclick(id) {
    navigate(`/contractordetail/${id}`);
  }

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "30px" }}>
        Contractor Management{" "}
      </h1>

      <div className="show_building_name_material_wrapper">
        {myLand.length > 0 ? (
          myLand.map((item, index) => (
            <div
              key={index}
              onClick={() => handleclick(item.id)}
              className="show_building_name_material"
            >
              <BsFillBuildingsFill size={80} color="rgb(224 45 45);" />
              <p>
                <b>{item.name}</b>
              </p>
              <p className="material_status">
                <b>{item.status}</b>
              </p>
              <div className="material_card_view_container">
                <button> View Details</button>
              </div>
            </div>
          ))
        ) : (
          <p>No data found</p>
        )}
      </div>
    </>
  );
}

export default Contractor;
