import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
    Card, CardContent, Typography, List, ListItem, ListItemText, Divider, CircularProgress, Box
} from "@mui/material";
import { History } from "@mui/icons-material";

const BeneficiaryHistory = ({ updateTrigger }) => {
    const { beneficiaryId } = useParams();
    const [history, setBeneficiaryHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const token = userData?.token;
    const backendBaseUrl = "http://localhost:8080";

    useEffect(() => {
        const fetchBeneficiaryHistory = async () => {
            if (!beneficiaryId || !token) {
                setError("Missing beneficiary ID or authentication token.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${backendBaseUrl}/api/beneficiary/${beneficiaryId}/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBeneficiaryHistory(response.data);
            } catch (err) {
                setError("Failed to load history. Please try again later.");
                console.error("Error fetching beneficiary history:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBeneficiaryHistory();
    }, [beneficiaryId, token, updateTrigger]);

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

    return (
        <Card sx={{ borderRadius: 2, boxShadow: 3, background: "rgba(255, 255, 255, 0.9)", mt: 3 }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <History color="primary" />
                    <Typography variant="h6" color="primary">📜 Accepted Devices History</Typography>
                </Box>

                {loading ? (
                    <CircularProgress sx={{ display: "block", margin: "auto" }} />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : history.length > 0 ? (
                    <List>
                        {history.map((device, index) => (
                            <React.Fragment key={device.id}>
                                <ListItem sx={{ background: "#f5f5f5", borderRadius: 2, mb: 1 }}>
                                    <ListItemText
                                        primary={<Typography fontWeight="bold">{device.name} - {device.type} ({device.condition})</Typography>}
                                        secondary={`Accepted on: ${formatAcceptedDate(device.acceptedDate)}`}
                                    />
                                </ListItem>
                                {index !== history.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography color="textSecondary">No devices accepted yet.</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default BeneficiaryHistory;
