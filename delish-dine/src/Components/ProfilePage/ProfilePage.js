import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './ProfilePage.css'

export default function ProfilePage() {
    const { id } = useParams()
    const [userDetails, setUserDetails] = useState({
        username: "",
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confPassword: ""
    })
    const [isEditing, setIsEditing] = useState(false)

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/get_user_by_id/${id}/`);
            if (response.data.success) {
                setUserDetails(response.data.user);
            } else {
                console.log(response.data.error);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/api/update_user/${id}/`, userDetails);
            if (response.data.success) {
                alert("Profile updated successfully");
                setIsEditing(false);
                fetchUserDetails();  // Re-fetch the updated details
            } else {
                console.log(response.data.error);
            }
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <div className="profile-container">
            <h2>Profile Page</h2>
            <form onSubmit={handleSubmit} className="profile-form">
                {Object.keys(userDetails).map((key) => {
                    const value = userDetails[key];
                    return value ? (
                        <div key={key} className="form-group">
                            <label className="form-label">{key}:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            ) : (
                                <span className="form-value">{value}</span>
                            )}
                        </div>
                    ) : null;
                })}
                {isEditing && (
                    <button 
                        type="submit" 
                        className="submit-button"
                    >
                        Save Changes
                    </button>
                )}
                {!isEditing && (
                    <button 
                        type="button" 
                        onClick={() => setIsEditing(true)} 
                        className="edit-button"
                    >
                        Edit Profile
                    </button>
                )}
            </form>
        </div>
    )
}
