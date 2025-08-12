

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { BASE_URL } from "../../config";
// import "./singlevendor.css";
// import html2pdf from "html2pdf.js/dist/html2pdf";

// function SingleVendor() {
//     const { projectId, vendorId } = useParams();
//     const token = JSON.parse(localStorage.getItem("employeROyalmadeLogin"))?.token;
//     const [showAddMaterial, setShowAddMaterial] = useState(false)
//     const [materials, setMaterials] = useState([]);
//     const [selectedMaterial, setSelectedMaterial] = useState("");
//     const [showBill, setshowBill] = useState(false)
//     const [billId, setBillId] = useState("")
//     const [showpaymentform, setshowpaymentform] = useState(false)
//     const [billDate, setbillDate] = useState("")
//     const [billAmount, setBillAmount] = useState("")
//     const [billRemark, setBillRemark] = useState("")
//     const [billStatus, setBillStatus] = useState("")
//     const [refreshKey, setrefreshKey] = useState(0)
//     const [forceRender, setForceRender] = useState(0);
//     const [materialId, setmaterialId] = useState("")
//     const [billNo, setBillNo] = useState("")
//     const [materialEditFormShow, setmaterialEditFormShow] = useState(false)
//     const [updateMaterialName, setupdateMaterialName] = useState("")
//     const [UpdateMaterialType, setUpdateMaterialType] = useState("")
//     const [updateMaterialQuantity, setupdateMaterialQuantity] = useState("")
//     const [updateMaterialDate, setupdateMaterialDate] = useState("")
//     const [updateMaterialPrice, setupdateMaterialPrice] = useState("")
//     const [paymentId, setPaymentId] = useState("")
//     const [showupdatePaymentForm, setshowupdatePaymentForm] = useState(false)
//     const [updatepaymentDate, setupdatepaymentDate] = useState("")
//     const [updatePaymentAmount, setupdatePaymentAmount] = useState("")
//     const [updatePaymentstatus, setupdatePaymentstatus] = useState("")
//     const [updatePaymentremark, setupdatePaymentremark] = useState("")
//     const [paymentBillId, setpaymentBillId] = useState("")

//     const [name, setName] = useState("");
//     const [type, setType] = useState("");
//     const [quantity, setQuantity] = useState("");
//     const [AddmaterialbillNo, setAddmaterialbillNo] = useState("")
//     const [price, setPrice] = useState("");
//     useEffect(() => {
//         async function getAllBillNo() {
//             try {
//                 const response = await axios.get(`${BASE_URL}/filteredMaterials`, {
//                     params: { vendorId, projectId },
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 });
//                 setMaterials(response.data);
//             } catch (error) {
//                 console.error("Error fetching materials:", error);
//             }
//         }
//         if (vendorId && projectId) {
//             getAllBillNo();
//         }
//     }, [vendorId, projectId, token, refreshKey]);


//     async function onShowBill(billNo) {
//         try {
//             const response = await axios.get(`${BASE_URL}/SingleBill/${billNo}/${projectId}`, {

//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             });
//             console.log(response.data)
//             setSelectedMaterial(response.data);
//             setshowBill(true)
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     useEffect(() => {
//         if (billId) {
//             onShowBill(billId);
//         }
//     }, [refreshKey, token, billId, forceRender]);

//     function handleclickPaymentButton(id) {

//         setBillId(id)
//         setshowpaymentform(true)
//     }
//     async function handleAddpaymentTOBill(e) {
//         e.preventDefault()
//         const formData = {
//             payDate: billDate,
//             amount: billAmount.replace(/,/g, ""),
//             remark: billRemark,
//             paymentStatus: billStatus,
//             vendorId: vendorId,
//             projectId: projectId
//         }
//         console.log(formData)
//         try {
//             const response = await axios.post(`${BASE_URL}/Material/${billId}/payments`, formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             })
//             if (response.status === 200) {
//                 alert("Payment added Successfully")
//                 setrefreshKey(refreshKey + 1)
//                 setshowpaymentform(false)
//                 setBillAmount("")
//                 setBillRemark("")
//                 setBillStatus("")
//                 setbillDate("")
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     async function handleDeletepayment(id) {
//         const materailDelete = window.confirm("Are you sure to delete the Payment ?")
//         if (!materailDelete) return
//         try {
//             const response = await axios.delete(`${BASE_URL}/VendorMeterialPayment/${id}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             })
//             if (response.status === 200) {
//                 alert("Payment deleted")
//                 setrefreshKey((prev) => prev + 1)
//                 setForceRender((prev) => prev + 1);
//                 setSelectedMaterial((prev) => ({
//                     ...prev,
//                     payment: prev.payment.filter((pay) => pay.id !== id)
//                 }))
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     async function handleEditmateril(id) {
//         setmaterialId(id)
//         setmaterialEditFormShow(true)
//         try {
//             const response = await axios.get(`${BASE_URL}/Material/${id}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             })
//             console.log(response.data)
//             setBillNo(response.data.billNo)
//             setupdateMaterialName(response.data.name)
//             setUpdateMaterialType(response.data.type)
//             setupdateMaterialQuantity(response.data.quantity)
//             setupdateMaterialDate(response.data.addedOn)
//             setupdateMaterialPrice(response.data.price)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     async function handlematerialDelete(id) {
//         const materialDetele = window.confirm("Are you sure to delete the material ?")
//         if (!materialDetele) return
//         try {
//             const response = await axios.delete(`${BASE_URL}/DeleteVendorMeterial/${id}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             })
//             if (response.status === 200) {
//                 setForceRender(forceRender + 1)
//                 setSelectedMaterial((prev) => ({
//                     ...prev,
//                     materials: prev.materials.filter((mat) => mat.id !== id)
//                 }));
//             }
//         } catch (error) {
//             console.log(error)
//         }

//     }

//     async function handleUpdatematerial(e) {
//         e.preventDefault();

//         const updatedMaterial = {
//             id: materialId,
//             name: updateMaterialName,
//             type: UpdateMaterialType,
//             quantity: updateMaterialQuantity,
//             price: String(updateMaterialPrice || "").replace(/,/g, ""),

//             billNo: billNo,
//             addedOn: updateMaterialDate
//         };
//         try {
//             const response = await axios.put(`${BASE_URL}/UpdateMaterial/${materialId}`, updatedMaterial, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });

//             if (response.status === 200) {
//                 alert("Material updated");

//                 setmaterialEditFormShow(false);

//                 setSelectedMaterial((prevData) => ({
//                     ...prevData,
//                     materials: prevData.materials.map((mat) =>
//                         mat.id === materialId ? { ...mat, ...updatedMaterial } : mat
//                     )
//                 }));


//             }
//         } catch (error) {
//             console.error("Update failed:", error);
//         }
//     }

//     async function handleEditpayment(id) {

//         setPaymentId(id)
//         setshowupdatePaymentForm(true)
//         try {
//             const response = await axios.get(`${BASE_URL}/SingleMeteralPayment/${id}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             })
//             console.log(response.data)
//             setpaymentBillId(response.data.billNo)
//             setupdatepaymentDate(response.data.payDate)
//             setupdatePaymentAmount(response.data.amount)
//             setupdatePaymentremark(response.data.remark)
//             setupdatePaymentstatus(response.data.paymentStatus)
//         } catch (error) {
//             console.log(error)
//         }

//     }

//     async function handleUpdatepayment(e) {
//         e.preventDefault()
//         const fordata = {
//             vendorId,
//             projectId,
//             id: paymentId,
//             payDate: updatepaymentDate,
//             amount: String(updatePaymentAmount).replace(/,/g, ""),

//             remark: updatePaymentremark,
//             billNo: paymentBillId,
//             paymentStatus: updatePaymentstatus
//         }

//         try {
//             const response = await axios.put(`${BASE_URL}/Material/${paymentBillId}/payments/${paymentId}`, fordata, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             })
//             console.log(response.data)
//             if (response.status === 200) {
//                 alert("payment updated")
//                 setshowupdatePaymentForm(false)
//                 setrefreshKey((prev) => prev + 1);
//                 await onShowBill(paymentBillId);



//             }
//         } catch (error) {
//             console.log(error)
//         }

//     }
//     const handlePrint = () => {
//         const buttons = document.querySelectorAll(".material_edit_button, .material_delete_button");
//         const actionColumns = document.querySelectorAll(".action-column");
//         buttons.forEach(button => button.style.display = "none");
//         actionColumns.forEach(column => column.style.display = "none");
//         const element = document.getElementById("billDetails");
//         element.style.padding = "20px";
//         html2pdf().from(element).save(`Bill_${selectedMaterial.billNo}.pdf`).then(() => {
//             buttons.forEach(button => button.style.display = "inline-block");
//             actionColumns.forEach(column => column.style.display = "table-cell");
//             element.style.padding = "";
//         });
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = [{
//             name,
//             billNo: AddmaterialbillNo,
//             type,
//             quantity,
//             price: String(price).replace(/,/g, "")
//         }];
//         console.log(formData)
//         try {
//             const response = await axios.post(`${BASE_URL}/projects/${projectId}/${vendorId}/add-expense`, formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });
//             console.log(response);
//             alert("Form successfully submitted");
//             setShowAddMaterial(false)
//             setName("");
//             setType("");
//             setQuantity("");
//             setPrice("");
//             setAddmaterialbillNo("")
//             setrefreshKey(refreshKey + 1)

//         } catch (error) {
//             console.log(error);
//         }
//     };

//     async function handleDeleteBill(id) {
//         const deleteBill = window.confirm("Are you sure to delete Bill ?")
//         if (!deleteBill) return

//         try {
//             const response = await axios.delete(`${BASE_URL}/projects/${projectId}/${vendorId}/delete-bill/${id}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             })
//             console.log(response.data)
//             if (response.status === 200) {
//                 alert("Bill deleted")
//                 setrefreshKey(refreshKey + 1)
//             }
//         } catch (error) {
//             console.log(error)
//         }

//     }
//     return (
//         <>

//             <div className="Addmaterialbutton_wrapper">
//                 <button onClick={() => setShowAddMaterial(true)} > Add Material </button>

//             </div>

//             {
//                 showAddMaterial && (

//                     <div className="addMeterialformwrapper">
//                         <div className="hideAddmaterial_button">
//                             <button onClick={() => setShowAddMaterial(!showAddMaterial)} className='crossMetetialform_btn'>X</button>
//                         </div>
//                         <form className="addMeterialform" onSubmit={handleSubmit}>
//                             <div>
//                                 <label className="addMeteriallable">
//                                     Name:
//                                     <input
//                                         type="text"
//                                         value={name}
//                                         placeholder='Meterial Name'
//                                         onChange={(e) => setName(e.target.value)}
//                                         className="addMeterialinput"
//                                         required
//                                     />
//                                 </label>
//                             </div>
//                             <div>
//                                 <label className="addMeteriallable">
//                                     Type:
//                                 </label>
//                                 <select name="" id="" value={type} onChange={(e) => setType(e.target.value)} required className="addMeterialselect">
//                                     <option value="">Select Type</option>
//                                     <option value="MATERIAL">MATERIAL</option>
//                                     <option value="LABOUR">LABOUR</option>
//                                     <option value="OTHER">OTHER</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="addMeteriallable">
//                                     Quantity:
//                                     <input
//                                         type="number"
//                                         value={quantity}
//                                         placeholder='Meterial quantity'
//                                         className="addMeterialinput"
//                                         onChange={(e) => setQuantity(Number(e.target.value))}
//                                         required
//                                     />
//                                 </label >
//                             </div>
//                             <div>
//                                 <label className="addMeteriallable">
//                                     Bill No:
//                                     <input
//                                         type="text"
//                                         value={AddmaterialbillNo}
//                                         placeholder='Enter bill No'
//                                         className="addMeterialinput"
//                                         onChange={(e) => setAddmaterialbillNo(e.target.value)}
//                                         required
//                                     />
//                                 </label>
//                             </div>
//                             <div>
//                                 <label className="addMeteriallable">
//                                     Price:
//                                     <input
//                                         type="text"
//                                         value={price}
//                                         placeholder='Enter price'
//                                         className="addMeterialinput"
//                                         onChange={(e) => setPrice(e.target.value)}
//                                     />
//                                 </label>
//                             </div>



//                             <button type="submit" className="addMeterialsubmitbutton">Submit</button>
//                         </form>
//                     </div>

//                 )
//             }



//             <div className="billNo_card_wrapper">
//                 {materials.length > 0 ? (
//                     materials.map((material) => (
//                         <div key={material.id} className="billNo_card">
//                             <h3>Bill No: {material.billNo}</h3>
//                             <button className="billNo_button" onClick={() => onShowBill(material.billNo)}>
//                                 View Bill
//                             </button>
//                             <button className="delete_bill_no" onClick={() => handleDeleteBill(material.billNo)}>  Delete Bill</button>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="no_materials">No materials found.</p>
//                 )}
//             </div>

//             {showBill && selectedMaterial && (
//                 <div className="bill_details_card">
//                     <button className='add_payment_button_bill' onClick={() => handleclickPaymentButton(selectedMaterial.billNo)}> Add Payment</button>

//                     <button className="bill_details_close_button" onClick={() => setshowBill(false)}>X</button>
//                     <button className='add_print_button_bill' onClick={handlePrint}> Print</button>
//                     <h2>Bill Details</h2>

//                     <div id="billDetails">
//                         <p><strong>Bill No:</strong> {selectedMaterial.billNo}</p>
//                         <p><strong>Vendor Name:</strong> {selectedMaterial.vendor.name}</p>
//                         <p><strong>Vendor Phone:</strong> {selectedMaterial.vendor.phoneno}</p>
//                         <p><strong>Total Amount:</strong> ₹{selectedMaterial.total.toLocaleString()}</p>
//                         <p><strong>Paid Amount:</strong> ₹{selectedMaterial.vendorPaidAmount.toLocaleString()}</p>
//                         <p><strong>Remaining Amount:</strong> ₹{selectedMaterial.remainingAmount.toLocaleString()}</p>

//                         {/* Materials Table */}
//                         <h3>Materials</h3>
//                         <table className="bill_details_material_table">
//                             <thead>
//                                 <tr>

//                                     <th>Name</th>
//                                     <th>Type</th>
//                                     <th>Quantity</th>
//                                     <th> Date</th>
//                                     <th>Price</th>
//                                     <th className="action-column"> Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {selectedMaterial.materials.map((material) => (
//                                     <tr key={material.id}>

//                                         <td>{material.name}</td>
//                                         <td>{material.type}</td>
//                                         <td>{material.quantity}</td>
//                                         <td>{new Date(material.addedOn).toLocaleDateString("en-GB")}</td>
//                                         <td>₹{material.price.toLocaleString("")}</td>
//                                         <td className="action-column">
//                                             <button className="material_edit_button" onClick={() => handleEditmateril(material.id)}> Edit</button>
//                                             <button className="material_delete_button" onClick={() => handlematerialDelete(material.id)} > Delete</button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>

//                         {/* Payments Table */}
//                         <h3>Payments</h3>
//                         <table className="bill_details_payment_table">
//                             <thead>
//                                 <tr>
//                                     <th>Date</th>
//                                     <th>Amount</th>
//                                     <th>Status</th>
//                                     <th>Remark</th>
//                                     <th className="action-column"> Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {selectedMaterial.payment.map((pay, index) => (
//                                     <tr key={index}>
//                                         <td>{new Date(pay.expensePayDate).toLocaleDateString("en-GB")}</td>
//                                         <td>₹{pay.expenseAmount.toLocaleString()}</td>
//                                         <td>{pay.expensePayStatus}</td>
//                                         <td>{pay.remark}</td>
//                                         <td className="action-column">
//                                             <button className="material_edit_button" onClick={() => handleEditpayment(pay.id)} > Edit</button>
//                                             <button className="material_delete_button" onClick={() => handleDeletepayment(pay.id)}> Delete</button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}

//             {showpaymentform && (
//                 <div className="show_payment_form_container">
//                     <form className='show_payment_form' onSubmit={handleAddpaymentTOBill} >
//                         <button onClick={() => setshowpaymentform(false)} className='show_payment_form_close'>X</button>

//                         <input type="date" className='show_payment_form_input' value={billDate || new Date().toISOString().split("T")[0]} onChange={(e) => setbillDate(e.target.value)} />
//                         <input type="text" placeholder='Enter Amount' className='show_payment_form_input' value={billAmount} onChange={(e) => setBillAmount(e.target.value)} />
//                         <select className='show_payment_form_select' value={billStatus} onChange={(e) => setBillStatus(e.target.value)}>
//                             <option value="">Select Payment Method</option>
//                             <option value="CASH">Cash</option>
//                             <option value="CHECK">cheque</option>
//                             <option value="UPI">UPI</option>
//                             <option value="RTGS">RTGS</option>
//                             <option value="NEFT">NEFT</option>
//                         </select>
//                         <input type="text" placeholder='Note' className='show_payment_form_input' value={billRemark} onChange={(e) => setBillRemark(e.target.value)} />
//                         <button className='show_payment_form_submit_button'>Submit</button>
//                     </form>
//                 </div>
//             )}

//             {

//                 materialEditFormShow && (
//                     <>
//                         <div className="updatematerialform_wrapper">
//                             <form className="updatematerialform" onSubmit={handleUpdatematerial}>
//                                 <button onClick={() => setmaterialEditFormShow(false)} className="updatematerialform_close" > X</button>
//                                 <p className="updatematerialform_heading"> Edit material </p>
//                                 <input type="text" className="updatematerialform_input" value={updateMaterialName} onChange={(e) => setupdateMaterialName(e.target.value)} />
//                                 <input type="text" className="updatematerialform_input" value={UpdateMaterialType} onChange={(e) => setUpdateMaterialType(e.target.value)} />
//                                 <input type="text" className="updatematerialform_input" value={updateMaterialQuantity} onChange={(e) => setupdateMaterialQuantity(e.target.value)} />
//                                 <input type="date" className="updatematerialform_input" value={updateMaterialDate} onChange={(e) => setupdateMaterialDate(e.target.value)} />
//                                 <input type="text" className="updatematerialform_input" value={updateMaterialPrice} onChange={(e) => setupdateMaterialPrice(e.target.value)} />
//                                 <button className="updatematerialform_update_button" > Update</button>
//                             </form>

//                         </div>


//                     </>
//                 )
//             }

//             {
//                 showupdatePaymentForm && (

//                     <>
//                         <div className="updatePaymentForm_wrapper">
//                             <form className="updatePaymentForm" onSubmit={handleUpdatepayment}>
//                                 <button onClick={() => setshowupdatePaymentForm(false)} className="updatePaymentForm_close"> X</button>
//                                 <input type="date" value={updatepaymentDate} onChange={(e) => setupdatepaymentDate(e.target.value)} className="updatePaymentForm_input" />
//                                 <input type="text" value={updatePaymentAmount} onChange={(e) => setupdatePaymentAmount(e.target.value)} className="updatePaymentForm_input" />
//                                 <select value={updatePaymentstatus} onChange={(e) => setupdatePaymentstatus(e.target.value)} className="updatePaymentForm_select" >
//                                     <option value="">Select Payment Method</option>
//                                     <option value="CASH">Cash</option>
//                                     <option value="CHECK">cheque</option>
//                                     <option value="UPI">UPI</option>
//                                     <option value="RTGS">RTGS</option>
//                                     <option value="NEFT">NEFT</option>
//                                 </select>
//                                 <input type="text" placeholder="remark" value={updatePaymentremark} onChange={(e) => setupdatePaymentremark(e.target.value)} className="updatePaymentForm_input" />
//                                 <button className="updatePaymentForm_submit_button"> Update Payment</button>
//                             </form>
//                         </div>


//                     </>
//                 )
//             }
//         </>
//     );
// }

// export default SingleVendor;


import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config";
import "./singlevendor.css";
import html2pdf from "html2pdf.js/dist/html2pdf";

function SingleVendor() {
    const { projectId, vendorId } = useParams();
    const token = JSON.parse(localStorage.getItem("employeROyalmadeLogin"))?.token;
    const [showAddMaterial, setShowAddMaterial] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState([]);
    const [showBillModal, setShowBillModal] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [billDate, setBillDate] = useState("");
    const [billAmount, setBillAmount] = useState("");
    const [billRemark, setBillRemark] = useState("");
    const [billStatus, setBillStatus] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [materialEditFormShow, setMaterialEditFormShow] = useState(false);
    const [updateMaterialName, setUpdateMaterialName] = useState("");
    const [updateMaterialType, setUpdateMaterialType] = useState("");
    const [updateMaterialQuantity, setUpdateMaterialQuantity] = useState("");
    const [updateMaterialDate, setUpdateMaterialDate] = useState("");
    const [updateMaterialPrice, setUpdateMaterialPrice] = useState("");
    const [paymentId, setPaymentId] = useState("");
    const [showUpdatePaymentForm, setShowUpdatePaymentForm] = useState(false);
    const [updatePaymentDate, setUpdatePaymentDate] = useState("");
    const [updatePaymentAmount, setUpdatePaymentAmount] = useState("");
    const [updatePaymentStatus, setUpdatePaymentStatus] = useState("");
    const [updatePaymentRemark, setUpdatePaymentRemark] = useState("");
    const [paymentBillId, setPaymentBillId] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [addMaterialBillNo, setAddMaterialBillNo] = useState(1);
    const [price, setPrice] = useState("");
    const [materialId, setMaterialId] = useState("");
    const [showNewdataBillData, setshowNewdataBillData] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    
    // useEffect(() => {
    //     async function getAllBillNo() {
    //         try {
    //             const response = await axios.get(`${BASE_URL}/filteredMaterials`, {
    //                 params: { vendorId, projectId },
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             });
    //             setMaterials(response.data);
    //             console.log(response.data)
    //         } catch (error) {
    //             console.error("Error fetching materials:", error);
    //         }
    //     }
    //     if (vendorId && projectId) {
    //         getAllBillNo();
    //     }
    // }, [vendorId, projectId, token, refreshKey]);

    async function onShowBill(billNo) {
        try {
            const response = await axios.get(`${BASE_URL}/SingleBill/${billNo}/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setSelectedMaterial(response.data);
            setShowBillModal(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddPayment = (billNo) => {
        setPaymentBillId(billNo);
        setShowPaymentForm(true);
    };

    async function handleAddPaymentToBill(e) {
        e.preventDefault();
        const formData = {
            payDate: billDate,
            amount: billAmount.replace(/,/g, ""),
            remark: billRemark,
            paymentStatus: billStatus,
            vendorId: vendorId,
            projectId: projectId
        };

        try {
            const response = await axios.post(`${BASE_URL}/Material/${paymentBillId}/payments`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 200) {
                alert("Payment added Successfully");
                setRefreshKey(prev => prev + 1);
                setShowPaymentForm(false);
                setBillAmount("");
                setBillRemark("");
                setBillStatus("");
                setBillDate("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDeletePayment(id) {
        const confirmDelete = window.confirm("Are you sure to delete the Payment?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`${BASE_URL}/VendorMeterialPayment/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 200) {
                alert("Payment deleted");
                setRefreshKey(prev => prev + 1);
                onShowBill(paymentBillId);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleEditMaterial(id) {
        setMaterialId(id);
        setMaterialEditFormShow(true);
        try {
            const response = await axios.get(`${BASE_URL}/Material/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setAddMaterialBillNo(response.data.billNo);
            setUpdateMaterialName(response.data.name);
            setUpdateMaterialType(response.data.type);
            setUpdateMaterialQuantity(response.data.quantity);
            setUpdateMaterialDate(response.data.addedOn);
            setUpdateMaterialPrice(response.data.price);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleMaterialDelete(id) {
        const confirmDelete = window.confirm("Are you sure to delete the material?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`${BASE_URL}/DeleteVendorMeterial/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 200) {
                alert("Material deleted");
                setRefreshKey(prev => prev + 1);
                onShowBill(addMaterialBillNo);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleUpdateMaterial(e) {
        e.preventDefault();
        setIsLoading(true); // Start the loader

        const updatedMaterial = {
            id: materialId,
            name: updateMaterialName,
            type: updateMaterialType,
            quantity: updateMaterialQuantity,
            price: String(updateMaterialPrice || "").replace(/,/g, ""),
            billNo: addMaterialBillNo,
            addedOn: updateMaterialDate
        };

        try {
            const response = await axios.put(`${BASE_URL}/UpdateMaterial/${materialId}`, updatedMaterial, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 200) {
                alert("Material updated");
                setMaterialEditFormShow(false);
                setRefreshKey(prev => prev + 1);
            }
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsLoading(false); // Stop the loader
        }
    }
    async function handleEditPayment(id) {
        setPaymentId(id);
        setShowUpdatePaymentForm(true);
        try {
            const response = await axios.get(`${BASE_URL}/SingleMeteralPayment/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setPaymentBillId(response.data.billNo);
            setUpdatePaymentDate(response.data.payDate);
            setUpdatePaymentAmount(response.data.amount);
            setUpdatePaymentRemark(response.data.remark);
            setUpdatePaymentStatus(response.data.paymentStatus);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleUpdatePayment(e) {
        e.preventDefault();
        const formData = {
            vendorId,
            projectId,
            id: paymentId,
            payDate: updatePaymentDate,
            amount: String(updatePaymentAmount).replace(/,/g, ""),
            remark: updatePaymentRemark,
            billNo: paymentBillId,
            paymentStatus: updatePaymentStatus
        };

        try {
            const response = await axios.put(`${BASE_URL}/Material/${paymentBillId}/payments/${paymentId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 200) {
                alert("Payment updated");
                setShowUpdatePaymentForm(false);
                setRefreshKey(prev => prev + 1);
                onShowBill(paymentBillId);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePrint = () => {
    const buttons = document.querySelectorAll(".material_edit_button, .material_delete_button");
    const actionColumns = document.querySelectorAll(".action-column");
    buttons.forEach(button => button.style.display = "none");
    actionColumns.forEach(column => column.style.display = "none");
    const element = document.getElementById("billDetails");
    element.style.padding = "20px";

    html2pdf()
        .from(element)
        .save(`Bill_${selectedMaterial.billNo}.pdf`) // Corrected template literal
        .then(() => {
            buttons.forEach(button => button.style.display = "inline-block");
            actionColumns.forEach(column => column.style.display = "table-cell");
            element.style.padding = "";
        });
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = [{
            name,
            billNo: addMaterialBillNo,
            type,
            quantity,
            price: String(price).replace(/,/g, "")
        }];

        try {
            const response = await axios.post(`${BASE_URL}/projects/${projectId}/${vendorId}/add-expense`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            alert("Form successfully submitted");
            setShowAddMaterial(false);
            setName("");
            setType("");
            setQuantity("");
            setPrice("");
            setAddMaterialBillNo("");
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.log(error);
        }
    };

    async function handleDeleteBill(billNo) {
        const confirmDelete = window.confirm("Are you sure to delete Bill?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`${BASE_URL}/projects/${projectId}/${vendorId}/delete-bill/${billNo}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 200) {
                alert("Bill deleted");
                setRefreshKey(prev => prev + 1);
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        async function getNewBills() {
            try {
                const response = await axios.get(`${BASE_URL}/bills/${vendorId}/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                console.log(response.data)
                setMaterials(response.data)
            } catch (error) {
                console.log(error)
            }

        }
        getNewBills()
    }, [refreshKey])


    function showAllData() {
        setShowBillModal(true)
        setshowNewdataBillData(materials)
    }
    function handleclickPaymentButton(id) {
        alert(id)
    }
    return (
        <>
            <div className="vendor-container">
                <div className="vendor-header">
                    <h2>Vendor Materials</h2>
                    <button onClick={() => setShowAddMaterial(true)} className="add-material-btn">
                        Add Material
                    </button>
                </div>

                {/* Add Material Modal */}
                {showAddMaterial && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Add New Material</h3>
                                <button onClick={() => setShowAddMaterial(false)} className="close-btn">×</button>
                            </div>
                            <form onSubmit={handleSubmit} className="material-form">
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type:</label>
                                    <select value={type} onChange={(e) => setType(e.target.value)} required>
                                        <option value="">Select Type</option>
                                        <option value="MATERIAL">MATERIAL</option>
                                        <option value="LABOUR">LABOUR</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Quantity:</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bill No:</label>
                                    <input
                                        type="text"
                                        value={addMaterialBillNo}
                                        // onChange={(e) => setAddMaterialBillNo(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price:</label>
                                    <input
                                        type="text"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="submit-btn">Submit</button>
                            </form>
                        </div>
                    </div>
                )}
                {materials.length > 0 && (
                    <div style={{ textAlign: "center", color: " #015f65", margin: "20px 0", fontSize: "28px", fontWeight: "bold" }}>
                        <h1>{materials[0].vendor.projectName}</h1> {/* Display the project name of the first item */}
                    </div>
                )}
                {/* Materials Table */}
                <table className="vendor-table">
                    <thead>
                        <tr>
                            <th>Bill No</th>
                            <th>Vendor Name</th>
                            <th>Vendor Phone</th>
                            <th>Total Amount</th>
                            <th>Paid Amount</th>
                            <th>Remaining Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.length > 0 ? (
                            materials.map((material, index) => (
                                <tr key={index}>
                                    <td>{material.billNo}</td>
                                    <td>{material.vendor.name}</td>
                                    <td>{material.vendor.phoneno}</td>
                                    <td>{material.total}</td>
                                    <td>{material.vendorPaidAmount}</td>
                                    <td>{material.remainingAmount}</td>
                                    <td className="action-buttons">
                                        <button onClick={showAllData} className="view-btn">
                                            Show Details
                                        </button>
                                        <button onClick={() => handleAddPayment(material.billNo)} className="payment-btn">
                                            Add Payment
                                        </button>
                                        {/* <button onClick={() => handleDeleteBill(material.billNo)} className="delete-btn">
                                        Delete Bill
                                    </button> */}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="no-data">No materials found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Bill Details Modal */}
                {showBillModal && (
                    <div className="modal-overlay">
                        <div className="bill-modal-content">
                            <div className="modal-header">
                                <div className="modal-actions">
                                    {materials.map((material, index) => (
                                        <button className="add-payment-btn" onClick={() => handleAddPayment(material.billNo)} >Add Payment</button>
                                    ))}

                                    <button onClick={handlePrint} className="print-btn">Print</button>
                                    <button onClick={() => setShowBillModal(false)} className="close-btn">×</button>
                                </div>
                            </div>

                            {showNewdataBillData.map((bill, billIndex) => (
                                <div key={billIndex} id="billDetails" className="bill-details">
                                    <h3 className="text-lg font-semibold mb-3">Bill No: {bill.billNo}</h3>

                                    <p className="mt-6">  Material Table</p>
                                    <table className="materials-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Quantity</th>
                                                <th>Date</th>
                                                <th>Price</th>
                                                <th className="action-column">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bill.materials?.map((material) => (
                                                <tr key={material.id}>
                                                    <td>{material.name}</td>
                                                    <td>{material.type}</td>
                                                    <td>{material.quantity}</td>
                                                    <td>{new Date(material.addedOn).toLocaleDateString("en-GB")}</td>
                                                    <td>₹{material.price.toLocaleString()}</td>
                                                    <td className="action-column">
                                                        <button onClick={() => handleEditMaterial(material.id)} className="edit-btn">Edit</button>
                                                        <button onClick={() => handleMaterialDelete(material.id)} className="delete-btn">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Payments Table */}
                                    <h4 className="mt-6">Payments</h4>
                                    <table className="payments-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Remark</th>
                                                <th className="action-column">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bill.payment?.map((pay) => (
                                                <tr key={pay.id}>
                                                    <td>{new Date(pay.expensePayDate).toLocaleDateString("en-GB")}</td>
                                                    <td>₹{pay.expenseAmount.toLocaleString()}</td>
                                                    <td>{pay.expensePayStatus}</td>
                                                    <td>{pay.remark}</td>
                                                    <td className="action-column">
                                                        <button onClick={() => handleEditPayment(pay.id)} className="edit-btn">Edit</button>
                                                        <button onClick={() => handleDeletePayment(pay.id)} className="delete-btn">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {
                    showBillModal && (
                        <>
                            {showNewdataBillData.map((bill, index) => (
                                <div key={index} className="mb-6">

                                    <table border="1" className="mb-4 w-full">
                                        <thead>
                                            <tr>
                                                <th colSpan="5">Materials</th>
                                            </tr>
                                            <tr>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Type</th>
                                                <th>Added On</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bill.materials.map((mat, idx) => (
                                                <tr key={idx}>
                                                    <td>{mat.name}</td>
                                                    <td>₹{mat.price}</td>
                                                    <td>{mat.quantity}</td>
                                                    <td>{mat.type}</td>
                                                    <td>{mat.addedOn}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>


                                    <table border="1" className="w-full">
                                        <thead>
                                            <tr>
                                                <th colSpan="4">Payments</th>
                                            </tr>
                                            <tr>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Remark</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bill.payment.length > 0 ? (
                                                bill.payment.map((pay, i) => (
                                                    <tr key={i}>
                                                        <td>₹{pay.expenseAmount}</td>
                                                        <td>{pay.expensePayDate}</td>
                                                        <td>{pay.expensePayStatus}</td>
                                                        <td>{pay.remark}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4">No payment records</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </>
                    )
                }





                {/* Add Payment Modal */}
                {showPaymentForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Add Payment</h3>
                                <button onClick={() => setShowPaymentForm(false)} className="close-btn">×</button>
                            </div>
                            <form onSubmit={handleAddPaymentToBill} className="payment-form">
                                <div className="form-group">
                                    <label>Date:</label>
                                    <input
                                        type="date"
                                        value={billDate || new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setBillDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Amount:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Amount"
                                        value={billAmount}
                                        onChange={(e) => setBillAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Payment Method:</label>
                                    <select
                                        value={billStatus}
                                        onChange={(e) => setBillStatus(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="CASH">Cash</option>
                                        <option value="CHECK">Cheque</option>
                                        <option value="UPI">UPI</option>
                                        <option value="RTGS">RTGS</option>
                                        <option value="NEFT">NEFT</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Note:</label>
                                    <input
                                        type="text"
                                        placeholder="Note"
                                        value={billRemark}
                                        onChange={(e) => setBillRemark(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="submit-btn">Submit</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Material Modal */}
                {materialEditFormShow && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Edit Material</h3>
                                <button onClick={() => setMaterialEditFormShow(false)} className="close-btn">×</button>
                            </div>
                            <form onSubmit={handleUpdateMaterial} className="material-form">
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        value={updateMaterialName}
                                        onChange={(e) => setUpdateMaterialName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type:</label>
                                    <input
                                        type="text"
                                        value={updateMaterialType}
                                        onChange={(e) => setUpdateMaterialType(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Quantity:</label>
                                    <input
                                        type="text"
                                        value={updateMaterialQuantity}
                                        onChange={(e) => setUpdateMaterialQuantity(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date:</label>
                                    <input
                                        type="date"
                                        value={updateMaterialDate}
                                        onChange={(e) => setUpdateMaterialDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price:</label>
                                    <input
                                        type="text"
                                        value={updateMaterialPrice}
                                        onChange={(e) => setUpdateMaterialPrice(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="submit-btn" disabled={isLoading}>
                                    {isLoading ? "Submitting..." : "Update"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Payment Modal */}
                {showUpdatePaymentForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Edit Payment</h3>
                                <button onClick={() => setShowUpdatePaymentForm(false)} className="close-btn">×</button>
                            </div>
                            <form onSubmit={handleUpdatePayment} className="payment-form">
                                <div className="form-group">
                                    <label>Date:</label>
                                    <input
                                        type="date"
                                        value={updatePaymentDate}
                                        onChange={(e) => setUpdatePaymentDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Amount:</label>
                                    <input
                                        type="text"
                                        value={updatePaymentAmount}
                                        onChange={(e) => setUpdatePaymentAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Payment Method:</label>
                                    <select
                                        value={updatePaymentStatus}
                                        onChange={(e) => setUpdatePaymentStatus(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="CASH">Cash</option>
                                        <option value="CHECK">Cheque</option>
                                        <option value="UPI">UPI</option>
                                        <option value="RTGS">RTGS</option>
                                        <option value="NEFT">NEFT</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Remark:</label>
                                    <input
                                        type="text"
                                        placeholder="Remark"
                                        value={updatePaymentRemark}
                                        onChange={(e) => setUpdatePaymentRemark(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="submit-btn">Update</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SingleVendor;