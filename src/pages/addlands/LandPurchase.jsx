import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddLand.css";
import ReactPaginate from "react-paginate";
import { BASE_URL } from "../../config";
import { IoIosAddCircle } from "react-icons/io";
import { LuView } from "react-icons/lu";
import { GrFormView } from "react-icons/gr";
import { TiEdit } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";
// Validation utility functions
const validateName = (name) => {
  if (!name) return "Name is required";
  if (!/^[a-zA-Z\s]+$/.test(name))
    return "Name should contain only letters and spaces";
  return "";
};

const validateCity = (city) => {
  if (!city) return "City is required";
  if (!/^[a-zA-Z\s]+$/.test(city))
    return "City should contain only letters and spaces";
  return "";
};

const validatePhoneNumber = (phone) => {
  if (!phone) return "Phone number is required";
  if (!/^\d{10}$/.test(phone)) return "Phone number must be 10 digits";
  return "";
};

const validateAmount = (amount) => {
  if (!amount) return "Amount is required";
  if (isNaN(amount) || Number(amount) <= 0)
    return "Amount must be a positive number";
  return "";
};

const validateDate = (date) => {
  if (!date) return "Date is required";
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate > today) return "Date cannot be in the future";
  return "";
};

function LandPurchase() {
  
  const [getLand, setGetLand] = useState([]);
  const [showCard, setShowCard] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [patnerPay, setPatnerPay] = useState(false);
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [addPatnerPay, setAddPatnerPay] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const [showPatnerTable, setShowPatnerTable] = useState(false);
  const [showSinglePatnerData, setShowSinglePatnerData] = useState(false);
  const [patnerData, setPatnerData] = useState({});
  const [patnerId, setPatnerId] = useState("");
  const [patnerPaymentForm, setPatnerPaymentForm] = useState(false);
  const [partnerName, setPartnerName] = useState("PARTNER");
  const [existingPaymentDate, setExistingPaymentDate] = useState("");
  const [existingAmount, setExistingAmount] = useState("");
  const [transactionMode, setTransactionMode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [note, setNote] = useState("");
  const [showAddPatnerForm, setShowAddPatnerForm] = useState(false);
  const [newPatnerId, setNewPatnerId] = useState("");
  const [newPatnerName, setNewPatnerName] = useState("");
  const [newPatnerCity, setNewPatnerCity] = useState("");
  const [newPatnerPhoneNumber, setNewPatnerPhoneNumber] = useState("");
  const [showEditPatnerPayment, setShowEditPatnerPayment] = useState(false);
  const [patnerPaymentEditId, setPatnerPaymentEditId] = useState("");
  const [editPatnerPaymentName, setEditPatnerPaymentName] = useState("");
  const [editPatnerPaymentDate, setEditPatnerPaymentDate] = useState("");
  const [editPatnerPaymentAmount, setEditPatnerPaymentAmount] = useState("");
  const [
    editPatnerPaymentTransactionMode,
    setEditPatnerPaymentTransactionMode,
  ] = useState("");
  const [editPatnerPaymentMethod, setEditPatnerPaymentMethod] = useState("");
  const [editPatnerPaymentNote, setEditPatnerPaymentNote] = useState("");
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [showExpensesList, setShowExpensesList] = useState(false);
  const [expenseLandId, setExpenseLandId] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditExpenseForm, setShowEditExpenseForm] = useState(false); // New state for edit form
  const [editExpenseId, setEditExpenseId] = useState(""); // New state for expense ID being edited
  const [editExpenseName, setEditExpenseName] = useState(""); // New state for expense name
  const [editExpenseAmount, setEditExpenseAmount] = useState(""); // New state for expense amount

  // Validation error states
  const [errors, setErrors] = useState({
    stateName: "",
    cityName: "",
    phoneNumber: "",
    amount: "",
    paymentDate: "",
    newPatnerName: "",
    newPatnerCity: "",
    newPatnerPhoneNumber: "",
    existingAmount: "",
    existingPaymentDate: "",
    transactionMode: "",
    paymentMethod: "",
    editPatnerPaymentAmount: "",
    editPatnerPaymentDate: "",
    editPatnerPaymentTransactionMode: "",
    editPatnerPaymentMethod: "",
    expenseName: "",
    expenseAmount: "",
    editExpenseName: "", // Added for edit expense validation
    editExpenseAmount: "", // Added for edit expense validation
  });
  const user = JSON.parse(localStorage.getItem("employeROyalmadeLogin"));
 
  const role = user?.role;

  useEffect(() => {
    async function getAllLand() {
      try {
        const response = await axios.get(`${BASE_URL}/getAllland`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        let sortedData = response.data.sort((a, b) => b.id - a.id);
        setGetLand(sortedData);
        setFilter(sortedData);
      } catch (error) {
        console.error("Error fetching land data:", error);
      }
    }

    getAllLand();
  }, [token, refreshKey]);

  async function handleDelete(id) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this land?"
    );
    if (!isConfirmed) return;

    try {
      const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Data deleted");
      setRefreshKey(refreshKey + 1);
      setGetLand((prevLands) => prevLands.filter((land) => land.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete data. Please try again.");
    }
  }
const handleRedirectToFlatlist = (projectId, newname) => {
  if (projectId) {
    navigate(`/flatlist/${projectId}`, {
      state: { newname }
    });
  } else {
    alert("Project ID not available.");
  }
};
  function handleEdit(id) {
    navigate(`/editland/${id}`);
  }

  async function handleShowAllData(id) {
    setShowPatnerTable(true);
    try {
      const response = await axios.get(`${BASE_URL}/land/${id}/partners`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setShowCard(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const searchFilter = getLand.filter((item) =>
      item.owner?.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilter(searchFilter);
  }, [search, getLand]);

  function handleStartProject(id) {
    navigate(`/flat/${id}`);
  }

  function handleAddLand() {
    navigate("/lands");
  }

  function handleAddPatnerPay(id) {
    setPatnerPay(true);
    setAddPatnerPay(id);
  }

  function validatePartnerPaymentForm() {
    const newErrors = {
      stateName: validateName(stateName),
      cityName: validateCity(cityName),
      phoneNumber: validatePhoneNumber(phoneNumber),
      amount: validateAmount(amount),
      paymentDate: validateDate(paymentDate),
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  }

  async function handlePaymentPartner(e) {
    e.preventDefault();
    if (!validatePartnerPaymentForm()) {
      return;
    }

    const formData = {
      name: stateName,
      city: cityName,
      phoneNumber,
      amount,
      paymentDate: paymentDate || new Date().toISOString().split("T")[0],
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/partnerpayment/${addPatnerPay}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRefreshKey(refreshKey + 1);
      alert("Partner payment added");
      setStateName("");
      setCityName("");
      setPhoneNumber("");
      setAmount("");
      setPaymentDate("");
      setErrors((prev) => ({
        ...prev,
        stateName: "",
        cityName: "",
        phoneNumber: "",
        amount: "",
        paymentDate: "",
      }));
      setPatnerPay(false);
    } catch (error) {
      console.log(error);
      alert("Failed to add partner payment. Please try again.");
    }
  }

  function validateAddExpenseForm() {
    const newErrors = {
      expenseName: validateName(expenseName),
      expenseAmount: validateAmount(expenseAmount),
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  }

  async function handleAddExpense(e) {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateAddExpenseForm()) {
      setIsSubmitting(false);
      return;
    }
    if (!expenseLandId) {
      alert("Invalid land ID. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const formData = {
      expenseName: expenseName,
      amount: expenseAmount,
    };
    try {
      console.log("Adding expense with payload:", formData);
      const response = await axios.post(
        `${BASE_URL}/land-expenses/${expenseLandId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response:", response);
      if (response.status === 201 || response.status === 200) {
        alert("Expense added successfully");
        setExpenseName("");
        setExpenseAmount("");
        setErrors((prev) => ({ ...prev, expenseName: "", expenseAmount: "" }));
        setShowAddExpenseForm(false);
        setRefreshKey((prev) => prev + 1);
        await handleViewExpenses(expenseLandId);
      }
    } catch (error) {
      console.error("Error adding expense:", error.response || error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add expense. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleViewExpenses(id) {
    setExpenseLandId(id);
    setShowExpensesList(true);
    try {
      const response = await axios.get(`${BASE_URL}/land-expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response:", response.data);
      const expensesData = Array.isArray(response.data.expenses)
        ? response.data.expenses
        : Array.isArray(response.data)
        ? response.data
        : [];
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch expenses. Please try again.";
      alert(errorMessage);
      setExpenses([]);
    }
  }

  async function handleEditExpense(id) {
    if (!id) {
      alert("No expense ID provided.");
      return;
    }
    if (!token) {
      alert("Please log in again.");
      navigate("/login");
      return;
    }

    console.log("Fetching expense with ID:", id);
    setEditExpenseId(id);
    setShowEditExpenseForm(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/land-expenses/GetById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response:", response.data);
      // Handle different response structures
      const expense = Array.isArray(response.data)
        ? response.data[0]
        : response.data.expense || response.data;
      setEditExpenseName(expense.expenseName || expense.name || "");
      setEditExpenseAmount(expense.amount || "");
      console.log("Form filled with:", {
        name: expense.expenseName || expense.name,
        amount: expense.amount,
      });
    } catch (error) {
      console.error("Fetch error:", error.response || error.message);
      alert("Failed to load expense. Please try again.");
      setShowEditExpenseForm(false);
    }
  }
  function validateEditExpenseForm() {
    const newErrors = {
      editExpenseName: validateName(editExpenseName),
      editExpenseAmount: validateAmount(Number(editExpenseAmount)),
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  }

  async function handleSubmitEditExpense(e) {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateEditExpenseForm()) {
      setIsSubmitting(false);
      return;
    }
    if (!editExpenseId || !expenseLandId) {
      alert("Invalid expense or land ID.");
      setIsSubmitting(false);
      return;
    }
    if (!token) {
      alert("Please log in again.");
      navigate("/login");
      setIsSubmitting(false);
      return;
    }

    const formData = {
      expenseName: editExpenseName,
      amount: Number(editExpenseAmount), // Convert to number
    };
    try {
      console.log(
        "Sending update for expense ID:",
        editExpenseId,
        "with data:",
        formData
      );
      const response = await axios.put(
        `${BASE_URL}/land-expenses/${editExpenseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Update response:", response.data);
      if ([200, 201, 204].includes(response.status)) {
        alert("Expense updated successfully!");
        // Update local state for instant UI update
        setExpenses((prev) =>
          prev.map((exp) =>
            exp.id === editExpenseId
              ? {
                  ...exp,
                  expenseName: editExpenseName,
                  amount: Number(editExpenseAmount),
                }
              : exp
          )
        );
        setShowEditExpenseForm(false);
        setEditExpenseName("");
        setEditExpenseAmount("");
        setErrors((prev) => ({
          ...prev,
          editExpenseName: "",
          editExpenseAmount: "",
        }));
        setRefreshKey((prev) => prev + 1);
        await handleViewExpenses(expenseLandId);
      }
    } catch (error) {
      console.error("Update error:", error.response || error.message);
      alert(
        error.response?.data?.message ||
          "Failed to update expense. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteExpense(id) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (!isConfirmed) return;

    if (!expenseLandId) {
      alert("Invalid land ID. Cannot refresh expenses list.");
      return;
    }

    try {
      const response = await axios.delete(`${BASE_URL}/land-expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Delete expense response:", response);
      if ([200, 204].includes(response.status)) {
        // Allow 200 or 204
        alert("Expense deleted successfully");
        // Optionally update state locally to avoid API call
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
        setRefreshKey((prev) => prev + 1);
        await handleViewExpenses(expenseLandId); // Refresh expenses list
      }
    } catch (error) {
      console.error("Error deleting expense:", error.response || error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete expense. Please try again.";
      alert(errorMessage);
    }
  }

  function handleOpenAddExpense(id) {
    setExpenseLandId(id);
    setShowAddExpenseForm(true);
  }

  const offset = currentPage * itemsPerPage;
  const currentItems = filter.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filter.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  async function handlePatnerShowDetail(id) {
    setShowSinglePatnerData(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/partner/${id}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPatnerData(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (patnerData?.id) {
      handlePatnerShowDetail(patnerData.id);
    }
  }, [refreshKey]);

  function handleNewPayment(id) {
    setPatnerId(id);
    setPatnerPaymentForm(true);
  }

  function validateExistingPaymentForm() {
    const newErrors = {
      existingAmount: validateAmount(existingAmount),
      existingPaymentDate: validateDate(existingPaymentDate),
      transactionMode: transactionMode ? "" : "Transaction mode is required",
      paymentMethod: paymentMethod ? "" : "Payment method is required",
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  }

  async function handleExistingPaymentAdd(e) {
    e.preventDefault();
    if (!validateExistingPaymentForm()) {
      return;
    }

    const formData = {
      madeBy: partnerName,
      transactionDate:
        existingPaymentDate || new Date().toISOString().split("T")[0],
      transactionAmount: existingAmount.replace(/,/g, ""),
      change: transactionMode,
      note,
      status: paymentMethod,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/addpayment/partner/${patnerId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        alert("Partner payment added successfully");
        setPatnerPaymentForm(false);
        setExistingAmount("");
        setExistingPaymentDate("");
        setTransactionMode("");
        setNote("");
        setPaymentMethod("");
        setErrors((prev) => ({
          ...prev,
          existingAmount: "",
          existingPaymentDate: "",
          transactionMode: "",
          paymentMethod: "",
        }));
        setRefreshKey(refreshKey + 1);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to add partner payment. Please try again.");
    }
  }

  function handleAddPatner(id) {
    setNewPatnerId(id);
    setShowAddPatnerForm(true);
  }

  function validateNewPartnerForm() {
    const newErrors = {
      newPatnerName: validateName(newPatnerName),
      newPatnerCity: validateCity(newPatnerCity),
      newPatnerPhoneNumber: validatePhoneNumber(newPatnerPhoneNumber),
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  }

  async function handleAddNewPatner(e) {
    e.preventDefault();
    if (!validateNewPartnerForm()) {
      return;
    }

    const formData = {
      name: newPatnerName,
      city: newPatnerCity,
      phoneNumber: newPatnerPhoneNumber,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/${newPatnerId}/partners`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Partner added successfully");
        setRefreshKey(refreshKey + 1);
        setShowAddPatnerForm(false);
        setNewPatnerCity("");
        setNewPatnerPhoneNumber("");
        setNewPatnerName("");
        setErrors((prev) => ({
          ...prev,
          newPatnerName: "",
          newPatnerCity: "",
          newPatnerPhoneNumber: "",
        }));
      }
    } catch (error) {
      console.log(error);
      alert("Failed to add partner. Please try again.");
    }
  }

  async function handleDeletePatnerPayment(id) {
    const deletePartnerPayment = window.confirm("Are you sure to delete?");
    if (!deletePartnerPayment) return;
    try {
      const response = await axios.delete(
        `${BASE_URL}/partner/transaction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Partner payment deleted");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to delete partner payment. Please try again.");
    }
  }

  async function handleEditPatnerPayment(id) {
    setPatnerPaymentEditId(id);
    setShowEditPatnerPayment(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/SinglePartnerPaymentById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEditPatnerPaymentName(response.data.madeBy);
      setEditPatnerPaymentAmount(response.data.transactionAmount);
      setEditPatnerPaymentDate(response.data.transactionDate);
      setEditPatnerPaymentMethod(response.data.status);
      setEditPatnerPaymentTransactionMode(response.data.change);
      setEditPatnerPaymentNote(response.data.note);
      setErrors((prev) => ({
        ...prev,
        editPatnerPaymentAmount: "",
        editPatnerPaymentDate: "",
        editPatnerPaymentTransactionMode: "",
        editPatnerPaymentMethod: "",
      }));
    } catch (error) {
      console.log(error);
      alert("Failed to fetch partner payment details. Please try again.");
    }
  }

  function validateEditPartnerPaymentForm() {
    const newErrors = {
      editPatnerPaymentAmount: validateAmount(editPatnerPaymentAmount),
      editPatnerPaymentDate: validateDate(editPatnerPaymentDate),
      editPatnerPaymentTransactionMode: editPatnerPaymentTransactionMode
        ? ""
        : "Transaction mode is required",
      editPatnerPaymentMethod: editPatnerPaymentMethod
        ? ""
        : "Payment method is required",
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  }

  async function handleSubmitEditPatnerPayment(e) {
    e.preventDefault();
    if (!validateEditPartnerPaymentForm()) {
      return;
    }

    const formData = {
      transactionDate: editPatnerPaymentDate,
      transactionAmount: editPatnerPaymentAmount,
      note: editPatnerPaymentNote,
      change: editPatnerPaymentTransactionMode,
      madeBy: editPatnerPaymentName,
      status: editPatnerPaymentMethod,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/UpdatePartner/payment/${patnerPaymentEditId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Partner payment edited successfully");
        setShowEditPatnerPayment(false);
        setRefreshKey((prev) => prev + 1);
        setErrors((prev) => ({
          ...prev,
          editPatnerPaymentAmount: "",
          editPatnerPaymentDate: "",
          editPatnerPaymentTransactionMode: "",
          editPatnerPaymentMethod: "",
        }));
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update partner payment. Please try again.");
    }
  }

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
        Land Purchase Details
      </h1>
      <div className="add_land_search">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ...."
        />
        <button onClick={handleAddLand}>Add land</button>
      </div>

      <div className="landshow_table_wrapper">
        {filter.length > 0 ? (
          <>
            <table className="land_show_table">
              <thead className="land_show_table_thead">
                <tr className="land_show_table_tr">
                  <th colSpan={1}>Owner Details</th>
                  <th colSpan={1}>AG-Construction</th>
                  <th colSpan={1}>Partners</th>
                  <th colSpan={1}>Address Details</th>
                  <th colSpan={1}>Total Amount</th>
                  <th colSpan={1}>Token Amount</th>
                  <th colSpan={1}>Agreement Amount</th>
                  <th colSpan={1}>Remaining Amount</th>
                  <th colSpan={1}>Add Partner</th>
                  <th colSpan={1}>Action</th>
                  <th colSpan={1}>Action</th>
                  <th colSpan={1}>Expenses</th>
                  <th colSpan={1}>Scheme</th>
                  {role === "Admin" && <th colSpan={1}>Updated By</th>}
                </tr>
              </thead>
              <tbody className="land_show_table_tbody">
                {currentItems.map((land, index) => (
                  <tr key={index}>
                    <td data-label="Owner Details">
                      {land?.owner?.name || "N/A"}
                    </td>
                    <td>{land?.purchaser?.name || "N/A"}</td>
                    <td colSpan={1}>
                      <ul>
                        {land?.partners?.map((partner) => (
                          <li key={partner.id}>
                            {partner?.name || "No Partner"}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      {land?.address?.city}, {land?.address?.state || "N/A"}
                    </td>
                    <td>
                      {land?.totalAmount
                        ? land.totalAmount.toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      {land?.tokenAmount
                        ? land.tokenAmount.toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      {land?.agreementAmount
                        ? land.agreementAmount.toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      {land?.totalAmount &&
                      land?.agreementAmount &&
                      land?.tokenAmount
                        ? Math.max(
                            0,
                            land.totalAmount -
                              (land.agreementAmount + land.tokenAmount)
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        onClick={() => handleAddPatner(land.id)}
                        className="land_show_addpatner_payment_button"
                      >
                        Add Partner
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(land.id)}
                        className="land_show_edit_button"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="mixed_button_add_land">
                      <button
                        onClick={() => handleDelete(land.id)}
                        className="land_show_delete_button"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleShowAllData(land.id)}
                        className="land_show_showCard_button"
                      >
                        Show
                      </button>
                      {land?.project === null && (
                        <button
                          onClick={() => handleStartProject(land.id)}
                          className="land_show_start_button"
                        >
                          Start
                        </button>
                      )}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <IoIosAddCircle
                          onClick={() => handleOpenAddExpense(land.id)}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "2px",
                            border: "none",
                            marginBottom: "2px",
                            fontSize: "25px",
                            cursor: "pointer",
                          }}
                        />
                        <GrFormView 
                          onClick={() => handleViewExpenses(land.id)}
                          style={{
                            backgroundColor: "#4b6f4cff",
                            color: "white",
                            padding: "2px",
                            border: "none",
                            fontSize: "25px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </td>
                    <td colSpan={1}>
                      <button
                        onClick={() =>
                          handleRedirectToFlatlist(land.project.id, land.project.name)
                        }
                        style={{
                          color: "blue",
                          textDecoration: "underline",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                       {land?.project?.name ? <BiBuildings /> : ""} {land?.project?.name}
                      </button>
                    </td>
                    {role === "Admin" && (
                      <td>{land?.updatedBy || "-"}</td> // Conditional rendering of updatedBy
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

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
          <p>No data available</p>
        )}
      </div>

      {showPatnerTable && (
        <div className="patner_table_main_wrapper">
          <button
            onClick={() => setShowPatnerTable(false)}
            className="patner_table_close_button"
          >
            X
          </button>
          <h3>Partner Details</h3>
          <table className="patner_table">
            <thead className="patner_table_thead">
              <tr className="patner_table_tr">
                <th>Sr.No</th>
                <th>Partner Name</th>
                <th>City</th>
                <th>Phone Number</th>
                <th>Action</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="patner_table_tbody">
              {showCard.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.city}</td>
                  <td>{item.phoneNumber}</td>
                  <td>
                    <button
                      onClick={() => handlePatnerShowDetail(item.id)}
                      className="patner_table_view_button"
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      className="patner_table_view_button"
                      onClick={() => handleNewPayment(item.id)}
                    >
                      Add Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showSinglePatnerData && patnerData && (
        <div className="single_patner_card_main_wrapper">
          <button
            onClick={() => setShowSinglePatnerData(false)}
            className="single_patner_cardclose_button"
          >
            X
          </button>
          <p>Partner Name: {patnerData.name}</p>
          <p>Partner City: {patnerData.city}</p>
          <p>Partner Number: {patnerData.phoneNumber}</p>
          <p>Total Amount: {patnerData.total}</p>
          <h2>Transaction Table</h2>
          <div className="singl_patner_table_wrapper">
            <table className="singl_patner_table">
              <thead className="singl_patner_table_thead">
                <tr>
                  <th>Partner</th>
                  <th>Transaction</th>
                  <th>Status</th>
                  <th>Transaction Amount</th>
                  <th>Transaction Date</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="singl_patner_table_tbody">
                {patnerData.landTransactions &&
                  patnerData.landTransactions.map((item, index) => (
                    <tr key={index}>
                      <td>{item.madeBy}</td>
                      <td>{item.change}</td>
                      <td>{item.status}</td>
                      <td>
                        {item.transactionAmount
                          ? item.transactionAmount.toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        {new Date(item.transactionDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td>{item.note}</td>
                      <td>
                        <button
                          onClick={() => handleEditPatnerPayment(item.id)}
                          className="handleEditPatnerPayment"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePatnerPayment(item.id)}
                          className="handledeletePatnerpayment"
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
      )}

      {patnerPaymentForm && (
        <div className="existing_patner_form_wrapper">
          <button
            onClick={() => setPatnerPaymentForm(false)}
            className="close_existing_patner_form"
          >
            X
          </button>
          <form
            className="existing_patner_form"
            onSubmit={handleExistingPaymentAdd}
          >
            <div>
              <input
                type="text"
                placeholder="Partner Name"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                required
                disabled
              />
            </div>
            <div>
              <input
                type="date"
                value={
                  existingPaymentDate || new Date().toISOString().split("T")[0]
                }
                onChange={(e) => {
                  setExistingPaymentDate(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    existingPaymentDate: validateDate(e.target.value),
                  }));
                }}
                required
              />
              {errors.existingPaymentDate && (
                <span className="error">{errors.existingPaymentDate}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Amount"
                value={existingAmount}
                onChange={(e) => {
                  setExistingAmount(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    existingAmount: validateAmount(e.target.value),
                  }));
                }}
                required
              />
              {errors.existingAmount && (
                <span className="error">{errors.existingAmount}</span>
              )}
            </div>
            <div>
              <select
                value={transactionMode}
                onChange={(e) => {
                  setTransactionMode(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    transactionMode: e.target.value
                      ? ""
                      : "Transaction mode is required",
                  }));
                }}
                required
              >
                <option value="">Transaction Mode</option>
                <option value="DEBIT">DEBIT</option>
                <option value="CREDIT">CREDIT</option>
              </select>
              {errors.transactionMode && (
                <span className="error">{errors.transactionMode}</span>
              )}
            </div>
            <div>
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    paymentMethod: e.target.value
                      ? ""
                      : "Payment method is required",
                  }));
                }}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="UPI">UPI</option>
                <option value="CASH">CASH</option>
                <option value="CHEQUE">CHEQUE</option>
                <option value="RTGS">RTGS</option>
                <option value="NEFT">NEFT</option>
              </select>
              {errors.paymentMethod && (
                <span className="error">{errors.paymentMethod}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <button className="existing_patner_form_submit_button">
              Submit
            </button>
          </form>
        </div>
      )}

      {patnerPay && (
        <div className="add_patner_payment_form_wrapper">
          <div className="close_patner_payment_form">
            <p onClick={() => setPatnerPay(false)}>X</p>
          </div>
          <form
            onSubmit={handlePaymentPartner}
            className="add_patner_payment_form"
          >
            <div>
              <input
                type="text"
                placeholder="Enter partner name"
                value={stateName}
                onChange={(e) => {
                  setStateName(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    stateName: validateName(e.target.value),
                  }));
                }}
                className="add_patner_payment_form_input"
                required
              />
              {errors.stateName && (
                <span className="error">{errors.stateName}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter city name"
                value={cityName}
                onChange={(e) => {
                  setCityName(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    cityName: validateCity(e.target.value),
                  }));
                }}
                className="add_patner_payment_form_input"
                required
              />
              {errors.cityName && (
                <span className="error">{errors.cityName}</span>
              )}
            </div>
            <div>
              <input
                type="number"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    phoneNumber: validatePhoneNumber(e.target.value),
                  }));
                }}
                className="add_patner_payment_form_input"
                required
              />
              {errors.phoneNumber && (
                <span className="error">{errors.phoneNumber}</span>
              )}
            </div>
            <div>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    amount: validateAmount(e.target.value),
                  }));
                }}
                className="add_patner_payment_form_input"
                required
              />
              {errors.amount && <span className="error">{errors.amount}</span>}
            </div>
            <div>
              <input
                type="date"
                placeholder="Enter payment date"
                value={paymentDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setPaymentDate(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    paymentDate: validateDate(e.target.value),
                  }));
                }}
                className="add_patner_payment_form_input"
                required
              />
              {errors.paymentDate && (
                <span className="error">{errors.paymentDate}</span>
              )}
            </div>
            <button className="add_patner_payment_form_submit_button">
              Submit
            </button>
          </form>
        </div>
      )}

      {showAddPatnerForm && (
        <form
          action=""
          className="add_patner_form"
          onSubmit={handleAddNewPatner}
        >
          <button
            onClick={() => setShowAddPatnerForm(false)}
            className="close_showAddpatnerForm"
          >
            X
          </button>
          <div>
            <input
              type="text"
              placeholder="Enter Partner Name"
              className="add_patner_form_input"
              value={newPatnerName}
              onChange={(e) => {
                setNewPatnerName(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  newPatnerName: validateName(e.target.value),
                }));
              }}
            />
            {errors.newPatnerName && (
              <span
                style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                className="error"
              >
                {errors.newPatnerName}
              </span>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter Partner City Name"
              className="add_patner_form_input"
              value={newPatnerCity}
              onChange={(e) => {
                setNewPatnerCity(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  newPatnerCity: validateCity(e.target.value),
                }));
              }}
            />
            {errors.newPatnerCity && (
              <span
                style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                className="error"
              >
                {errors.newPatnerCity}
              </span>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter Partner Phone Number"
              className="add_patner_form_input"
              value={newPatnerPhoneNumber}
              onChange={(e) => {
                setNewPatnerPhoneNumber(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  newPatnerPhoneNumber: validatePhoneNumber(e.target.value),
                }));
              }}
            />
            {errors.newPatnerPhoneNumber && (
              <span
                style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                className="error"
              >
                {errors.newPatnerPhoneNumber}
              </span>
            )}
          </div>
          <button className="add_patner_form_submit">Submit</button>
        </form>
      )}

      {showEditPatnerPayment && (
        <div className="editpatnerpayment-overlay">
          <div className="editpatnerpayment-content">
            <form
              className="editpatnerpayment-form"
              onSubmit={handleSubmitEditPatnerPayment}
            >
              <button
                className="editpatnerpayment-close"
                onClick={() => setShowEditPatnerPayment(false)}
              >
                ×
              </button>
              <h2>Edit Partner Payment</h2>
              <div>
                <input
                  type="text"
                  value={editPatnerPaymentName}
                  onChange={(e) => setEditPatnerPaymentName(e.target.value)}
                  required
                  className="editpatnerpayment-input"
                  readOnly
                />
              </div>
              <div>
                <input
                  type="date"
                  value={editPatnerPaymentDate}
                  onChange={(e) => {
                    setEditPatnerPaymentDate(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      editPatnerPaymentDate: validateDate(e.target.value),
                    }));
                  }}
                  required
                  className="editpatnerpayment-input"
                />
                {errors.editPatnerPaymentDate && (
                  <span className="error">{errors.editPatnerPaymentDate}</span>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Amount"
                  value={editPatnerPaymentAmount}
                  onChange={(e) => {
                    setEditPatnerPaymentAmount(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      editPatnerPaymentAmount: validateAmount(e.target.value),
                    }));
                  }}
                  required
                  className="editpatnerpayment-input"
                />
                {errors.editPatnerPaymentAmount && (
                  <span className="error">
                    {errors.editPatnerPaymentAmount}
                  </span>
                )}
              </div>
              <div>
                <select
                  value={editPatnerPaymentTransactionMode}
                  onChange={(e) => {
                    setEditPatnerPaymentTransactionMode(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      editPatnerPaymentTransactionMode: e.target.value
                        ? ""
                        : "Transaction mode is required",
                    }));
                  }}
                  required
                  className="editpatnerpayment-select"
                >
                  <option value="">Transaction Mode</option>
                  <option value="CREDIT">CREDIT</option>
                  <option value="DEBIT">DEBIT</option>
                </select>
                {errors.editPatnerPaymentTransactionMode && (
                  <span className="error">
                    {errors.editPatnerPaymentTransactionMode}
                  </span>
                )}
              </div>
              <div>
                <select
                  value={editPatnerPaymentMethod}
                  onChange={(e) => {
                    setEditPatnerPaymentMethod(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      editPatnerPaymentMethod: e.target.value
                        ? ""
                        : "Payment method is required",
                    }));
                  }}
                  required
                  className="editpatnerpayment-select"
                >
                  <option value="">Select Payment Method</option>
                  <option value="UPI">UPI</option>
                  <option value="CASH">CASH</option>
                  <option value="CHEQUE">CHEQUE</option>
                  <option value="RTGS">RTGS</option>
                  <option value="NEFT">NEFT</option>
                </select>
                {errors.editPatnerPaymentMethod && (
                  <span className="error">
                    {errors.editPatnerPaymentMethod}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Note"
                  value={editPatnerPaymentNote}
                  onChange={(e) => setEditPatnerPaymentNote(e.target.value)}
                  className="editpatnerpayment-input"
                />
              </div>
              <button type="submit" className="editpatnerpayment-button">
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddExpenseForm && (
        <div>
          <div
            className="overlay"
            onClick={() => setShowAddExpenseForm(false)}
          ></div>
          <form className="add_patner_form" onSubmit={handleAddExpense}>
            <button
              className="close_showAddpatnerForm"
              onClick={() => setShowAddExpenseForm(false)}
            >
              X
            </button>
            <h2>Add Expense</h2>
            <div>
              <input
                type="text"
                placeholder="Expense Name"
                value={expenseName}
                onChange={(e) => {
                  setExpenseName(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    expenseName: validateName(e.target.value),
                  }));
                }}
                required
                className="add_patner_form_input"
              />
              {errors.expenseName && (
                <span className="error">{errors.expenseName}</span>
              )}
            </div>
            <div>
              <input
                type="number"
                placeholder="Amount"
                value={expenseAmount}
                onChange={(e) => {
                  setExpenseAmount(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    expenseAmount: validateAmount(e.target.value),
                  }));
                }}
                required
                className="add_patner_form_input"
              />
              {errors.expenseAmount && (
                <span className="error">{errors.expenseAmount}</span>
              )}
            </div>
            <button
              type="submit"
              className="add_patner_form_submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      {showExpensesList && (
        <div className="single_patner_card_main_wrapper">
          <button
            className="single_patner_cardclose_button"
            onClick={() => setShowExpensesList(false)}
          >
            X
          </button>
          <h2>Expenses</h2>
          {Array.isArray(expenses) && expenses.length > 0 ? (
            <table className="land_show_table">
              <thead className="land_show_table_thead">
                <tr className="land_show_table_tr">
                  <th>Expense Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Action</th>
                    {role === "Admin" && <th colSpan={1}>Updated By</th>}
                </tr>
              </thead>
              <tbody className="land_show_table_tbody">
                {expenses.map((expense, index) => (
                  <tr className="land_show_table_tr" key={expense.id || index}>
                    <td>{expense.expenseName || "N/A"}</td>
                    <td>
                      {expense.amount ? expense.amount.toLocaleString() : "N/A"}
                    </td>

                    <td>
                      {new Date().toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <TiEdit
                        onClick={() => handleEditExpense(expense.id)}
                        className="handleEditExpense"
                        style={{
                          marginRight: "5px",
                          color: "green",
                          fontSize: "20px",
                          cursor: "pointer",
                        }}
                      />

                      <MdDelete
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="handleDeleteExpense"
                        style={{
                          color: "red",
                          fontSize: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </td>
                    {role === "Admin" && (
                      <td>{expense?.updatedBy || "-"}</td> // Conditional rendering of updatedBy
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    style={{ color: "#e24400ff", fontSize: "20px" }}
                    colSpan="3"
                  >
                    Total
                  </td>
                  <td style={{ color: "#e24400ff", fontSize: "20px" }}>
                    {expenses
                      .reduce((sum, expense) => sum + (expense.amount || 0), 0)
                      .toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <p>No expenses available</p>
          )}
        </div>
      )}
      {showEditExpenseForm && (
        <div>
          <div
            className="overlay"
            onClick={() => setShowEditExpenseForm(false)}
          ></div>
          <form className="add_patner_form" onSubmit={handleSubmitEditExpense}>
            <button
              className="close_showAddpatnerForm"
              onClick={() => setShowEditExpenseForm(false)}
            >
              X
            </button>
            <h2>Edit Expense</h2>
            <div>
              <input
                type="text"
                placeholder="Expense Name"
                value={editExpenseName}
                onChange={(e) => {
                  setEditExpenseName(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    editExpenseName: validateName(e.target.value),
                  }));
                }}
                required
                className="add_patner_form_input"
              />
              {errors.editExpenseName && (
                <span className="error">{errors.editExpenseName}</span>
              )}
            </div>
            <div>
              <input
                type="number"
                placeholder="Amount"
                value={editExpenseAmount}
                onChange={(e) => {
                  setEditExpenseAmount(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    editExpenseAmount: validateAmount(e.target.value),
                  }));
                }}
                required
                className="add_patner_form_input"
              />
              {errors.editExpenseAmount && (
                <span className="error">{errors.editExpenseAmount}</span>
              )}
            </div>
            <button
              type="submit"
              className="add_patner_form_submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default LandPurchase;
