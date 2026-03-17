import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import './ProfileView.css';
import { useAppContext } from "../../../../context/AppContext.jsx";
import api from "../../../../../services/service.js";

// Helper functions moved outside component to prevent recreation on every render
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

const ProfileView = () => {
    const { userData, setUserData } = useAppContext();
    const [editProfile, setEditProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Local state for editing form to avoid mutating global API state on every keystroke
    const [editFormData, setEditFormData] = useState({});

    // Image cropping state
    const [imageToCrop, setImageToCrop] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Sync local form state when entering edit mode
    useEffect(() => {
        if (editProfile && userData) {
            setEditFormData({
                blood_group: userData.blood_group || "",
                mobile_number: userData.mobile_number || "",
                department: userData.department || "",
                designation: userData.designation || "",
                date_of_birth: userData.date_of_birth || "",
            });
        }
    }, [editProfile, userData]);

    // Handle Blob object URL lifecycle to prevent memory leaks
    useEffect(() => {
        if (croppedImage) {
            const tempUrl = URL.createObjectURL(croppedImage);
            setPreviewUrl(tempUrl);
            return () => URL.revokeObjectURL(tempUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [croppedImage]);

    // Cleanup cropping modal body scroll lock
    useEffect(() => {
        if (imageToCrop) {
            const original = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = original; };
        }
    }, [imageToCrop]);

    const onCropComplete = useCallback((_, currentCroppedAreaPixels) => {
        setCroppedAreaPixels(currentCroppedAreaPixels);
    }, []);

    const handleApplyCrop = useCallback(async () => {
        try {
            if (!imageToCrop || !croppedAreaPixels) return;
            const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
            if (croppedBlob) {
                setCroppedImage(croppedBlob);
            }
            setImageToCrop(null);
        } catch (e) {
            console.error(e);
            setMessage('Error cropping image');
        }
    }, [imageToCrop, croppedAreaPixels]);

    const handleImageUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleProfileChange = useCallback((e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSaveProfile = useCallback(async () => {
        try {
            setLoading(true);
            setMessage('');

            const formData = new FormData();

            // Append updated fields
            Object.entries(editFormData).forEach(([key, value]) => {
                if (value) {
                    formData.append(key, value);
                }
            });

            // Add cropped image if available
            if (croppedImage) {
                formData.append('profile_picture', croppedImage, 'profile_picture.jpg');
            }

            const response = await api.patch('/accounts/profile/update/', formData);

            // Update global user state with response
            if (response?.data?.user) {
                setUserData((prev) => ({
                    ...prev,
                    ...response.data.user,
                }));
            }

            setCroppedImage(null);
            setMessage('Profile saved successfully!');
            setEditProfile(false);

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving profile:', error);

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
    }, [editFormData, croppedImage, setUserData]);

    const handleCancelEdit = useCallback(() => {
        setEditProfile(false);
        setCroppedImage(null);
        setMessage('');
    }, []);

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
                                objectFit="cover"
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
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="zoom-range"
                            />
                            <div className="cropper-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() => setImageToCrop(null)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="primary-btn"
                                    onClick={handleApplyCrop}
                                >
                                    Apply Picture
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="profile-card">
                <div className="profile-header-section">
                    <div className="profile-image-section">
                        <div className="profile-image-large">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Cropped Profile" />
                            ) : userData.profile_picture_url ? (
                                <img src={userData.profile_picture_url} alt="User Profile" />
                            ) : (
                                <span className="avatar-placeholder big">👤</span>
                            )}
                        </div>
                        {editProfile && (
                            <div className="upload-container">
                                <label htmlFor="pfp-upload" className="upload-btn" title="Upload Photo">
                                    📷
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
                        <label>Email</label>
                        <input value={userData.email || ''} disabled />
                    </div>

                    <div className="form-group">
                        <label>Blood Group</label>
                        <select
                            name="blood_group"
                            value={editProfile ? editFormData.blood_group : (userData.blood_group || "")}
                            disabled={!editProfile}
                            onChange={handleProfileChange}
                        >
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
                        <input
                            name="mobile_number"
                            value={editProfile ? editFormData.mobile_number : (userData.mobile_number || '')}
                            disabled={!editProfile}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="date_of_birth"
                            value={editProfile ? editFormData.date_of_birth : (userData.date_of_birth || '')}
                            disabled={!editProfile}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Department</label>
                        <input
                            name="department"
                            value={editProfile ? editFormData.department : (userData.department || '')}
                            disabled={!editProfile}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Designation</label>
                        <input
                            name="designation"
                            value={editProfile ? editFormData.designation : (userData.designation || '')}
                            disabled={!editProfile}
                            onChange={handleProfileChange}
                        />
                    </div>
                </div>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <div className="profile-actions mt-20">
                    {!editProfile ? (
                        <button className="primary-btn" onClick={() => setEditProfile(true)}>
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                className="secondary-btn"
                                onClick={handleCancelEdit}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="primary-btn"
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
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
