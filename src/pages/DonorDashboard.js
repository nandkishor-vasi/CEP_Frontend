import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DonorDashboard = () => {
    const { donorId } = useParams();
    const [donor, setDonor] = useState(null);
    const userData = JSON.parse(localStorage.getItem("user"));  
    const token = userData?.token || userData;
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
            } catch (error) {
                console.error('Error fetching donor details:', error.response?.data || error.message);
            }
        };

        fetchDonorDetails();
    }, [donorId, token]);

    return (
        <div>
            <h2>Donor Dashboard:</h2>
            {donor ? (
                <div>
                    <p>Username: {donor?.user?.username || "NA"}</p>
                    <p>Email: {donor?.user?.email || "NA"}</p>
                </div>
            ) : (
                <p>Loading donor details...</p>
            )}
        </div>
    );
};

export default DonorDashboard;
