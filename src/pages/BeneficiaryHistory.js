import React, {useState} from "react";
import {useEffect} from "react";
import axios from "axios";
import "../styles/BeneficiaryHistory.css";
import {useParams} from "react-router-dom";

const BeneficiaryHistory = () => {
    const {beneficiaryId} = useParams();
    const [history, setBeneficiaryHistory] = useState([]);

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token || userData;
    const backendBaseUrl = 'http://localhost:8080';
    const beneficiaryHistoryUrl = `${backendBaseUrl}/api/beneficiary/${beneficiaryId}/history`;

    const fetchBeneficiaryHistory = async () => {
        if (!beneficiaryId || !token) {
            console.error("Missing beneficiaryId or token!");
            return;
        }

        try {
            console.log(`Fetching history from: ${backendBaseUrl}/api/beneficiary/${beneficiaryId}/history`);
            const response = await axios.get(beneficiaryHistoryUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Beneficiary History:", response.data);
            setBeneficiaryHistory(response.data);

        } catch (error) {
            console.error('Error fetching beneficiary history:', error.response?.data || error.message);
        }
    }

    useEffect(() => {
        const interval = setInterval(fetchBeneficiaryHistory, 10000);  

        return () => clearInterval(interval);

    }, [beneficiaryId, token]);

    const formatAcceptedDate = (dateString) => {
        if (!dateString) return "Unknown";
        const parsedDate = new Date(dateString);
        if (isNaN(parsedDate.getTime())) return "Invalid Date";
    
        return parsedDate.toLocaleString("en-IN", {
            weekday: "short", 
            day: "2-digit", 
            month: "short", 
            year: "numeric", 
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit", 
            timeZone: "Asia/Kolkata"
        }) + " IST";  
    };

return(
    <div className="beneficiary-history">
        <h2>Accepted Devices History</h2>
        {history.length > 0 ? (
            <ul className="history-list">
                {history.map((device) => (
                    <li key={device.id} className="history-item">
                        <span><strong>{device.name}</strong> - {device.type} ({device.condition})</span>
                        <span className="accepted-date">
                            Accepted on: {formatAcceptedDate(device.acceptedDate)}
                        </span>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No devices accepted yet.</p>
        )}
    </div>
);
};

export default BeneficiaryHistory;