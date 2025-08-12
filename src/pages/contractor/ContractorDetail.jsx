import React, { useEffect, useState } from "react";
import "./contractordetail.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config";
function ContractorDetail() {
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [contractorData, setContractorData] = useState(null);
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [showForm, setShowForm] = useState(false);
  const [contractorName, setContractorName] = useState("");
  const [contractorId, setContractorId] = useState("");
  const [ShowContractorPaymentForm, setShowContractorPaymentForm] =
    useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [refreshKey, setrefreshKey] = useState(0);
  const [sideName, setSideName] = useState("");
  const [type, setType] = useState("");
  const [total, setTotal] = useState("");
  const [contractorPaidAmount, setContractorPaidAmount] = useState("");
  const [addedOn, setAddedOn] = useState("");
  const [searchContractor, setSearchContractor] = useState("");
  const [paymentRemark, setpaymentRemark] = useState("");
  const [paymenttableEditFormShow, setpaymenttableEditFormShow] =
    useState(false);
  const [ContractorTableId, setContractorTableId] = useState("");
  const [paymenttableId, setpaymenttableId] = useState("");
  const [editAmout, seteditAmout] = useState("");
  const [editDate, seteditDate] = useState("");
  const [editpaymentMethod, seteditpaymentMethod] = useState("");
  const [editRemark, seteditRemark] = useState("");
  
  useEffect(() => {
    if (!id || !token) return;
    const gettingContractor = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${id}/Contractor`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        if (response.status === 200) {
          const sorteddata = response.data.sort(
            (a, b) =>
              new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime()
          );
          setContractors(sorteddata);
        }
      } catch (error) {
        console.error("Error fetching contractors:", error);
      }
    };

    gettingContractor();
  }, [id, token, refreshKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = {
      contractorName,
      sideName,
      type,
      total,
      contractorPaidAmount,
      addedOn: addedOn || new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/contractor/${id}`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Contractor added successfully");
        setContractors((prev) =>
          [response.data, ...prev].sort(
            (a, b) => Date.parse(b.addedOn) - Date.parse(a.addedOn)
          )
        );

        setContractorName("");
        setSideName("");
        setType("");
        setTotal("");
        setContractorPaidAmount("");
        setAddedOn("");
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error adding contractor:", error);
    }
  };

  async function handleShowContractor(id) {
    setContractorTableId(id);
    try {
      const response = await axios.get(`${BASE_URL}/Contractor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setContractorData(response.data);
      setShowPopup(true);
    } catch (error) {
      console.log(error);
    }
  }

  //   useEffect(() => {
  //     if (id) {
  //       handleShowContractor(id);
  //     }
  //   }, [refreshKey, id, token]);

  function handleaddPayment(id) {
    setContractorId(id);
    setShowContractorPaymentForm(true);
  }

  async function handleaddContractorpayment(e) {
    e.preventDefault();
    const formdata = [
      {
        contractorPayDate:
          paymentDate || new Date().toISOString().split("T")[0],
        contractorPayStatus: paymentMethod,
        amount,
        remark: paymentRemark,
      },
    ];
    try {
      const response = await axios.post(
        `${BASE_URL}/${contractorId}/contractorInstallment`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Payment added Successfully");
        setShowContractorPaymentForm(false);
        setPaymentDate("");
        setPaymentMethod("");
        setAmount("");
        setpaymentRemark("");
        setrefreshKey((prev) => prev + 1);
        setShowPopup(false);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to add payment");
    }
  }

  async function handleDelete(id) {
    const contractorDelete = window.confirm("Are you sure to delete ?");
    if (!contractorDelete) return;
    try {
      const response = await axios.delete(
        `${BASE_URL}/deleteContractor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        alert("Contractor Delete Successfully");
        setContractors((prev) =>
          prev.filter((contractor) => contractor.id !== id)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  const filterContractor = contractors.filter((item, index) => {
    return item.contractorName
      .toLowerCase()
      .includes(searchContractor.toLowerCase());
  });

  async function handleEditPayment(id) {
    setpaymenttableId(id);
    setpaymenttableEditFormShow(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/getSingleInstallmentById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);

      seteditAmout(response.data.amount);
      seteditDate(response.data.contractorPayDate);
      seteditpaymentMethod(response.data.contractorPayStatus);
      seteditRemark(response.data.remark);
    } catch (error) {
      console.log(error);
    }
  }

  async function handlechangePayment(e) {
    e.preventDefault();
    console.log(paymenttableId);
    console.log(ContractorTableId);
    const formdata = [
      {
        id: paymenttableId,
        contractorPayDate: editDate || new Date().toISOString("T")[0],
        remark: editRemark,
        contractorPayStatus: editpaymentMethod,
        amount: editAmout,
      },
    ];
    console.log(formdata);

    try {
      const response = await axios.put(
        `${BASE_URL}/updateContractorInstallment/${ContractorTableId}`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        alert("payment Update");
        setrefreshKey((prevKey) => prevKey + 1);
        handleShowContractor(ContractorTableId);
        setpaymenttableEditFormShow(false);
        setShowPopup(false);
        seteditAmout("");
        seteditDate("");
        seteditpaymentMethod("");
        seteditRemark("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeletePayment(id) {
    const confirmation = window.confirm("Do you want to delete?");
    if (!confirmation) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}/deleteContractorInstallment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      if (response.status === 200) {
        alert("Payment Deleted");

        // Refresh data after deletion
        handleShowContractor(ContractorTableId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="contractor-container">
        <div className="add_contractor_button_wrapper">
          <input
            type="search"
            value={searchContractor}
            onChange={(e) => setSearchContractor(e.target.value)}
            className="contractor_search"
            placeholder="Enter Contractor Name"
          />
          <button onClick={() => setShowForm(true)}>Add Contractor</button>
        </div>
        {showForm && (
          <div className="contractor_form_modal">
            <div className="contractor_form_modal-content">
              <span
                className="contractor_form_close"
                onClick={() => setShowForm(false)}
              >
                &times;
              </span>
              <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
                {" "}
                Add Contractor{" "}
              </h2>
              <form onSubmit={handleSubmit} className="contractor_form">
                <label>Contractor Name:</label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  required
                />

                <label>Site Name:</label>
                <input
                  type="text"
                  value={sideName}
                  onChange={(e) => setSideName(e.target.value)}
                  required
                />

                <label>Type:</label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />

                <label>Total Amount:</label>
                <input
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  required
                />

                <label>Paid Amount:</label>
                <input
                  type="number"
                  value={contractorPaidAmount}
                  onChange={(e) => setContractorPaidAmount(e.target.value)}
                  required
                />

                <label>Date:</label>
                <input
                  type="date"
                  value={addedOn || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setAddedOn(e.target.value)}
                  required
                />

                <button type="submit" className="contractor_form_submit_button">
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Contractors Table */}
        <div className="contractor_table_container">
          <h2 className="contractor_table_heading">Contractor List</h2>
          <div className="table-responsive">
            <table className="contractor_table">
              <thead>
                <tr>
                  <th>Contractor Name</th>
                  <th>Site Name</th>
                  <th>Type</th>
                  <th>Added On</th>
                  <th>Total Amount</th>
                  <th>Paid Amount</th>
                  <th>Remaining Amount</th>
                  <th>Action</th>
                  <th>Action</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterContractor.map((contractor) => (
                  <tr key={contractor.id}>
                    <td
                      onClick={() => handleShowContractor(contractor.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {contractor.contractorName}
                    </td>
                    <td>{contractor.sideName}</td>
                    <td>{contractor.type}</td>

                    <td>
                      {new Date(contractor.addedOn).toLocaleDateString("en-GB")}
                    </td>
                    <td>₹{contractor.total.toLocaleString()}</td>
                    <td>₹{contractor.contractorPaidAmount.toLocaleString()}</td>
                    <td>₹{contractor.reamingAmount?.toLocaleString()}</td>
                    <td>
                      <button
                        className="contractorview-btn"
                        onClick={() => handleShowContractor(contractor.id)}
                      >
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleaddPayment(contractor.id)}
                        className="add_payment_button"
                      >
                        Add Payment
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(contractor.id)}
                        className="contractor_delete_button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showPopup && contractorData && (
          <div className="contractor_popup">
            <div className="contractor_popup_content">
              <button
                onClick={() => handleaddPayment(contractorData.id)}
                className="add_payment_button"
              >
                {" "}
                Add Payment
              </button>
              <span
                className="contractor_popup_close"
                onClick={() => setShowPopup(false)}
              >
                &times;
              </span>
              <h2>{contractorData.contractorName}</h2>
              <p>
                <strong>Site Name:</strong> {contractorData.sideName}
              </p>
              <p>
                <strong>Type:</strong> {contractorData.type}
              </p>
              <p>
                <strong>Added On:</strong>{" "}
                {new Date(contractorData.addedOn).toLocaleDateString("en-GB")}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹
                {contractorData.total.toLocaleString()}
              </p>
              <p>
                <strong>Paid Amount:</strong> ₹
                {contractorData.contractorPaidAmount.toLocaleString()}
              </p>
              <p>
                <strong>Remaining Amount:</strong> ₹
                {contractorData.reamingAmount?.toLocaleString()}
              </p>

              <h3>Installments</h3>
              <div className="installment_table_wrapper">
                <table className="installment_table">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Payment Date</th>
                      <th>Payment Method</th>
                      <th> Remark</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractorData.contractorInstallments.length > 0 ? (
                      contractorData.contractorInstallments.map(
                        (installment, index) => (
                          <tr key={index}>
                            <td>₹{installment.amount.toLocaleString()}</td>
                            <td>
                              {" "}
                              {new Date(
                                installment.contractorPayDate
                              ).toLocaleDateString("en-GB")}
                            </td>
                            <td>{installment.contractorPayStatus}</td>
                            <td>{installment.remark}</td>
                            <td>
                              <button
                                onClick={() =>
                                  handleEditPayment(installment.id)
                                }
                                className="constractorview-btn"
                              >
                                {" "}
                                Edit
                              </button>
                              <button
                                className="contractor_delete_button"
                                onClick={() =>
                                  handleDeletePayment(installment.id)
                                }
                              >
                                {" "}
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td colSpan="3" className="no-data">
                          No Installments Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {ShowContractorPaymentForm && (
          <>
            <div
              className="contractor_form_overlay"
              onClick={() => setShowContractorPaymentForm(false)}
            ></div>
            <div className="contractor_form_wrapper">
              <form
                action=""
                className="contractor_payment_form"
                onSubmit={handleaddContractorpayment}
              >
                <button
                  onClick={() => setShowContractorPaymentForm(false)}
                  className="contractor_payment_close_button"
                >
                  X
                </button>
                <input
                  type="date"
                  value={paymentDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select Payment Method</option>
                  <option value="CASH">CASH</option>
                  <option value="CHECK">Cheque</option>
                  <option value="UPI">UPI</option>
                  <option value="RTGS">RTGS</option>
                  <option value="NEFT">NEFT</option>
                </select>
                <input
                  type="text"
                  placeholder="Note..."
                  value={paymentRemark}
                  onChange={(e) => setpaymentRemark(e.target.value)}
                />
                <button
                  type="submit"
                  className="contractor_payment_submit_button"
                >
                  Submit
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {paymenttableEditFormShow && (
        <>
          <form className="paymentTableEditForm" onSubmit={handlechangePayment}>
            <button
              type="button"
              onClick={() => setpaymenttableEditFormShow(false)}
              style={{ color: "red" }}
            >
              X
            </button>
            <input
              type="text"
              className="paymentTableEditForm_input"
              placeholder="Enter Amount"
              value={editAmout}
              onChange={(e) => seteditAmout(e.target.value)}
            />
            <input
              type="date"
              className="paymentTableEditForm_input"
              value={editDate}
              onChange={(e) => seteditDate(e.target.value)}
            />
            <select
              className="paymentTableEditForm_select"
              value={editpaymentMethod}
              onChange={(e) => seteditpaymentMethod(e.target.value)}
            >
              <option value="">Select Payment Method</option>
              <option value="CASH">CASH</option>
              <option value="CHECK">Cheque</option>
              <option value="UPI">UPI</option>
              <option value="RTGS">RTGS</option>
              <option value="NEFT">NEFT</option>
            </select>
            <input
              type="text"
              className="paymentTableEditForm_input"
              placeholder="Remarks"
              value={editRemark}
              onChange={(e) => seteditRemark(e.target.value)}
            />
            <button className="paymentTableEditForm_submit">Submit</button>
          </form>
        </>
      )}
    </>
  );
}

export default ContractorDetail;
