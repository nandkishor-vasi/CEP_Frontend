import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
    Container, Card, CardContent, Typography, Button, List, ListItem, ListItemText, 
    Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box
} from "@mui/material";
import { Person, CheckCircle, PendingActions } from "@mui/icons-material";
import DonateDeviceForm from "./DonateDeviceForm";
import DonorHistory from "./DonorHistory";

const DonorDashboard = () => {
    const { donorId } = useParams();
    const [donor, setDonor] = useState(null);
    const [devices, setDevices] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const token = userData?.token;
    const backendBaseUrl = 'http://localhost:8080';

    useEffect(() => {
        const fetchDonorDetails = async () => {
            if (!donorId || !token) return;

            try {
                // Fetch Donor Info
                const response = await axios.get(`${backendBaseUrl}/api/donors/${donorId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDonor(response.data);

                // Fetch Donated Devices
                const deviceResponse = await axios.get(`${backendBaseUrl}/api/devices/donors/${donorId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDevices(deviceResponse.data);
            } catch (error) {
                console.error('Error fetching donor details:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDonorDetails();
    }, [donorId, token]);

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get(`${backendBaseUrl}/api/request/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching pending requests:", error.response?.data || error.message);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.post(`${backendBaseUrl}/api/request/${requestId}/donor/${donorId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingRequests();
        } catch (error) {
            console.error("Error accepting request:", error.response?.data || error.message);
        }
    };

    if (loading) return <CircularProgress style={{ margin: "50px auto", display: "block" }} />;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {/* Header */}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
                🎁 Donor Dashboard
            </Typography>

            {/* Donor Info Card */}
            <Card sx={{ mb: 3, p: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Person fontSize="large" /> Welcome, {donor?.user?.username || "Donor"}
                    </Typography>
                </CardContent>
            </Card>

            {/* Devices Donated Section */}
            <Card sx={{ mb: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6">📦 Devices You Have Donated</Typography>
                    {devices.length > 0 ? (
                        <List>
                            {devices.map((device) => (
                                <ListItem key={device.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <ListItemText primary={`${device.name} - ${device.type} (${device.condition})`} />
                                    <Chip
                                        icon={device.status === "Pending" ? <PendingActions /> : <CheckCircle />}
                                        label={device.status}
                                        color={device.status === "Pending" ? "warning" : "success"}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography color="textSecondary">No devices donated yet.</Typography>
                    )}
                </CardContent>
            </Card>

            {/* Donor History Section */}
            <DonorHistory donorId={donorId} />

            {/* Requests Section */}
            <Card sx={{ mb: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6">📩 Requests from Beneficiaries</Typography>
                    <Button variant="contained" color="primary" onClick={fetchPendingRequests} sx={{ mb: 2 }}>
                        Fetch Pending Requests
                    </Button>
                    {requests.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Request ID</b></TableCell>
                                        <TableCell><b>Beneficiary Name</b></TableCell>
                                        <TableCell><b>Device Name</b></TableCell>
                                        <TableCell><b>Accepted Date</b></TableCell>
                                        <TableCell><b>Status</b></TableCell>
                                        <TableCell><b>Action</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell>{req.id}</TableCell>
                                            <TableCell>{req.beneficiaryName || "N/A"}</TableCell>
                                            <TableCell>{req.deviceName || "N/A"}</TableCell>
                                            <TableCell>{req.createdAt}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={req.status}
                                                    color={req.status === "Pending" ? "warning" : "success"}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {req.status === "Pending" && (
                                                    <Button variant="contained" color="success" onClick={() => handleAcceptRequest(req.id)}>
                                                        Accept
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography color="textSecondary">No pending requests.</Typography>
                    )}
                </CardContent>
            </Card>

            {/* Donate Device Form */}
            <DonateDeviceForm donorId={donorId} onSuccess={() => {}} />
        </Container>
    );
};

export default DonorDashboard;
