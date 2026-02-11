import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, FormControlLabel, Checkbox, CircularProgress, Box, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
// import notificationService from '../../services/notificationService.js';
import notificationService from "./../services/notificationService";

/**
 * NotificationPermissionDialog
 * 
 * Requests user permission for browser push notifications.
 * Shows only once after user login.
 * Allows user to enable/disable notifications later.
 */
const NotificationPermissionDialog = ({ open = false, onClose = () => {}, onPermissionGranted = () => {} }) => {
    const [loading, setLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState('');
    const [dontShowAgain, setDontShowAgain] = useState(false);

    /**
     * Check if user is already subscribed
     */
    useEffect(() => {
        checkSubscriptionStatus();
    }, []);

    const checkSubscriptionStatus = async () => {
        try {
            const subscribed = await notificationService.isSubscribed();
            setIsSubscribed(subscribed);
        } catch (error) {
            console.error('Error checking subscription status:', error);
        }
    };

    /**
     * Handle enable notifications
     */
    const handleEnableNotifications = async () => {
        setLoading(true);
        setError('');

        try {
            // Initialize notification service
            const initialized = await notificationService.init();

            if (!initialized) {
                setError('Browser does not support push notifications');
                setLoading(false);
                return;
            }

            // Request permission
            const permission = await notificationService.requestPermission();

            if (permission === 'granted') {
                setIsSubscribed(true);
                onPermissionGranted();

                // Save preference to localStorage
                localStorage.setItem('notifications_enabled', 'true');

                // Close dialog after a short delay
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else if (permission === 'denied') {
                setError('You have denied notification permissions. Please enable them in your browser settings.');
            }
        } catch (error) {
            console.error('Error enabling notifications:', error);
            setError(error.message || 'Failed to enable notifications');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle disable notifications
     */
    const handleDisableNotifications = async () => {
        setLoading(true);
        setError('');

        try {
            await notificationService.unsubscribe();
            setIsSubscribed(false);

            // Save preference to localStorage
            localStorage.setItem('notifications_enabled', 'false');
        } catch (error) {
            console.error('Error disabling notifications:', error);
            setError(error.message || 'Failed to disable notifications');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle dialog close
     */
    const handleDialogClose = () => {
        if (dontShowAgain) {
            localStorage.setItem('notifications_prompt_shown', 'true');
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: '#1e1e1e',
                    color: 'white',
                    borderRadius: '12px',
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 600,
                    fontSize: '18px',
                }}
            >
                {isSubscribed ? <NotificationsActiveIcon /> : <NotificationsIcon />}
                {isSubscribed ? 'Notifications Enabled' : 'Enable Notifications'}
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Info message */}
                    <Typography sx={{ color: '#aaa', lineHeight: 1.6 }}>
                        {isSubscribed
                            ? 'You are subscribed to important notifications including:'
                            : 'Get instant notifications for important updates including:'}
                    </Typography>

                    {/* Benefits list */}
                    <ul style={{ color: '#ccc', paddingLeft: '20px', margin: '10px 0' }}>
                        <li>Employee account approval status</li>
                        <li>Leave request decisions (approved/rejected)</li>
                        <li>Task assignments</li>
                        <li>Company announcements</li>
                    </ul>

                    {/* Warning about permissions */}
                    <Alert
                        severity="info"
                        sx={{
                            background: '#0d47a1',
                            color: 'white',
                            '& .MuiAlert-icon': {
                                color: 'white',
                            },
                        }}
                    >
                        Notifications work even when the app is closed or minimized.
                    </Alert>

                    {/* Error message */}
                    {error && (
                        <Alert severity="error" sx={{ color: 'white' }}>
                            {error}
                        </Alert>
                    )}

                    {/* Checkbox */}
                    {!isSubscribed && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={dontShowAgain}
                                    onChange={(e) => setDontShowAgain(e.target.checked)}
                                    sx={{
                                        color: '#5c6bc0',
                                        '&.Mui-checked': {
                                            color: '#5c6bc0',
                                        },
                                    }}
                                />
                            }
                            label="Don't show this again"
                            sx={{ color: '#aaa' }}
                        />
                    )}
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: '16px 24px',
                    gap: 1,
                }}
            >
                <Button
                    onClick={handleDialogClose}
                    sx={{
                        color: '#aaa',
                        textTransform: 'none',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                        },
                    }}
                    disabled={loading}
                >
                    {isSubscribed ? 'Close' : 'Later'}
                </Button>

                {loading ? (
                    <CircularProgress size={24} sx={{ color: '#5c6bc0' }} />
                ) : isSubscribed ? (
                    <Button
                        variant="contained"
                        onClick={handleDisableNotifications}
                        sx={{
                            background: '#e53935',
                            color: 'white',
                            textTransform: 'none',
                            '&:hover': {
                                background: '#c62828',
                            },
                        }}
                    >
                        Disable Notifications
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleEnableNotifications}
                        sx={{
                            background: '#0d47a1',
                            color: 'white',
                            textTransform: 'none',
                            '&:hover': {
                                background: '#0d47a1',
                            },
                        }}
                    >
                        Enable Notifications
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default NotificationPermissionDialog;
