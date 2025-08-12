import axios from "axios";
import { BASE_URL } from "../../config";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
function Addmeterial() {
  const { id } = useParams();
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
   const user = JSON.parse(localStorage.getItem("employeROyalmadeLogin"));
 
  const role = user?.role;
  const navigate = useNavigate();
  const [StockData, setStockData] = useState([]);
  const [StockName, setStockName] = useState("");
  const [StockPrice, setStockPrice] = useState("");
  const [StockQuantity, setStockQuantity] = useState("");
  const [StockDate, setStockDate] = useState("");
  const [showStockForm, setShowStockForm] = useState(false);
  const [searchStock, setSearchStock] = useState("");
  const [refreshKey, setrefreshkey] = useState(0);
  const [stockEditId, setStockEditId] = useState("");
  const [showStockEditForm, setShowStockEditForm] = useState(false);
  const [editStockDate, seteditStockDate] = useState("");
  const [editStockName, setEditStockName] = useState("");
  const [editStockTotalQuantity, seteditStockTotalQuantity] = useState("");
  const [editStockPrice, seteditStockPrice] = useState("");
  const [editStockUsedQuantity, seteditStockUsedQuantity] = useState("");
  const [editStockRemainingQuantity, seteditStockRemainingQuantity] =
    useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function getAllStock() {
      try {
        const response = await axios.get(`${BASE_URL}/products/project/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setStockData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllStock();
  }, [token, refreshKey]);

  const filterSearch = StockData.filter((item, index) => {
    return item.name.toLowerCase().includes(searchStock.toLowerCase());
  });

  async function handleAddNewStock(e) {
    e.preventDefault();
    setIsSubmitted(true);
    const body = {
      name: StockName,
      price: StockPrice,
      totalQuantityString: StockQuantity,
      productAddOnDate: StockDate,
      projectId: id,
    };
    console.log(body);
    try {
      const response = await axios.post(`${BASE_URL}/products/create`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Stock Added Successfully");
        setrefreshkey(refreshKey + 1);
        setStockDate("");
        setStockName("");
        setStockPrice("");
        setStockQuantity("");
        setShowStockForm(false);
      }
    } catch (error) {
      console.log(error);
       
    }finally{
      setIsSubmitted(false);
    }
  }

  function handleViewDetails(id, name) {
    navigate(`/StockDetails/${id}/${name}`);
  }
  async function handleStockDelete(id) {
    const confirmDelete = window.confirm("Are you sure to delete ?");
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(`${BASE_URL}/products/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        alert("Stock Delete Successfully");
        setrefreshkey(refreshKey + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEditStock(id) {
    setStockEditId(id);
    setShowStockEditForm(true);
    try {
      const response = await axios.get(`${BASE_URL}/products/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      seteditStockDate(response.data?.productAddOnDate);
      seteditStockPrice(response.data?.price);
      seteditStockRemainingQuantity(response.data?.remainingQuantity);
      seteditStockTotalQuantity(response.data?.totalQuantityString);
      seteditStockUsedQuantity(response.data?.usedQuantity);
      setEditStockName(response.data?.name);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleupdateStock(e) {
    e.preventDefault();
    const body = {
      name: editStockName,
      price: editStockPrice,
      totalQuantityString: editStockTotalQuantity,
      productAddOnDate: editStockDate,
      projectId: id,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/products/edit/${stockEditId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Stock Edit Successfully");
        setrefreshkey(refreshKey + 1);
        setShowStockEditForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: "25px" }}>Stock Details</h2>
      <div className="stock_search_add_container">
        <input
          type="search"
          className="stock_search_bar"
          value={searchStock}
          onChange={(e) => setSearchStock(e.target.value)}
          placeholder="Enter Stock Name.."
        />
        <button
          onClick={() => setShowStockForm(!showStockForm)}
          className="Add_stock_btn"
        >
          Add Stock
        </button>
      </div>
      {showStockForm && (
        <div className="Add_stock-popup-overlay">
          <form
            action=""
            className="Add_stock_form"
            onSubmit={handleAddNewStock}
          >
            <button
              onClick={() => setShowStockForm(false)}
              className="Add_stock_form_close_button"
            >
              X
            </button>
            <input
              type="text"
              placeholder="Enter Stock Name.. "
              className="Add_stock_input"
              value={StockName}
              onChange={(e) => setStockName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter Stock Price.."
              className="Add_stock_input"
              value={StockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter Stock Quantity.."
              className="Add_stock_input"
              value={StockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
            />
            <input
              type="date"
              className="Add_stock_input"
              value={StockDate}
              required
              onChange={(e) => setStockDate(e.target.value)}
            />
            <button className="Add_stock_submit_button">{isSubmitted?"Submitting...":"Submit"}</button>
          </form>
        </div>
      )}

      {StockData.length > 0 ? (
        <div className="add_stock_table_wrapper">
          <table className="add_stock_table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Stock Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th> Used Quantity</th>
                <th> Remaining Quantity</th>
                <th> Action</th>
                <th> Action</th>
                {role === "Admin" && <th> Updated By</th>}
              </tr>
            </thead>
            <tbody>
              {filterSearch.map((item, index) => (
                <tr key={index}>
                  <td>{item.productAddOnDate}</td>
                  <td>{item.name}</td>
                  <td>{item.totalQuantityString}</td>
                  <td>{item.price}</td>
                  <td>{item.usedQuantity}</td>
                  <td>{item.remainingQuantity}</td>
                  <td>
                    <button
                      onClick={() => handleViewDetails(item.id, item.name)}
                      className="Stock_view_btn"
                    >
                      View Details
                    </button>
                  </td>
                  <td>
                    <button
                      className="Stock_out_btn"
                      onClick={() => handleEditStock(item.id)}
                    >
                      Edit Stock
                    </button>{" "}
                    <br />
                    <button
                      className="Stock_out_btn"
                      onClick={() => handleStockDelete(item.id)}
                    >
                      Delete Stock
                    </button>
                  </td>
                  <td>{role === "Admin" && <td>{item.updatedBy}</td>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Stock Available</p>
      )}

      {showStockEditForm && (
        <div className="editStock_popup_form_overlay">
          <form className="editStock_popup_form" onSubmit={handleupdateStock}>
            <button
              type="button"
              onClick={() => setShowStockEditForm(false)}
              className="editStock_popup_form_close_button"
            >
              X
            </button>
            <label className="editStock_popup_form_label">Date</label>
            <input
              type="text"
              value={editStockDate}
              onChange={(e) => seteditStockDate(e.target.value)}
              className="editStock_popup_form_input"
            />
            <label className="editStock_popup_form_label">Stock Name</label>
            <input
              type="text"
              value={editStockName}
              onChange={(e) => setEditStockName(e.target.value)}
              className="editStock_popup_form_input"
            />
            <label className="editStock_popup_form_label">
              Stock Total Quantity
            </label>
            <input
              type="text"
              value={editStockTotalQuantity}
              onChange={(e) => seteditStockTotalQuantity(e.target.value)}
              className="editStock_popup_form_input"
            />
            <label className="editStock_popup_form_label">Stock Price</label>
            <input
              type="text"
              value={editStockPrice}
              onChange={(e) => seteditStockPrice(e.target.value)}
              className="editStock_popup_form_input"
            />
            <label className="editStock_popup_form_label">Used Quantity</label>
            <input
              type="text"
              value={editStockUsedQuantity}
              onChange={(e) => seteditStockUsedQuantity(e.target.value)}
              className="editStock_popup_form_input"
            />
            <label className="editStock_popup_form_label">
              Remaining Quantity
            </label>
            <input
              type="text"
              value={editStockRemainingQuantity}
              onChange={(e) => seteditStockRemainingQuantity(e.target.value)}
              className="editStock_popup_form_input"
            />
            <button
              type="submit"
              className="editStock_popup_form_submit_button"
            >
              Update Stock
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Addmeterial;
