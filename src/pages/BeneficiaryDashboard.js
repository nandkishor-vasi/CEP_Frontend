import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/BeneficiaryDashboard.css";
import BeneficiaryHistory from "./BeneficiaryHistory";
import RequestForm from "./RequestForm";

const BeneficiaryDashboard = () => {
    const { beneficiaryId } = useParams();
    const [beneficiary, setBeneficiary] = useState(null);
    const [availableDevices, setAvailableDevices] = useState([]);
    const [requests, setRequests] = useState([]);

    const userData = JSON.parse(localStorage.getItem("user"));  
    const token = userData ? userData.token : null;
    const backendBaseUrl = "http://localhost:8080";

    console.log("Beneficiary ID:", beneficiaryId);
    console.log("User Data:", userData);
    console.log("Token:", token);

    useEffect(() => {
        if (!beneficiaryId || !token) {
            console.error("Missing beneficiaryId or token!");
            return;
        }

        const fetchBeneficiaryDetails = async () => {
            try {
                console.log(`Request URL: ${backendBaseUrl}/api/beneficiary/${beneficiaryId}`);
                const response = await axios.get(`${backendBaseUrl}/api/beneficiary/${beneficiaryId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Beneficiary Details:", response.data);
                setBeneficiary(response.data);
            } catch (error) {
                console.error("Error fetching beneficiary details:", error.response?.data || error.message);
            }
        };

        const fetchRequests = async () => {
            try {
                console.log("Fetching requests for beneficiary ID:", beneficiaryId);
                const response = await axios.get(`${backendBaseUrl}/api/request/beneficiary/${beneficiaryId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Requests:", response.data);
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching requests:", error.response?.data || error.message);
            }
        };

   
        fetchBeneficiaryDetails();
        fetchRequests();
        fetchAvailableDevices();
    }, [beneficiaryId, token]);

    const fetchAvailableDevices = async () => {
        try {
            console.log("Fetching available devices...");
            const response = await axios.get(`${backendBaseUrl}/api/devices/available`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Available Devices:", response.data);
            setAvailableDevices(response.data);
        } catch (error) {
            console.error("Error fetching available devices:", error.response?.data || error.message);
        }
    };

    
    const handleAcceptDevice = async (deviceId) => {
        console.log("Accepting device...", deviceId);
        try {
            const response = await axios.put(`${backendBaseUrl}/api/devices/${deviceId}/beneficiaries/${beneficiaryId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Device accepted:", response.data);
            setTimeout(fetchAvailableDevices, 500);
        } catch (error) {
            console.error("Error accepting device:", error.response?.data || error.message);
        }
    };

    return (
        <div className="beneficiary-dashboard">
            <h2 className="h2-beneficiary-dashboard">Beneficiary Dashboard</h2>

            {beneficiary ? (
                <div>
                    <p>Username: {beneficiary?.user?.username || "NA"}</p>
                    <p>Email: {beneficiary?.user?.email || "NA"}</p>
                </div>
            ) : (
                <p>Loading Beneficiary details...</p>
            )}

            <h3>Requests:</h3>
            {requests.length > 0 ? (
                <ul className="request-list">
                    {requests.map((request) => (
                        <li key={request.id} className="request-item">
                            <span>
                                <strong>{request.description}</strong> - {request.createdAt}
                            </span>
                            <span className={`request-status ${request.status === "Pending" ? "pending" : "accepted"}`}>
                                {request.status}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No requests.</p>
            )}

            <h3>Available Devices:</h3>
            <button onClick={fetchAvailableDevices()}>Fetch Available Devices</button>
            {availableDevices.length > 0 ? (
                <ul className="device-list">
                    {availableDevices.map((device) => (
                        <li key={device.id} className="device-item">
                            <span>
                                <strong>{device.name}</strong> - {device.type} ({device.condition})
                            </span>
                            <span className={`device-status ${device.status === "Pending" ? "pending" : "accepted"}`}>
                                {device.status}
                            </span>
                            {device.status === "Pending" && (
                                <button className="btn-accept" onClick={() => handleAcceptDevice(device.id)}>
                                    Accept
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No available devices.</p>
            )}

            <BeneficiaryHistory />
            <RequestForm beneficiaryId={beneficiaryId} />
        </div>
    );
};

export default BeneficiaryDashboard;
