import { useEffect, useState, useRef } from "react";
import "../office/office.css";
import { BASE_URL } from "../../config";
import html2pdf from "html2pdf.js";
import { NotebookPen, Search } from "lucide-react";
import axios from "axios";

function Office() {
  const printOfficeTableRefs = useRef({});
  const token = JSON.parse(localStorage.getItem("employeROyalmadeLogin"))?.token;
  const [officeExpenseData, setOfficeExpenseData] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Expenses");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table");
  const expensesPerPage = 12;
  const [showAddOfficeExpense, setShowAddOfficeExpense] = useState(false);
  const [officeGiverName, setOfficeGiverName] = useState("");
  const [officeReceiverName, setOfficeReceiverName] = useState("");
  const [officeRemark, setOfficeRemark] = useState("");
  const [officeAmount, setOfficeAmount] = useState("");
  const [officeDate, setOfficeDate] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [editOfficeExpenseId, setEditOfficeExpenseId] = useState("");
  const [showOfficeExpenseEditForm, setShowOfficeExpenseEditForm] = useState(false);
  const [editOfficeGiverName, setEditOfficeGiverName] = useState("");
  const [editOfficeReceiverName, setEditOfficeReceiverName] = useState("");
  const [editOfficeRemark, setEditOfficeRemark] = useState("");
  const [editOfficeAmount, setEditOfficeAmount] = useState("");
  const [editOfficeDate, setEditOfficeDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalFilteredAmount, setTotalFilteredAmount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
 const user = JSON.parse(localStorage.getItem("employeROyalmadeLogin"));
 
  const role = user?.role;
  useEffect(() => {
    async function getAllOfficeExpense() {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/office-expenses`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setOfficeExpenseData(response.data);
        setFilteredExpenses(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to load office expenses. Please try again.");
        setIsLoading(false);
      }
    }
    getAllOfficeExpense();
  }, [token, refreshKey]);

  useEffect(() => {
    let filtered = officeExpenseData.filter(
      (expense) =>
        expense.remark?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.reciverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.giverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.amount?.toString().includes(searchQuery)
    );

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      });
    }

    if (activeFilter !== "All Expenses") {
      const amount = Number.parseFloat(activeFilter.split(" ")[0]);
      if (activeFilter.includes("High")) {
        filtered = filtered.filter((expense) => Number.parseFloat(expense.amount) >= 10000);
      } else if (activeFilter.includes("Medium")) {
        filtered = filtered.filter(
          (expense) =>
            Number.parseFloat(expense.amount) >= 5000 &&
            Number.parseFloat(expense.amount) < 10000
        );
      } else if (activeFilter.includes("Low")) {
        filtered = filtered.filter((expense) => Number.parseFloat(expense.amount) < 5000);
      }
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "amount") {
          aValue = Number.parseFloat(aValue) || 0;
          bValue = Number.parseFloat(bValue) || 0;
        } else if (sortConfig.key === "date") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    const total = filtered.reduce(
      (sum, expense) => sum + (Number.parseFloat(expense.amount) || 0),
      0
    );
    setTotalFilteredAmount(total);
    setFilteredExpenses(filtered);
    setCurrentPage(1);
  }, [searchQuery, officeExpenseData, activeFilter, sortConfig, startDate, endDate]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleShowAllData = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setActiveFilter("All Expenses");
    setSortConfig({ key: null, direction: "ascending" });
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);
  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteExpense = async (id) => {
    const deleteConfirm = window.confirm("Are you sure you want to delete this expense?");
    if (!deleteConfirm) return;

    try {
      const response = await axios.delete(`${BASE_URL}/office-expenses/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        alert("Expense deleted successfully");
        const updatedExpenses = officeExpenseData.filter((expense) => expense.id !== id);
        setOfficeExpenseData(updatedExpenses);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to delete expense");
    }
  };

  async function handleAddOfficeExpense(e) {
    e.preventDefault();
    setIsSubmitted(true);
    const body = {
      date: officeDate,
      reciverName: officeReceiverName,
      giverName: officeGiverName,
      amount: officeAmount,
      remark: officeRemark,
    };
    try {
      const response = await axios.post(`${BASE_URL}/office-expenses/create`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        alert("Office Expense Add SuccessFully");
        setRefreshKey(refreshKey + 1);
        setOfficeAmount("");
        setOfficeDate("");
        setOfficeGiverName("");
        setOfficeReceiverName("");
        setOfficeRemark("");
        setShowAddOfficeExpense(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitted(false);
    }
  }

  async function handleEditOfficeExpense(id) {
    setEditOfficeExpenseId(id);
    setShowOfficeExpenseEditForm(true);
    try {
      const response = await axios.get(`${BASE_URL}/office-expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setEditOfficeReceiverName(response.data?.reciverName);
      setEditOfficeAmount(response.data?.amount);
      setEditOfficeDate(response.data?.date);
      setEditOfficeGiverName(response.data?.giverName);
      setEditOfficeRemark(response.data?.remark);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateOfficeExpense(e) {
    e.preventDefault();
    const body = {
      date: editOfficeDate,
      reciverName: editOfficeReceiverName,
      giverName: editOfficeGiverName,
      amount: editOfficeAmount,
      remark: editOfficeRemark,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/office-expenses/update/${editOfficeExpenseId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("office expense update successfully");
        setRefreshKey((ref) => ref + 1);
        setEditOfficeAmount("");
        setEditOfficeReceiverName("");
        setEditOfficeDate("");
        setEditOfficeGiverName("");
        setEditOfficeRemark("");
        setShowOfficeExpenseEditForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handlePrintOfficeExpense = (id) => {
    const element = printOfficeTableRefs.current[id];
    if (!element) {
      alert("Printable table not found.");
      return;
    }

    const opt = {
      margin: 0.3,
      filename: `OfficeExpense_${id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      <div className="office-office-wrapper">
        <div className="office-office-header">
          <div className="office-office-header-bg">
            <div className="office-animated-shape office-shape-1"></div>
            <div className="office-animated-shape office-shape-2"></div>
            <div className="office-animated-shape office-shape-3"></div>
            <div className="office-animated-shape office-shape-4"></div>
          </div>
          <div className="office-office-header-content">
            <h1 className="office-office-title">Office Expense Management</h1>
          </div>
        </div>

        <div className="office-office-controls">
          <div className="office-search-wrapper">
            <input
              type="text"
              placeholder="Search by remark, receiver, giver, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="office-office-search-input"
              aria-label="Search expenses"
            />
            <span className="office-search-icon">
              <Search />
            </span>
          </div>

          <div className="office-date-range-wrapper">
            <div className="office-date-input">
              <label htmlFor="start-date" className="office-date-label">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="office-office-search-input"
                aria-label="Start date"
              />
            </div>
            <div className="office-date-input">
              <label htmlFor="end-date" className="office-date-label">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="office-office-search-input"
                aria-label="End date"
              />
            </div>
          </div>

          <div className="office-total-amount">
            <h3>Total Amount: {formatCurrency(totalFilteredAmount)}</h3>
          </div>

          <div className="office-view-controls">
            <div className="office-view-toggle">
              <button
                className={`office-view-toggle-btn ${viewMode === "cards" ? "office-active" : ""}`}
                onClick={() => setViewMode("cards")}
              >
                <span className="office-view-icon">🃏</span>
                <span className="office-view-text">Cards</span>
              </button>
              <button
                className={`office-view-toggle-btn ${viewMode === "table" ? "office-active" : ""}`}
                onClick={() => setViewMode("table")}
              >
                <span className="office-view-icon">📋</span>
                <span className="office-view-text">Table</span>
              </button>
            </div>

            <div className="office-filter-and-sort">
              <button
                className="office-add-expense-btn"
                onClick={() => setShowAddOfficeExpense(!showAddOfficeExpense)}
              >
                <span className="office-btn-icon">+</span>
                <span>Add Expense</span>
              </button>
              <button className="office-show-all-btn" onClick={handleShowAllData}>
                <span className="office-btn-icon">↻</span>
                <span>Show All Data</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="office-office-error">
            <div className="office-error-icon">!</div>
            <div className="office-error-content">
              <h4>Error Occurred</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="office-office-loading">
            <div className="office-loading-animation">
              <div className="office-loading-circle"></div>
              <div className="office-loading-circle"></div>
              <div className="office-loading-circle"></div>
            </div>
            <p>Loading office expenses...</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="office-expense-container">
            {currentExpenses.length > 0 ? (
              <>
                {viewMode === "cards" ? (
                  <div className="office-stationary-card-container">
                    {currentExpenses.map((expense, index) => (
                      <div key={expense.id || index}>
                        <div className="office-stationary-card">
                          <div className="office-stationary-card-header">
                            <h3>
                              <span className="office-card-icon">
                                <NotebookPen />
                              </span>
                            </h3>
                            <div className="office-stationary-price">
                              {formatCurrency(expense.amount)}
                            </div>
                          </div>
                          <div className="office-stationary-card-body">
                            <div className="office-stationary-info">
                              <div className="office-info-item">
                                <span className="office-info-label">Date</span>
                                <span className="office-info-value">{formatDate(expense.date)}</span>
                              </div>
                              <div className="office-info-item">
                                <span className="office-info-label">Description</span>
                                <span className="office-info-value">{expense.remark}</span>
                              </div>
                              <div className="office-info-item">
                                <span className="office-info-label">From</span>
                                <span className="office-info-value">{expense.giverName}</span>
                              </div>
                              <div className="office-info-item">
                                <span className="office-info-label">To</span>
                                <span className="office-info-value">{expense.reciverName}</span>
                              </div>
                              <div className="office-info-item">
                              {role === "Admin" && <th style={{ border: "1px solid black", padding: "8px" }}>Updated By</th>}
                               {role === "Admin" && <span className="office-info-value">{expense.updatedBy}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="office-stationary-card-actions">
                            <button
                              className="office-action-btn office-edit-btn"
                              onClick={() => handleEditOfficeExpense(expense.id)}
                            >
                              <span>Edit</span>
                            </button>
                            <button
                              className="office-action-btn office-delete-btn"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              <span>Delete</span>
                            </button>
                            <button
                              className="office-action-btn office-print-btn"
                              onClick={() => handlePrintOfficeExpense(expense.id)}
                            >
                              <span>Print</span>
                            </button>
                          </div>
                        </div>
                        <div style={{ display: "none" }}>
                          <table
                            ref={(el) => (printOfficeTableRefs.current[expense.id] = el)}
                            style={{ borderCollapse: "collapse", width: "100%" }}
                          >
                            <thead>
                              <tr>
                                <th style={{ border: "1px solid black", padding: "8px" }}>Date</th>
                                <th style={{ border: "1px solid black", padding: "8px" }}>Description</th>
                                <th style={{ border: "1px solid black", padding: "8px" }}>From</th>
                                <th style={{ border: "1px solid black", padding: "8px" }}>To</th>
                                <th style={{ border: "1px solid black", padding: "8px" }}>Amount</th>
                                {role === "Admin" && <th style={{ border: "1px solid black", padding: "8px" }}>Updated By</th>}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ border: "1px solid black", padding: "8px" }}>
                                  {formatDate(expense.date)}
                                </td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>{expense.remark}</td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>{expense.giverName}</td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>{expense.reciverName}</td>
                                <td style={{ border: "1px solid black", padding: "8px" }}>
                                  {formatCurrency(expense.amount)}
                                </td>
                               {role === "Admin" && <td style={{ border: "1px solid black", padding: "8px" }}>{expense.updatedBy}</td>}

                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="office-expense-table-container">
                    <table className="office-expense-table">
                      <thead>
                        <tr>
                          <th onClick={() => requestSort("date")} aria-sort={sortConfig.key === "date" ? sortConfig.direction : "none"}>
                            Date
                            {sortConfig.key === "date" && (
                              <span className="office-sort-icon">
                                {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                              </span>
                            )}
                          </th>
                          <th onClick={() => requestSort("remark")} aria-sort={sortConfig.key === "remark" ? sortConfig.direction : "none"}>
                            Description
                            {sortConfig.key === "remark" && (
                              <span className="office-sort-icon">
                                {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                              </span>
                            )}
                          </th>
                          <th onClick={() => requestSort("giverName")} aria-sort={sortConfig.key === "giverName" ? sortConfig.direction : "none"}>
                            From
                            {sortConfig.key === "giverName" && (
                              <span className="office-sort-icon">
                                {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                              </span>
                            )}
                          </th>
                          <th onClick={() => requestSort("reciverName")} aria-sort={sortConfig.key === "reciverName" ? sortConfig.direction : "none"}>
                            To
                            {sortConfig.key === "reciverName" && (
                              <span className="office-sort-icon">
                                {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                              </span>
                            )}
                          </th>
                          <th onClick={() => requestSort("amount")} aria-sort={sortConfig.key === "amount" ? sortConfig.direction : "none"}>
                            Amount
                            {sortConfig.key === "amount" && (
                              <span className="office-sort-icon">
                                {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                              </span>
                            )}
                          </th>
                          <th>Actions</th>
                          {role === "Admin" && <th>Updated By</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {currentExpenses.map((expense, index) => (
                          <tr key={expense.id || index}>
                            <td>{formatDate(expense.date)}</td>
                            <td>{expense.remark}</td>
                            <td>{expense.giverName}</td>
                            <td>{expense.reciverName}</td>
                            <td className="office-amount-cell">{formatCurrency(expense.amount)}</td>
                            

                            <td className="office-action-cell">
                              <button
                                className="office-action-btn office-edit-btn"
                                onClick={() => handleEditOfficeExpense(expense.id)}
                                aria-label={`Edit expense ${expense.id}`}
                              >
                                Edit
                              </button>
                              <button
                                className="office-action-btn office-delete-btn"
                                onClick={() => handleDeleteExpense(expense.id)}
                                aria-label={`Delete expense ${expense.id}`}
                              >
                                Delete
                              </button>
                              <button
                                className="office-action-btn office-print-btn"
                                onClick={() => handlePrintOfficeExpense(expense.id)}
                                aria-label={`Print expense ${expense.id}`}
                              >
                                Print
                              </button>
                            </td>
                           {role === "Admin" && <td>{expense.updatedBy}</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {currentExpenses.map((expense) => (
                      <div key={expense.id} style={{ display: "none" }}>
                        <table
                          ref={(el) => (printOfficeTableRefs.current[expense.id] = el)}
                          style={{ borderCollapse: "collapse", width: "100%" }}
                        >
                          <thead>
                            <tr>
                              <th style={{ border: "1px solid black", padding: "8px" }}>Date</th>
                              <th style={{ border: "1px solid black", padding: "8px" }}>Description</th>
                              <th style={{ border: "1px solid black", padding: "8px" }}>From</th>
                              <th style={{ border: "1px solid black", padding: "8px" }}>To</th>
                              <th style={{ border: "1px solid black", padding: "8px" }}>Amount</th>
                              {role === "Admin" && <th style={{ border: "1px solid black", padding: "8px" }}>Updated By</th>}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={{ border: "1px solid black", padding: "8px" }}>
                                {formatDate(expense.date)}
                              </td>
                              <td style={{ border: "1px solid black", padding: "8px" }}>{expense.remark}</td>
                              <td style={{ border: "1px solid black", padding: "8px" }}>{expense.giverName}</td>
                              <td style={{ border: "1px solid black", padding: "8px" }}>{expense.reciverName}</td>
                              <td style={{ border: "1px solid black", padding: "8px" }}>
                                {formatCurrency(expense.amount)}
                              </td>
                              {role === "Admin" && <td style={{ border: "1px solid black", padding: "8px" }}>{expense.updatedBy}</td>}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                    <div className="office-pagination-container">
                      <div className="office-pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => paginate(page)}
                            className={`office-pagination-btn ${currentPage === page ? "office-active" : ""}`}
                            aria-label={`Go to page ${page}`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="office-office-no-data">
                <div className="office-no-data-content">
                  <div className="office-no-data-icon">📊</div>
                  <h3>No Office Expenses Found</h3>
                  <p>
                    {searchQuery || startDate || endDate
                      ? "Try adjusting your search criteria, date range, or filters"
                      : "No office expenses have been recorded yet"}
                  </p>
                  <button
                    className="office-add-expense-btn-small"
                    onClick={() => setShowAddOfficeExpense(true)}
                  >
                    <span className="office-btn-icon">+</span>
                    <span>Add First Expense</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddOfficeExpense && (
        <div className="office-addofficeExpenseform-overlay">
          <div className="office-addofficeExpenseform-container">
            <button
              onClick={() => setShowAddOfficeExpense(false)}
              className="office-addofficeExpenseform-close-button"
              aria-label="Close add expense form"
            >
              ✕
            </button>
            <h2 className="office-addofficeExpenseform-title">Add Office Expense</h2>
            <form className="office-addofficeExpenseform-form" onSubmit={handleAddOfficeExpense}>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Giver Name"
                  className="office-addofficeExpenseform-input"
                  value={officeGiverName}
                  onChange={(e) => setOfficeGiverName(e.target.value)}
                  required
                  aria-label="Giver Name"
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Receiver Name"
                  className="office-addofficeExpenseform-input"
                  value={officeReceiverName}
                  onChange={(e) => setOfficeReceiverName(e.target.value)}
                  required
                  aria-label="Receiver Name"
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Remark"
                  className="office-addofficeExpenseform-input"
                  value={officeRemark}
                  onChange={(e) => setOfficeRemark(e.target.value)}
                  required
                  aria-label="Remark"
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="office-addofficeExpenseform-input"
                  value={officeAmount}
                  onChange={(e) => setOfficeAmount(e.target.value)}
                  required
                  aria-label="Amount"
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="date"
                  className="office-addofficeExpenseform-input"
                  value={officeDate}
                  onChange={(e) => setOfficeDate(e.target.value)}
                  required
                  aria-label="Date"
                />
              </div>
              <button
                type="submit"
                className="office-addofficeExpenseform-submit-button"
                disabled={isSubmitted}
              >
                {isSubmitted ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showOfficeExpenseEditForm && (
        <div className="office-addofficeExpenseform-overlay">
          <div className="office-addofficeExpenseform-container">
            <button
              onClick={() => setShowOfficeExpenseEditForm(false)}
              className="office-addofficeExpenseform-close-button"
              aria-label="Close edit expense form"
            >
              ✕
            </button>
            <h2 className="office-addofficeExpenseform-title">Edit Office Expense</h2>
            <form className="office-addofficeExpenseform-form" onSubmit={handleUpdateOfficeExpense}>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Giver Name"
                  className="office-addofficeExpenseform-input"
                  value={editOfficeGiverName}
                  onChange={(e) => setEditOfficeGiverName(e.target.value)}
                  aria-label="Giver Name"
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Receiver Name"
                  className="office-addofficeExpenseform-input"
                  value={editOfficeReceiverName}
                  onChange={(e) => setEditOfficeReceiverName(e.target.value)}
                  aria-label="Receiver Name"
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="text"
                  placeholder="Enter Remark"
                  className="office-addofficeExpenseform-input"
                  value={editOfficeRemark}
                  onChange={(e) => setEditOfficeRemark(e.target.value)}
                  aria-label="Remark"
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="office-addofficeExpenseform-input"
                  value={editOfficeAmount}
                  onChange={(e) => setEditOfficeAmount(e.target.value)}
                  aria-label="Amount"
                />
              </div>
              <div className="office-addofficeExpenseform-field">
                <input
                  type="date"
                  className="office-addofficeExpenseform-input"
                  value={editOfficeDate}
                  onChange={(e) => setEditOfficeDate(e.target.value)}
                  aria-label="Date"
                />
              </div>
              <button type="submit" className="office-addofficeExpenseform-submit-button">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Office;