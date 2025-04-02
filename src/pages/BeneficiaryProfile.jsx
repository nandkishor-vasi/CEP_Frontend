import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css"

const BeneficiaryProfile = () => {
    const { user } = useAuth();
    const beneficiaryId = user?.id;
    const token = user?.token;
    console.log("User ID: ", user?.id);
    console.log("Beneficiary ID Profile: ", beneficiaryId);
    const backendBaseUrl = "http://localhost:8080";
    const [profile, setProfile] = useState({
        profileImageUrl: "",
        city: "",
        state: "",
        country: "",
        donationsReceived: 0,
        beneficiaryType: "", 
        status: "",
        needDescription: "",
    });

    const [editing, setEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (beneficiaryId) {
          fetchBeneficiaryProfile();
        }
    }, [beneficiaryId]);

    const fetchBeneficiaryProfile = async () => {
        try {
            const response = await axios.get(`${backendBaseUrl}/api/beneficiary/${beneficiaryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching beneficiary profile:", error);
            alert("Failed to fetch beneficiary profile.");
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handelSave = async () => {
      const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      const cloudinaryUploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET; 

        try {
            const updatedData = { ...profile };
            console.log("updating profile...0");
            
            if(selectedFile) {
              console.log("updating profile...1");
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("upload_preset", cloudinaryUploadPreset);

               try {
                    const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, formData);
                    updatedData.profileImageUrl = response.data.secure_url;

                    const imageUrl = response.data.secure_url;
                    alert("Image uploaded to cloud successfully!");
                    console.log("Beneficiary ID:", beneficiaryId);
                    

                    await axios.put(`${backendBaseUrl}/api/beneficiary/${beneficiaryId}/updateImage`, { profileImageUrl: imageUrl }, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    setProfile({ ...profile, profileImageUrl: imageUrl });
                    alert("Profile Image Updated Successfully!");
                    setEditing(false);
                    setSelectedFile(null);
               } catch (error) {
                    console.error("Error uploading image:", error);
                    alert("Upload failed!");
                  }
                }
                const { user, ...profileData } = profile;
                console.log("Sending updated profile data:", profileData);
                const response = await axios.put(`${backendBaseUrl}/api/beneficiary/${beneficiaryId}/profile`, profileData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Profile update response:", response);
                

               setProfile(updatedData);
               setEditing(false);
               alert("Profile updated successfully!");

        } catch (error) {
            console.log("Error updating profile:", error)
            alert("Failed to update profile.");   
        }
    };

    return (
        <div className="profile-container">
          <h2 className="profile-header">Beneficiary Profile</h2>
    
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
    
          <div className="profile-form">
            <label>City:</label>
            <input type="text" name="city" value={profile.city} onChange={handleChange} disabled={!editing} />
    
            <label>State:</label>
            <input type="text" name="state" value={profile.state} onChange={handleChange} disabled={!editing} />
    
            <label>Country:</label>
            <input type="text" name="country" value={profile.country} onChange={handleChange} disabled={!editing} />
    
            <label>Donations Received:</label>
            <input type="number" name="donationsReceived" value={profile.donationsReceived}  />
    
            <label>Beneficiary Type:</label>
            <select name="beneficiaryType" value={profile.beneficiaryType} onChange={handleChange} disabled={!editing}>
              <option value="">Select Beneficiary Type</option>
              <option value="INDIVIDUAL">INDIVIDUAL</option>
              <option value="ORGANIZATION">ORGANIZATION</option>
            </select>

            <label>Beneficiary Status:</label>
            <select name="status" value={profile.status} onChange={handleChange} disabled={!editing}>
              <option value="">Select Beneficiary Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
    
            <label>Description:</label>
            <textarea name="needDescription" value={profile.needDescription} onChange={handleChange} disabled={!editing}></textarea>
    
            <div className="button-group">
              {editing ? (
                <>
                  <button className="save-button" onClick={handelSave}>SAVE</button>
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

export default BeneficiaryProfile;