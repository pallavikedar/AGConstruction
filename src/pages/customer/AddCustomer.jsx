import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { BASE_URL } from "../../config";
import { PiBuildingApartmentFill } from "react-icons/pi";
function AddCustomer() {
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [residencyName, setResidencyName] = useState([]);
  const [customerBook, setCustomerBooked] = useState([]);
  const [showCustomerTable, setShowCustomerTable] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    async function gettingResidency() {
      try {
        const response = await axios.get(`${BASE_URL}/getAllProjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setResidencyName(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    gettingResidency();
  }, [token]);

  async function residencyCustomerName(id) {
    try {
      const response = await axios.get(
        `${BASE_URL}/residenciesByProject/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);

      setCustomerBooked(response.data);
      setShowCustomerTable(true);
    } catch (error) {
      console.log(error);
    }
  }

  function handleShowDetail(id) {
    navigate(`/flatowner/${id}`);
  }

  const filteredBookedCustomers = customerBook.filter(
    (item) => item.availabilityStatus === "BOOKED"
  );

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredBookedCustomers.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredBookedCustomers.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: "25px" }}>
        Customer Details
      </h2>
      <div className="customer_residency_container">
        {residencyName.length > 0 ? (
          residencyName.map((item, index) => (
            <div
              key={index}
              className="customer_residency_name"
              onClick={() => residencyCustomerName(item.id)}
            >
              <PiBuildingApartmentFill style={{color:"#d85200", fontSize:"35px"}} /> 
              <p>{item.name}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No data available</p>
        )}
      </div>
      {showCustomerTable && (
        <div className="booked_customer_main_table_wrapper">
          <button
            onClick={() => setShowCustomerTable(false)}
            className="booked_customer_data_table_close_button"
          >
            Close
          </button>
          {filteredBookedCustomers.length > 0 ? (
            <>
              <div>
                <table className="booked_customer_data_table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Flat No</th>
                      <th>Flat Price</th>
                      <th>Availability</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.project.name}</td>
                        <td>{item.identifier}</td>
                        <td>{item.booking.dealPrice?.toLocaleString()}</td>
                        <td>{item.availabilityStatus}</td>
                        <td>
                          <button
                            onClick={() => handleShowDetail(item.booking.id)}
                            className="booked_customer_data_show_button"
                          >
                            Show Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName="pagination"
                activeClassName="active"
                breakLabel="..."
                previousLabel={null}
                nextLabel={null}
              />
            </>
          ) : (
            <p
              className="booked_customer_data_not_found"
              style={{ textAlign: "center" }}
            >
              No Data Found
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default AddCustomer;
