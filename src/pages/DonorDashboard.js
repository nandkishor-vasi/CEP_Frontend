import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
    Container, Card, CardContent, Typography, Button, List, ListItem, ListItemText, 
    Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Grid, Box
} from "@mui/material";
import { Person, CheckCircle, PendingActions, Inbox } from "@mui/icons-material";
import DonateDeviceForm from "./DonateDeviceForm";
import ParallaxHero from "../components/ParallaxHero";

const DonorDashboard = () => {
    const { donorId } = useParams();
    const [donor, setDonor] = useState(null);
    const [devices, setDevices] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const token = userData?.token;
    const backendBaseUrl = "http://localhost:8080";

    useEffect(() => {
        const fetchDonorDetails = async () => {
            if (!donorId || !token) return;

            try {
                const [donorResponse, deviceResponse] = await Promise.all([
                    axios.get(`${backendBaseUrl}/api/donors/${donorId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${backendBaseUrl}/api/devices/donors/${donorId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setDonor(donorResponse.data);
                setDevices(deviceResponse.data);
            } catch (error) {
                console.error("Error fetching donor details:", error.response?.data || error.message);
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

    const handleDeviceAdded = async () => {
        try {
            const response = await axios.get(`${backendBaseUrl}/api/devices/donors/${donorId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDevices(response.data); 
        } catch (error) {
            console.error("Error fetching updated devices:", error.response?.data || error.message);
        }
    };

    if (loading) return <CircularProgress style={{ margin: "50px auto", display: "block" }} />;

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                overflow: "hidden",
                backgroundColor: "#0a192f",
                color: "#fff"
            }}
        > 
            <ParallaxHero/>
            <Container maxWidth="lg" sx={{ mt: 4, position: "relative", zIndex: 1 }}>
                <Typography variant="h4" align="center" fontWeight="bold" gutterBottom sx={{ color: "#007bff", textShadow: "2px 0px 2px rgba(255, 255, 255, 0.84)" }}>
                    🎁 Donor Dashboard
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3, background: "rgba(255, 255, 255, 0.9)" }}>
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Person fontSize="large" color="primary" />
                                <Typography variant="h6">Welcome, {donor?.user?.username || "Donor"}!</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%", background: "rgba(255, 255, 255, 0.9)" }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ color: "#3f51b5" }}>📦 Devices You Have Donated</Typography>
                                {devices.length > 0 ? (
                                    <List>
                                        {devices.map((device, index) => (
                                            device ? ( // Check if device exists
                                                <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between", background: "#fff", borderRadius: 2, mb: 1 }}>
                                                    <ListItemText primary={`${device.name || "Unknown"} - ${device.type || "Unknown"} (${device.condition || "Unknown"})`} />
                                                    <Chip
                                                        icon={device.status === "Pending" ? <PendingActions /> : <CheckCircle />}
                                                        label={device.status || "Unknown"}
                                                        color={device.status === "Pending" ? "warning" : "success"}
                                                    />
                                                </ListItem>
                                            ) : null
                                        ))}
                                    </List>
                                ) : (
                                    <Typography color="textSecondary">No devices donated yet.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%", background: "rgba(255, 255, 255, 0.9)" }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ color: "#3f51b5" }}>📩 Requests from Beneficiaries</Typography>
                                <Button variant="contained" color="primary" fullWidth onClick={fetchPendingRequests} sx={{ mb: 2 }}>
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
                                                            <Chip label={req.status} color={req.status === "Pending" ? "warning" : "success"} />
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
                                    <Typography color="textSecondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Inbox color="disabled" /> No pending requests.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <DonateDeviceForm donorId={donorId} onSuccess={handleDeviceAdded} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default DonorDashboard;
