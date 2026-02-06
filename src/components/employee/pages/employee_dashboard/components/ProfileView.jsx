import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import './ProfileView.css';
import { useAppContext } from "../../../../context/AppContext.jsx"; 

const ProfileView = () => {

    const { userData, setUserData } = useAppContext();
    const [editProfile, setEditProfile] = useState(false);

    const [imageToCrop, setImageToCrop] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    resolve(reader.result);
                };
            }, 'image/jpeg');
        });
    };

    const handleApplyCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
            setUser({ ...user, profilePicture: croppedImage });
            setImageToCrop(null);
        } catch (e) {
            console.error(e);
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
        setUser({ ...user, [e.target.name]: e.target.value });
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
                            {userData.profilePicture ? (
                                <img src={userData.profilePicture} alt="User Profile" />
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
                        <input name="name" value={userData.username} disabled={!editProfile} onChange={handleProfileChange} />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input value={userData.email} disabled />
                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" name="dob" value={userData.dob || ""} disabled />
                    </div>

                    <div className="form-group">
                        <label>Blood Group</label>
                        <select name="bloodGroup" value={userData.blood_group || ""} disabled={!editProfile} onChange={handleProfileChange}>
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
                        <input name="mobile" value={userData.mobile_number} disabled={!editProfile} onChange={handleProfileChange} />
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <input value={userData.department} disabled  />
                    </div>

                    <div className="form-group">
                        <label>Designation</label>
                        <input value={userData.designation} disabled />
                    </div>
                </div>

                {/* <div className="form-group full-width mt-10">
                    <label>Address</label>
                    <textarea name="address" value={user.address} disabled={!editProfile} onChange={handleProfileChange} />
                </div> */}

                <div className="profile-actions mt-20">
                    {!editProfile ? (
                        <button className="primary-btn" onClick={() => setEditProfile(true)}>Edit Profile</button>
                    ) : (
                        <button className="primary-btn" onClick={() => setEditProfile(false)}>Save Changes</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
