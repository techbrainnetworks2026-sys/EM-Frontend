import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import './ProfileView.css';
import { useAppContext } from "../../../../context/AppContext.jsx";
import api from "../../../../../services/service.js";

const ProfileView = () => {

    const { userData, setUserData } = useAppContext();
    const [editProfile, setEditProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [imageToCrop, setImageToCrop] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return;
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleApplyCrop = async () => {
        try {
            const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
            setCroppedImage(croppedBlob);
            setImageToCrop(null);
        } catch (e) {
            console.error(e);
            setMessage('Error cropping image');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // prevent background scrolling when cropper modal is open
    useEffect(() => {
        if (imageToCrop) {
            const original = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = original; };
        }
        return undefined;
    }, [imageToCrop]);

    const handleProfileChange = (e) => {
        setUserData({ 
            ...userData, 
            [e.target.name]: e.target.value 
        });
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            setMessage('');

            const formData = new FormData();
            
            // Only add fields that are actually editable
            if (userData.blood_group) {
                formData.append('blood_group', userData.blood_group);
            }
            if (userData.mobile_number) {
                formData.append('mobile_number', userData.mobile_number);
            }
            
            // Add cropped image if available
            if (croppedImage) {
                formData.append('profile_picture', croppedImage, 'profile_picture.jpg');
            }

            // Debug: Log what we're sending
            console.log('Sending profile update with:');
            for (let [key, value] of formData.entries()) {
                if (key === 'profile_picture') {
                    console.log(`  ${key}: File (${value.size} bytes)`);
                } else {
                    console.log(`  ${key}: ${value}`);
                }
            }

            const response = await api.patch('/accounts/profile/update/', formData);

            console.log('Profile update response:', response.data);

            // Update userData with response
            if (response.data && response.data.user) {
                setUserData({
                    ...userData,
                    ...response.data.user,
                });
            }
            setCroppedImage(null);
            setMessage('Profile saved successfully!');
            setEditProfile(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            // Get detailed error message
            const errorMessage = error.response?.data?.error 
                || error.response?.data?.detail
                || error.response?.data?.message
                || (error.response?.data && Object.entries(error.response.data)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', '))
                || 'Error saving profile. Please try again.';
            
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!userData) {
        return <div>Loading profile...</div>;
    }


    return (
        <div className="dashboard-view-profile-view-container">
            {/* Cropper Modal */}
            {imageToCrop && (
                <div className="cropper-modal-overlay">
                    <div className="cropper-modal-content">
                        <div className="cropper-container">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>
                        <div className="cropper-controls">
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(e.target.value)}
                                className="zoom-range"
                            />
                            <div className="cropper-actions">
                                <button className="secondary-btn" onClick={() => setImageToCrop(null)}>Cancel</button>
                                <button className="primary-btn" onClick={handleApplyCrop}>Apply</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="profile-card">
                <div className="profile-header-section">
                    <div className="profile-image-section">
                        <div className="profile-image-large">
                            {croppedImage ? (
                                <img src={URL.createObjectURL(croppedImage)} alt="Cropped Profile" />
                            ) : userData.profile_picture_url ? (
                                <img src={userData.profile_picture_url} alt="User Profile" />
                            ) : (
                                <span className="avatar-placeholder big">👤</span>
                            )}
                        </div>
                        {editProfile && (
                            <div className="upload-container">
                                <label htmlFor="pfp-upload" className="upload-btn">
                                    📷 Upload Photo
                                </label>
                                <input
                                    id="pfp-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden-input"
                                />
                            </div>
                        )}
                    </div>
                    <div className="profile-main-info">
                        <h2>{userData.username}</h2>
                        <p className="designation-text">{userData.designation}</p>
                    </div>
                </div>

                <div className="profile-form-grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input name="username" value={userData.username || ''} disabled={!editProfile} onChange={handleProfileChange} />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input value={userData.email || ''} disabled />
                    </div>

                    <div className="form-group">
                        <label>Blood Group</label>
                        <select name="blood_group" value={userData.blood_group || ""} disabled={!editProfile} onChange={handleProfileChange}>
                            <option value="">Select Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Mobile</label>
                        <input name="mobile_number" value={userData.mobile_number || ''} disabled={!editProfile} onChange={handleProfileChange} />
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <input value={userData.department || ''} disabled />
                    </div>

                    <div className="form-group">
                        <label>Designation</label>
                        <input value={userData.designation || ''} disabled />
                    </div>
                </div>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <div className="profile-actions mt-20">
                    {!editProfile ? (
                        <button className="primary-btn" onClick={() => setEditProfile(true)}>Edit Profile</button>
                    ) : (
                        <>
                            <button className="secondary-btn" onClick={() => {
                                setEditProfile(false);
                                setCroppedImage(null);
                            }} disabled={loading}>Cancel</button>
                            <button className="primary-btn" onClick={handleSaveProfile} disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
