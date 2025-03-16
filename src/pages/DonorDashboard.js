import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/DonorDashboard.css";
import DonateDeviceForm from "./DonateDeviceForm";

const DonorDashboard = () => {
    const { donorId } = useParams();
    const [donor, setDonor] = useState(null);
    const [devices, setDevices] = useState([]);
    const userData = JSON.parse(localStorage.getItem("user")) || {};  
    const token = userData?.token;  // Ensure token is extracted properly
    console.log("Token:", token);
    const backendBaseUrl = 'http://localhost:8080';

    console.log("Donor ID:", donorId);
    console.log("User Data:", userData);
    console.log("Token:", token);

    useEffect(() => {
        const fetchDonorDetails = async () => {
            if (!donorId || !token) {
                console.error("Missing donorId or token!");
                return;
            }

            try {

                console.log(`Request URL: ${backendBaseUrl}/api/donors/${donorId}`);
                const response = await axios.get(`${backendBaseUrl}/api/donors/${donorId}`, {
                    headers: { 
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Donor Details:", response.data);
                setDonor(response.data);

                console.log(`${backendBaseUrl}/api/devices/donors/${donorId}`);
                const deviceResponse = await axios.get(`${backendBaseUrl}/api/devices/donors/${donorId}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Devices Details: ", deviceResponse.data);
                setDevices(deviceResponse.data);

            } catch (error) {
                console.error('Error fetching donor details:', error.response?.data || error.message);
            }
        };

        setTimeout(fetchDonorDetails, 1000);
        
    }, [donorId, token]);

    const fetchDonorDevices = async (e) => {
        console.log("Fetching donor devices...");
        try {
            const fetchDonorDevices = await axios.get(`${backendBaseUrl}/api/devices/donors/${donorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }); 
            setDevices(fetchDonorDevices.data);
        } catch (error) {
            console.error("Error fetching donor devices:", error.response?.data || error.message);
        }
    };

    return (
        <div className="donor-dashboard">
            <h2>Donor Dashboard</h2>
            {donor ? (
                <div className="donor-details">
                    <p><strong>Username:</strong> {donor?.user?.username || "NA"}</p>
                    <p><strong>Email:</strong> {donor?.user?.email || "NA"}</p>
                </div>
            ) : (
                <p>Loading donor details...</p>
            )}
    
            <h3>Devices You Have Donated:</h3>
            {devices.length > 0 ? (
                <ul className="device-list">
                    {devices.map(device => (
                        <li key={device.id}>
                            <span><strong>{device.name}</strong> - {device.type} ({device.condition})</span>
                            <span className={`device-status ${device.status === "Pending" ? "pending" : "accepted"}`}>
                                {device.status}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No devices donated yet.</p>
            )}
    
            <DonateDeviceForm donorId={donorId} onSuccess={fetchDonorDevices} />
        </div>
    );
};

export default DonorDashboard;
