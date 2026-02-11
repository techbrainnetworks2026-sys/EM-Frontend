import { AppBar, Avatar, Box, IconButton, Typography } from '@mui/material'
import React, { useState, useEffect, useCallback } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import api from '../../../services/service.js';

function Navbar(){

    const { sidebarOpen, setSidebarOpen } = useAppContext();
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(0);
    const [showNewNotificationAnimation, setShowNewNotificationAnimation] = useState(false);
    const initialFetchDone = React.useRef(false);

    const handleSidebarOpen = () => {
        if(sidebarOpen){
            setSidebarOpen(false);
        }else{
            setSidebarOpen(true)
        }
    }

    // Fetch notification count
    const fetchNotificationCount = useCallback(async () => {
        try {
            const response = await api.get('notifications/unread-count/');
            const newCount = response.data.unread_count || 0;
            
            // Update state with animation trigger if count changed
            setNotificationCount(prevCount => {
                if (newCount > prevCount) {
                    setShowNewNotificationAnimation(true);
                    setTimeout(() => setShowNewNotificationAnimation(false), 600);
                }
                return newCount;
            });
        } catch (err) {
            console.log('Error fetching notification count:', err);
        }
    }, []);

    // Fetch notification count on mount and set interval
    useEffect(() => {
        // Only fetch on first mount, not on every dependency change
        if (!initialFetchDone.current) {
            initialFetchDone.current = true;
            // Schedule the first fetch asynchronously to avoid cascading renders
            Promise.resolve().then(() => fetchNotificationCount());
        }
        
        // Refresh notification count every 10 seconds
        const interval = setInterval(fetchNotificationCount, 10000);
        return () => clearInterval(interval);
    }, [fetchNotificationCount]);

    const handleNotificationClick = () => {
        setNotificationCount(0);
        setShowNewNotificationAnimation(false);
        navigate('/manager/announcement');
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    return (
        <div>
            <AppBar elevation = {0} sx={{width : sidebarOpen ? "calc(100% - 300px)" : "calc(100% - 80px)", left: sidebarOpen ? "300px" : "80px", padding : "15px", background : "rgb(8, 15, 37)" }}>
                <Box sx={{ display : "flex", flexDirection : "row", justifyContent : "space-between", alignItems : "center"}}>
                    <Box >
                        <IconButton onClick={handleSidebarOpen}>
                            <MenuIcon sx={{color : "white"}} />
                        </IconButton>
                    </Box>
                    <Box sx={{display : "flex", alignItems : "center", gap : "15px"}}>
                        {/* Notification Bell */}
                        <Box 
                            sx={{ 
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
                            }}
                            onClick={handleNotificationClick}
                            title={notificationCount > 0 ? `You have ${notificationCount} new notification(s)` : 'No new notifications'}
                        >
                            <svg 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                style={{
                                    color: notificationCount > 0 ? '#3b82f6' : 'white',
                                    animation: showNewNotificationAnimation ? 'bellShake 0.5s ease-in-out' : notificationCount > 0 ? 'bellPulse 2s ease-in-out infinite' : 'none',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            {notificationCount > 0 && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '22px',
                                        height: '22px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        border: '2px solid white',
                                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                                        animation: showNewNotificationAnimation ? 'badgeBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'badgeBounce 2s ease-in-out infinite'
                                    }}
                                >
                                    {notificationCount}
                                </Box>
                            )}
                        </Box>
                        <IconButton onClick={() => navigate('/manager/profile')}>
                            <Avatar sx={{ backgroundColor : "orangered", width : "32px", height : "32px", cursor : "pointer" }}>M</Avatar>
                        </IconButton>
                        <Box>
                            <IconButton onClick={handleLogout}>
                                <LogoutIcon sx={{color : "white"}} />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </AppBar>
            <style>{`
                @keyframes bellPulse {
                    0% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                
                @keyframes bellShake {
                    0% {
                        transform: rotate(0deg) translateY(0);
                    }
                    10% {
                        transform: rotate(-25deg) translateY(-3px);
                    }
                    20% {
                        transform: rotate(20deg) translateY(-2px);
                    }
                    30% {
                        transform: rotate(-20deg) translateY(-3px);
                    }
                    40% {
                        transform: rotate(15deg) translateY(-2px);
                    }
                    50% {
                        transform: rotate(-10deg) translateY(-3px);
                    }
                    60% {
                        transform: rotate(10deg) translateY(-2px);
                    }
                    70% {
                        transform: rotate(-5deg) translateY(-2px);
                    }
                    80% {
                        transform: rotate(3deg) translateY(-1px);
                    }
                    90%, 100% {
                        transform: rotate(0deg) translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

export default Navbar
