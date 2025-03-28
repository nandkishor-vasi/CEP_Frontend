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
import { DeviceHub, Event } from "@mui/icons-material";

const DonateDeviceForm = ({ donorId, onSuccess }) => {
    const [device, setDevice] = useState({
        name: "",
        type: "",
        condition: "",
        deviceImageUrl: "",
        donationDate: new Date().toISOString().split('T')[0],
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deviceImageUrl, setDeviceImageUrl] = useState("");

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token || userData;
    const backendUrl = "http://localhost:8080";

    // Cloudinary config from .env file
    const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const cloudinaryUploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    const handleChange = (e) => {
        setDevice({
            ...device,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setDeviceImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!donorId || !token) {
            setMessage("❌ Missing donor ID or token");
            setOpenSnackbar(true);
            setLoading(false);
            return;
        }

        try {
            let imageUrl = ""; 

            // Upload to Cloudinary if an image is selected
            if (selectedFile) {
                console.log("Uploading photo to Cloudinary...");
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("upload_preset", cloudinaryUploadPreset);

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
                    formData
                );

                imageUrl = response.data.secure_url;
                setDeviceImageUrl(imageUrl);
                console.log("Uploaded Image URL:", imageUrl);
            }

            // Send data to backend
            console.log("Submitting to backend...");
            const res = await axios.post(
                `${backendUrl}/api/devices/donors/${donorId}`,
                { ...device, deviceImageUrl: imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Backend Response:", res.data);

            // Success message
            setMessage("✅ Device donated successfully!");
            setSelectedFile(null);
            setOpenSnackbar(true);
            setDevice({
                name: "",
                type: "",
                condition: "",
                donationDate: new Date().toISOString().split('T')[0],
            });
            setDeviceImageUrl("");

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

                        {/* Image Upload */}
                        <label htmlFor="image-upload">
                            <input type="file" id="image-upload" onChange={handleFileChange} style={{ display: "none" }} />
                            <Button component="span" variant="outlined" fullWidth sx={{ mb: 2 }}>
                                Upload Device Image 📷
                            </Button>
                        </label>

                        {deviceImageUrl && (
                            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                                <img src={deviceImageUrl} alt="Device Preview" width="100%" />
                            </Box>
                        )}

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
                                "&:hover": { background: "linear-gradient(45deg, #1976D2, #21A1F1)" },
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
                <Alert severity={message.startsWith("✅") ? "success" : "error"} sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DonateDeviceForm;
