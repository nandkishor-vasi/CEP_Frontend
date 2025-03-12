import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BeneficiaryDashboard = () => {
    const { beneficiaryId } = useParams();
    const [beneficiary, setBeneficiary] = useState(null);
    const userData = JSON.parse(localStorage.getItem("user"));  
    const token = userData?.token || userData;
    const backendBaseUrl = 'http://localhost:8080';

    console.log("Beneficiary ID:", beneficiaryId);
    console.log("User Data:", userData);
    console.log("Token:", token);

    useEffect(() => {
        const fetchDonorDetails = async () => {
            if (!beneficiaryId || !token) {
                console.error("Missing beneficiaryId or token!");
                return;
            }
            try {
                console.log(`Request URL: ${backendBaseUrl}/api/beneficiary/${beneficiaryId}`);
                const response = await axios.get(`${backendBaseUrl}/api/beneficiary/${beneficiaryId}`, {
                    headers: { 
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Donor Details:", response.data);
                setBeneficiary(response.data);
            } catch (error) {
                console.error('Error fetching donor details:', error.response?.data || error.message);
            }
        };

        fetchDonorDetails();
    }, [beneficiaryId, token]);

    return (
        <div>
            <h2>Beneficiary Dashboard:</h2>
            {beneficiary ? (
                <div>
                    <p>Username: {beneficiary?.user?.username || "NA"}</p>
                    <p>Email: {beneficiary?.user?.email || "NA"}</p>
                </div>
            ) : (
                <p>Loading Beneficiary details...</p>
            )}
        </div>
    );
};

export default BeneficiaryDashboard;