import React,{useState} from "react";
import axios from "axios";
import "../styles/DonateDeviceForm.css";

const DonateDeviceForm = ({donorId, onSuccess}) => {
    const [device, setDevice] = useState({
        name: "",
        type: "",
        condition: "",
        donationDate: new Date().toISOString().split('T')[0],
    })
    
    const[messages, setMessages] = useState("");
    const [loading, setLoading] = useState(false);
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token || userData;
    const backendUrl = "http://localhost:8080";


    const handleChange =(e) =>{
        setDevice({
            ...device,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessages("");

        if(!donorId || !token){
            setMessages("Missing donor id or token");
            setLoading(false);
            return;
        }

        try {
            const reponse = await axios.post(`${backendUrl}/api/devices/donors/${donorId}`, {...device}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessages("Device donated successfully");
            setDevice({
                name: "",
                type: "",
                condition: "",
                donationDate: new Date().toISOString().split('T')[0],
            });

            if(onSuccess) onSuccess();
            
        } catch (error) {
            console.error("Error donating device:", error.response?.data || error.message);
            setMessages("Error donating device. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return(
        <div className="donate-device-form">
            <h2>Donate Device</h2>
            <form onSubmit={handleSubmit}>
                <label>Device Name:</label>
                <input type="text" name="name" value={device.name} onChange={handleChange} required/>

                <label>Device Type:</label>
                <select name="type" value={device.type} onChange={handleChange}>
                <option value="">Select Type</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Desktop">Desktop</option>
                </select>

                <label>Condition:</label>
                <select name="condition" value={device.condition} onChange={handleChange}>
                    <option value="">Select Condition</option>
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Repair">Needs Repair</option>
                </select>

                <label>Donation Date:</label>
                <input type="date" name="donationDate"  value={device.donationDate} onChange={handleChange} required/>

                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Donate"}
                </button>
            </form>
        </div>
    )

};

export default DonateDeviceForm;