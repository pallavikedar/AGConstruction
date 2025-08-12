import React, { useEffect, useState } from "react";
import "../structure/structuredetail.css";
import { BASE_URL } from "../../config";
import axios from "axios";
import { useParams } from "react-router-dom";

function StructureDetail() {
  const { id, name } = useParams();
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [refreshKey, setRefreshkey] = useState(0);
  const [paymentTable, setPaymentTable] = useState([]);
  const [searchPayment, setSearchPayment] = useState("");
  const [StructurePaymentForm, setStructurePaymentForm] = useState(false);
  const [payableName, setPayableName] = useState("");
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [ShowEditStructureForm, setShowEditStructureForm] = useState(false);
  const [ContractorId, setContractorId] = useState("");
  const [EditpayableName, setEditpayableName] = useState("");
  const [Editremark, setEditRemark] = useState("");
  const [Editdate, setEditDate] = useState("");
  const [Editamount, setEditAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
 const user = JSON.parse(localStorage.getItem("employeROyalmadeLogin"));
 
  const role = user?.role;
  useEffect(() => {
    async function getStructurePayment() {
      try {
        const response = await axios.get(
          `${BASE_URL}/show-StructureContractor/by-project/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setPaymentTable(response.data.contractors);
        setTotalAmount(response.data.totalAmount);
      } catch (error) {
        console.error(error);
      }
    }
    getStructurePayment();
  }, [id, token, refreshKey]);

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const filterSearch = paymentTable.filter((item) => {
    return item.payableName.toLowerCase().includes(searchPayment.toLowerCase());
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = {
      payableName,
      remark,
      date,
      amount: parseFloat(amount),
      projectId: id,
    };
    console.log(formData);
    try {
      const response = await axios.post(`${BASE_URL}/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      if (response.status === 201) {
        alert("Payment Added Successfully");
        setRefreshkey(refreshKey + 1);
        setAmount("");
        setDate("");
        setPayableName("");
        setRemark("");
        setStructurePaymentForm(false);
      }
    } catch (error) {
      console.log(error);
      
    }
    finally {
      setIsSubmitting(false);
    }
  };

  async function hanldeEditStructurePayment(id) {
    setContractorId(id);
    setShowEditStructureForm(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/structure-contractor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setEditAmount(response.data?.amount);
      setEditDate(response.data?.date);
      setEditRemark(response.data?.remark);
      setEditpayableName(response.data?.payableName);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleupdatePayment(e) {
    e.preventDefault();
    const formdata = {
      projectId: id,
      payableName: EditpayableName,
      remark: Editremark,
      date: Editdate,
      amount: Editamount,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/update-StructureContractor/${ContractorId}`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Paymet Update Successfully");
        setRefreshkey(refreshKey + 1);
        setShowEditStructureForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeletePayment(id) {
    const confirmdelete = window.confirm("Are you sure to delete ?");
    if (!confirmdelete) return;
    try {
      const response = await axios.delete(
        `${BASE_URL}/delete-StructureContractor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Payment Delete Successfully");
        setRefreshkey(refreshKey + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="StructureDetail-container">
        <h2 className="StructureDetail-title"> {name} Structure Detail</h2>

        <div className="StructureDetail-header">
          <input
            type="search"
            className="StructureDetail-search"
            placeholder="Search..."
            value={searchPayment}
            onChange={(e) => setSearchPayment(e.target.value)}
          />
          <button
            className="StructureDetail-addBtn"
            onClick={() => setStructurePaymentForm(true)}
          >
            Add Payment
          </button>
        </div>

        <div className="StructureDetail-tableWrapper">
          <table className="StructureDetail-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Payable Name</th>
                <th>Amount</th>
                <th>Project</th>
                <th>Remark</th>
                <th> Action</th>
                {role === "Admin" && <th colSpan={1}>Updated By</th>}
              </tr>
            </thead>
            <tbody>
              {filterSearch.length === 0 ? (
                <tr>
                  <td colSpan="5">No payment data found.</td>
                </tr>
              ) : (
                filterSearch.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>

                    <td>{item.payableName}</td>
                    <td>₹ {item.amount.toLocaleString()}</td>
                    <td>{item.projectName}</td>
                    <td>{item.remark}</td>
                    <td>
                      <div className="StructureDetail-actionBtns">
                        <button
                          className="structuredetails_edit_btn"
                          onClick={() => hanldeEditStructurePayment(item.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="structuredetails_delete_btn"
                          onClick={() => handleDeletePayment(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                    {role === "Admin" && (
                      <td>{item.updatedBy || "-"}</td> // Conditional rendering of updatedBy
                    )}
                  </tr>
                ))
              )}
            </tbody>
            {filterSearch.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="2">
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>₹ {totalAmount.toLocaleString()}</strong>
                  </td>
                  <td colSpan="3"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {StructurePaymentForm && (
        <div className="structuralPaymentAddform-overlay">
          <form
            className="structuralPaymentAddform-form"
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              className="structuralPaymentAddform-closeBtn"
              onClick={() => setStructurePaymentForm(false)}
            >
              ✕
            </button>

            <h2 className="structuralPaymentAddform-title">Add Payment</h2>

            <div className="structuralPaymentAddform-field">
              <label>Payable Name</label>
              <input
                type="text"
                value={payableName}
                onChange={(e) => setPayableName(e.target.value)}
                required
              />
            </div>

            <div className="structuralPaymentAddform-field">
              <label>Remark</label>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                required
              />
            </div>

            <div className="structuralPaymentAddform-field">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="structuralPaymentAddform-field">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="structuralPaymentAddform-submitBtn"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      {ShowEditStructureForm && (
        <>
          <div className="structuralPaymentAddform-overlay">
            <form
              className="structuralPaymentAddform-form"
              onSubmit={handleupdatePayment}
            >
              <button
                type="button"
                className="structuralPaymentAddform-closeBtn"
                onClick={() => setShowEditStructureForm(false)}
              >
                ✕
              </button>

              <h2 className="structuralPaymentAddform-title">Edit Payment</h2>

              <div className="structuralPaymentAddform-field">
                <label>Payable Name</label>
                <input
                  type="text"
                  value={EditpayableName}
                  onChange={(e) => setEditpayableName(e.target.value)}
                />
              </div>

              <div className="structuralPaymentAddform-field">
                <label>Remark</label>
                <input
                  type="text"
                  value={Editremark}
                  onChange={(e) => setEditRemark(e.target.value)}
                />
              </div>

              <div className="structuralPaymentAddform-field">
                <label>Date</label>
                <input
                  type="date"
                  value={Editdate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>

              <div className="structuralPaymentAddform-field">
                <label>Amount</label>
                <input
                  type="number"
                  value={Editamount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="structuralPaymentAddform-submitBtn"
              >
                Submit
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default StructureDetail;
