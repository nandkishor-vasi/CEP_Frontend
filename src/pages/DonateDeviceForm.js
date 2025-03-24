import React, { useState } from "react";
import axios from "axios";
import {
    TextField,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Box,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";
import { DeviceHub, Category, Event } from "@mui/icons-material";

const DonateDeviceForm = ({ donorId, onSuccess }) => {
    const [device, setDevice] = useState({
        name: "",
        type: "",
        condition: "",
        donationDate: new Date().toISOString().split('T')[0],
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token || userData;
    const backendUrl = "http://localhost:8080";

    const handleChange = (e) => {
        setDevice({
            ...device,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!donorId || !token) {
            setMessage("Missing donor ID or token");
            setOpenSnackbar(true);
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                `${backendUrl}/api/devices/donors/${donorId}`,
                { ...device },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("✅ Device donated successfully!");
            setOpenSnackbar(true);
            setDevice({
                name: "",
                type: "",
                condition: "",
                donationDate: new Date().toISOString().split('T')[0],
            });

            if (onSuccess) onSuccess();

        } catch (error) {
            console.error("Error donating device:", error.response?.data || error.message);
            setMessage("❌ Error donating device. Please try again.");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Card sx={{ maxWidth: 450, p: 3, boxShadow: 5, borderRadius: 3 }}>
                <CardContent>
                    <Typography
                        variant="h5"
                        textAlign="center"
                        sx={{ fontWeight: "bold", color: "#1976D2", mb: 2 }}
                    >
                        🎁 Donate a Device
                    </Typography>

                    <form onSubmit={handleSubmit}>

                        {/* Device Name */}
                        <TextField
                            fullWidth
                            label="Device Name"
                            name="name"
                            value={device.name}
                            onChange={handleChange}
                            variant="outlined"
                            required
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: <DeviceHub color="primary" sx={{ mr: 1 }} />,
                            }}
                        />

                        {/* Device Type */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Device Type</InputLabel>
                            <Select
                                name="type"
                                value={device.type}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="">Select Type</MenuItem>
                                <MenuItem value="Laptop">💻 Laptop</MenuItem>
                                <MenuItem value="Tablet">📱 Tablet</MenuItem>
                                <MenuItem value="Smartphone">📞 Smartphone</MenuItem>
                                <MenuItem value="Desktop">🖥 Desktop</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Condition */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Condition</InputLabel>
                            <Select
                                name="condition"
                                value={device.condition}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="">Select Condition</MenuItem>
                                <MenuItem value="New">✨ New</MenuItem>
                                <MenuItem value="Good">👍 Good</MenuItem>
                                <MenuItem value="Fair">⚠ Fair</MenuItem>
                                <MenuItem value="Needs Repair">🔧 Needs Repair</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Donation Date */}
                        <TextField
                            fullWidth
                            type="date"
                            name="donationDate"
                            value={device.donationDate}
                            onChange={handleChange}
                            required
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: <Event color="primary" sx={{ mr: 1 }} />,
                            }}
                        />

                        {/* Donate Button with Loading Indicator */}
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            type="submit"
                            sx={{
                                background: "linear-gradient(45deg, #2196F3, #21CBF3)",
                                color: "white",
                                fontWeight: "bold",
                                "&:hover": {
                                    background: "linear-gradient(45deg, #1976D2, #21A1F1)",
                                },
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Donate"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Snackbar for Success/Error Messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity={message.startsWith("✅") ? "success" : "error"}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DonateDeviceForm;

