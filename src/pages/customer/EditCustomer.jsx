import React, { useEffect } from 'react'
import { useState } from 'react';
import "../customer/Customer.css"
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';
function EditCustomer() {
    const navigate = useNavigate()
    const { id } = useParams()
    console.log(id)
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");
    const [addresss, setAddress] = useState("");
    const [adhar, setAdhar] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [agentName, setAgentName] = useState("");
    const [brokerage, setBrokerage] = useState("");

    useEffect(() => {
        async function getByid() {
            try {
                const response = await axios.get(`${BASE_URL}/getAllcustomer/${id}`)
                console.log(response.data)
                const { name, aadharNumber, address, agentName, brokerage, email, panCard, phoneNumber } = response.data
                setName(name)
                setAddress(address)
                setAdhar(aadharNumber)
                setAgentName(agentName)
                setBrokerage(brokerage)
                setEmail(email)
                setNumber(phoneNumber)
                setPanNumber(panCard)
            } catch (error) {
                console.log(error)
            }
        }
        getByid()
    }, [])
    async function handleUpdateCustomer(e) {
        e.preventDefault();
        const obj = {
            name,
            phoneNumber: number,
            email,
            aadharNumber: adhar,
            address: addresss,
            panCard: panNumber,
            agentName,
            brokerage,
          };
          console.log(`at update ${obj}`)
        try {
            const response = await axios.put(`${BASE_URL}/customerupdate/${id}`,obj)
            console.log(response)
            alert("customer update ")
            navigate("/clist")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="materialwrapper">
            <h1>Edit Customer</h1>
            <form className="customer_form" onSubmit={handleUpdateCustomer}>
                <div className="customer_input_container">
                    <input
                        type="text"
                        name="customerName"
                        placeholder=" "
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label>Customer Name</label>
                </div>

                <div className="customer_input_container">
                    <input
                        type="email"
                        name="customerEmail"
                        placeholder=" "
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                    />
                    <label>Customer Email</label>
                </div>

                <div className="customer_input_container">
                    <input
                        type="number"
                        name="phoneNumber"
                        placeholder=" "
                        required
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}

                    />
                    <label>Phone Number</label>
                </div>

                <div className="customer_input_container">
                    <input
                        type="text"
                        name="address"
                        placeholder=" "
                        required
                        value={addresss}
                        onChange={(e) => setAddress(e.target.value)}

                    />
                    <label>Address</label>
                </div>

                <div className="customer_input_container">
                    <input
                        type="text"
                        name="agentName"
                        placeholder=" "
                        required
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}

                    />
                    <label>Agent Name</label>
                </div>

                <div className="customer_input_container">
                    <input
                        type="number"
                        name="aadharNumber"
                        placeholder=" "
                        required
                        value={adhar}
                        onChange={(e) => setAdhar(e.target.value)}

                    />
                    <label>Aadhar Number</label>
                </div>

                <div className="customer_input_container">
                    <input
                        type="text"
                        name="panCard"
                        placeholder=" "
                        required
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value)}

                    />
                    <label>Pan Card</label>
                </div>

                <div className="customer_input_container">
                    <input
                        type="number"
                        name="brokerage"
                        placeholder=" "
                        required
                        value={brokerage}
                        onChange={(e) => setBrokerage(e.target.value)}

                    />
                    <label>Brokerage</label>
                </div>

                <div className="customer_input_btn">
                    <button type="submit">update Customer</button>
                </div>
            </form>
        </div>
    )
}

export default EditCustomer