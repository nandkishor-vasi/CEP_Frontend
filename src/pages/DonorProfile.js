import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css"

const Profile = () => {
  const { user } = useAuth();
  const donorId = user?.id;
  const token = user?.token;
  const backendBaseUrl = "http://localhost:8080";

  const [profile, setProfile] = useState({
    profileImageUrl: "",
    city: "",
    state: "",
    country: "",
    donationCount: 0,
    donorType: "",
    notes: "",
  });

  const [editing, setEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (donorId) {
      fetchDonorProfile();
    }
  }, [donorId]);

  const fetchDonorProfile = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/api/donors/${donorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching donor profile:", error);
      alert("Failed to fetch donor profile.");
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const cloudinaryUploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET; 
    try {
      const updatedData = { ...profile };
      console.log("updating profile...0");
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", cloudinaryUploadPreset);
        try {
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
            formData);
            
            const imageUrl = response.data.secure_url;
            alert("Image uploaded to cloud successfully!");
          
          await axios.put(`${backendBaseUrl}/api/donors/${donorId}/updateImage`,  { profileImageUrl: imageUrl }, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          });

          setProfile({ ...profile, profileImageUrl: imageUrl });
          
          alert("Image uploaded to db successfully!");
          setEditing(false);
          setSelectedFile(null);
          
        }
        catch (error) {
          console.error("Error uploading image:", error);
          alert("Upload failed!");
        }
      }

      console.log("updating profile...");
      await axios.put(`${backendBaseUrl}/api/donors/${donorId}/profile`, updatedData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      setProfile(updatedData);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-header">Donor Profile</h2>

      <div className="profile-image-section">
        <img
          src={profile.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/8847/8847419.png"}
          alt="Profile"
          className="profile-image"
        />

        {editing && (
          <div className="file-input-wrapper">
            <input type="file" className="file-input" onChange={handleFileChange} />
            {selectedFile && <p className="file-name">{selectedFile.name}</p>}
          </div>
        )}
      </div>

      {/* Profile Form */}
      <div className="profile-form">
        <label>City:</label>
        <input type="text" name="city" value={profile.city} onChange={handleChange} disabled={!editing} />

        <label>State:</label>
        <input type="text" name="state" value={profile.state} onChange={handleChange} disabled={!editing} />

        <label>Country:</label>
        <input type="text" name="country" value={profile.country} onChange={handleChange} disabled={!editing} />

        <label>Donation Count:</label>
        <input type="number" name="donationCount" value={profile.donationCount}  />

        <label>Donor Type:</label>
        <select name="donorType" value={profile.donorType} onChange={handleChange} disabled={!editing}>
          <option value="">Select Donor Type</option>
          <option value="INDIVIDUAL">INDIVIDUAL</option>
          <option value="ORGANIZATION">ORGANIZATION</option>
        </select>

        <label>Notes:</label>
        <textarea name="notes" value={profile.notes} onChange={handleChange} disabled={!editing}></textarea>

        {/* Button Section */}
        <div className="button-group">
          {editing ? (
            <>
              <button className="save-button" onClick={handleSave}>SAVE</button>
              <button className="cancel-button" onClick={() => setEditing(false)}>CANCEL</button>
            </>
          ) : (
            <button className="edit-button" onClick={() => setEditing(true)}>EDIT PROFILE</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
