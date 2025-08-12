import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";
import "../material/stockDetail.css";
function StockDetails() {
  const { id, name } = useParams();
  console.log(name);
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [refreshKey, setrefreshkey] = useState(0);
  const [existingStockId, setExistingStokId] = useState("");
  const [ShowExistingAddStokForm, setShowExistingAddStokForm] = useState(false);
  const [existingStockAmout, setexistingStockAmout] = useState("");
  const [existingStockQuantity, setexistingStockQuantity] = useState("");
  const [existingStockUsedId, setExistingStockUsedId] = useState("");
  const [existingStockUsedFormShow, setExistingStockUsedFormShow] =
    useState(false);
  const [usedQuantity, setUsedQuantity] = useState("");
  const [HistoryUsedStock, setHistoryUsedStock] = useState([]);
  const [stockOutDetailsShow, setstockOutDetailsShow] = useState(false);
  const [ShowAddStockDetails, setShowAddStockDetails] = useState(false);
  const [stockIndata, setStockIndata] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleAddExistingStock(id) {
    setExistingStokId(id);
    setShowExistingAddStokForm(true);
    setstockOutDetailsShow(false);
    setShowAddStockDetails(false);
  }
  async function handleupdateexistingStock(e) {
    e.preventDefault();
    setIsSubmitted(true);

    const data = new URLSearchParams();
    data.append("price", existingStockAmout);
    data.append("quantityString", existingStockQuantity);

    try {
      const response = await axios.post(
        `${BASE_URL}/products/${existingStockId}/add-stock`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        alert("Details Added Successfully");
        setrefreshkey(refreshKey + 1);
        setexistingStockAmout("");
        setexistingStockQuantity("");
        setShowExistingAddStokForm(false);
      }
    } catch (error) {
      console.log("Error adding stock:", error);
      setIsSubmitted(false);
    }
  }

  function handleStockUsed(id) {
    setExistingStockUsedId(id);
    setExistingStockUsedFormShow(true);
    setstockOutDetailsShow(false);
    setShowAddStockDetails(false);
  }
  async function handleAddUsedQuantity(e) {
    e.preventDefault();
    setIsSubmitted(true);
    if (!token) {
      alert("token is unavailable");
    }

    const body = {
      quantityUsed: usedQuantity,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/products/${existingStockUsedId}/use-stock`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Quantity removed successfully");
        setrefreshkey(refreshKey + 1);
        setUsedQuantity("");
        setExistingStockUsedFormShow(false);
      }
    } catch (error) {
      console.error("Error using stock:", error);
      setIsSubmitted(false);
      alert("Error using stock. Please try again.");
    }
  }

  async function handleCheckHistory(id) {
    setShowAddStockDetails(false);
    setstockOutDetailsShow(true);
    try {
      const response = await axios.get(`${BASE_URL}/products/${id}/usages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setHistoryUsedStock(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleShowAddStoreDetail(id) {
    setstockOutDetailsShow(false);
    setShowAddStockDetails(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/products/${id}/stock-in-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setStockIndata(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <h2
        style={{ marginLeft: "25px", marginTop: "40px", textAlign: "center" }}
      >
        {name} Stock Details
      </h2>
      <div className="stock_details_button_container">
        <button
          onClick={() => handleAddExistingStock(id)}
          className="Stock_in_btn"
        >
          Stock In
        </button>
        <button onClick={() => handleStockUsed(id)} className="Stock_in_btn">
          Stock Out{" "}
        </button>
        <button onClick={() => handleCheckHistory(id)} className="Stock_in_btn">
          View Used Stock Details
        </button>
        <button
          className="Stock_in_btn"
          onClick={() => handleShowAddStoreDetail(id)}
        >
          View Add Stock Details
        </button>
      </div>

      {ShowExistingAddStokForm && (
        <>
          <div className="existing_stock_add_form_wrapper">
            <form
              action=""
              className="existing_stock_add_form"
              onSubmit={handleupdateexistingStock}
            >
              <button
                onClick={() => setShowExistingAddStokForm(false)}
                className="existing_stock_add_form_close_button"
              >
                X
              </button>
              <input
                type="text"
                placeholder="Enter Price"
                className="existing_stock_add_form_input"
                value={existingStockAmout}
                onChange={(e) => setexistingStockAmout(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Quantity"
                className="existing_stock_add_form_input"
                value={existingStockQuantity}
                onChange={(e) => setexistingStockQuantity(e.target.value)}
                required
              />
              <button className="existing_stock_add_form_submit_btn">
               {isSubmitted?"Submitting...":"Submit"}
              </button>
            </form>
          </div>
        </>
      )}
      {existingStockUsedFormShow && (
        <div className="usedstock_form_overlay">
          <form
            className="usedQuantiyStock_form"
            onSubmit={handleAddUsedQuantity}
          >
            <button
              type="button"
              onClick={() => setExistingStockUsedFormShow(false)}
              className="usedstock_form_close_button"
            >
              X
            </button>
            <input
              type="text"
              className="usedstock_form_input"
              placeholder="Enter Used Quantity"
              value={usedQuantity}
              onChange={(e) => setUsedQuantity(e.target.value)}
              required
            />
            <button type="submit" className="usedstock_form_submit_button">
               {isSubmitted?"Submitting...":"Submit"}
            </button>
          </form>
        </div>
      )}
      {stockOutDetailsShow && HistoryUsedStock.length > 0 && (
        <div className="usedStocktable-responsive-wrapper">
          <h2>Stock Out Details</h2>
          <table className="usedStockDetailTable">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Quantity Used</th>
                <th>Date Used</th>
              </tr>
            </thead>
            <tbody>
              {HistoryUsedStock.length > 0 ? (
                HistoryUsedStock.map((item, index) => {
                  const dateObj = new Date(item.usedAt);
                  const day = String(dateObj.getDate()).padStart(2, "0");
                  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
                  const year = dateObj.getFullYear();
                  const formattedDate = `${day}-${month}-${year}`;

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.quantityUsed}</td>
                      <td>{formattedDate}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {ShowAddStockDetails && stockIndata.length > 0 && (
        <table className="stockIndetails">
          <thead>
            <tr>
              <th>ID</th>
              <th>Quantity Added</th>
              <th>Price Added</th>
              <th>Added At</th>
            </tr>
          </thead>
          <tbody>
            {stockIndata.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.quantityAddedValue}</td>
                <td>{item.priceAdded}</td>
                <td>{new Date(item.addedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default StockDetails;
