import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AnnouncementsView = () => {

    const [announcements, setAnnouncements] = useState([]);

    const fetchAnnouncements = async () => {
        try{
            const res = await axios.get("https://tn-em-backend.onrender.com/api/announcement/announcements/");
            setAnnouncements(res.data);
        }catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", }).format(new Date(dateString));
    };

    return (
        <div className="dashboard-view announcements-view">
            <h2>Announcements</h2>
            <div className="announcement-list">
                {announcements.map(ann => (
                    <div key={ann.id} className="announcement-item">
                        <div className="ann-header">
                            <h3>📢 {ann.title}</h3>
                            <span className="ann-date">{formatDate(ann.created_at)}</span>
                        </div>
                        <p className="ann-message">{ann.content}</p>
                        <div className="ann-footer">
                            <small>Posted by: Management</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementsView;
