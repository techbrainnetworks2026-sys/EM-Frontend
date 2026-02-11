/**
 * Notification Service for Push Notifications
 * Handles registration, subscription, and management of push notifications
 */

import api from './service.js';

class NotificationService {
    constructor() {
        this.serviceWorkerRegistration = null;
        this.pushSubscription = null;
        this.vapidPublicKey = null;
    }

    /**
     * Initialize the notification service
     * Must be called after user login
     */
    async init() {
        try {
            // Check if browser supports service workers and push notifications
            if (!('serviceWorker' in navigator)) {
                console.warn('Service Workers not supported');
                return false;
            }

            if (!('PushManager' in window)) {
                console.warn('Push Notifications not supported');
                return false;
            }

            // Register the service worker
            await this.registerServiceWorker();

            // Get VAPID public key from backend
            await this.getVAPIDPublicKey();

            console.log('Notification service initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize notification service:', error);
            return false;
        }
    }

    /**
     * Register the service worker
     */
    async registerServiceWorker() {
        try {
            this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
            });

            console.log('Service Worker registered:', this.serviceWorkerRegistration);

            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage);

            return this.serviceWorkerRegistration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            throw error;
        }
    }

    /**
     * Get VAPID public key from backend
     */
    async getVAPIDPublicKey() {
        try {
            const response = await api.get('/notifications/vapid-key/');
            this.vapidPublicKey = response.data.vapid_public_key;
            console.log('VAPID public key fetched');
            return this.vapidPublicKey;
        } catch (error) {
            console.error('Failed to fetch VAPID public key:', error);
            throw error;
        }
    }

    /**
     * Request notification permission from user
     * Returns: 'granted', 'denied', or 'default'
     */
    async requestPermission() {
        try {
            // Check if already granted
            if (Notification.permission === 'granted') {
                console.log('Notification permission already granted');
                return 'granted';
            }

            // Request permission
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                console.log('Notification permission granted');
                // Subscribe to push notifications
                await this.subscribe();
            } else if (permission === 'denied') {
                console.warn('Notification permission denied');
            }

            return permission;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            throw error;
        }
    }

    /**
     * Subscribe to push notifications
     */
    async subscribe() {
        try {
            if (!this.serviceWorkerRegistration) {
                throw new Error('Service Worker not registered');
            }

            if (!this.vapidPublicKey) {
                throw new Error('VAPID public key not available');
            }

            // Convert VAPID public key to Uint8Array
            const vapidUint8Array = this.urlBase64ToUint8Array(this.vapidPublicKey);

            // Subscribe to push manager
            const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidUint8Array,
            });

            console.log('Push subscription successful:', subscription);

            // Send subscription to backend
            await this.sendSubscriptionToBackend(subscription);

            this.pushSubscription = subscription;
            return subscription;
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            throw error;
        }
    }

    /**
     * Unsubscribe from push notifications
     */
    async unsubscribe() {
        try {
            if (!this.serviceWorkerRegistration) {
                console.warn('Service Worker not registered');
                return false;
            }

            // Get current subscription
            const subscription = await this.serviceWorkerRegistration.pushManager.getSubscription();

            if (!subscription) {
                console.warn('No active push subscription');
                return false;
            }

            // Notify backend
            await this.notifyBackendUnsubscribe(subscription);

            // Unsubscribe from push manager
            const result = await subscription.unsubscribe();

            if (result) {
                console.log('Push subscription terminated');
                this.pushSubscription = null;
            }

            return result;
        } catch (error) {
            console.error('Failed to unsubscribe from push notifications:', error);
            throw error;
        }
    }

    /**
     * Check if user is subscribed to push notifications
     */
    async isSubscribed() {
        try {
            if (!this.serviceWorkerRegistration) {
                return false;
            }

            const subscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
            return !!subscription;
        } catch (error) {
            console.error('Error checking subscription status:', error);
            return false;
        }
    }

    /**
     * Send subscription to backend
     */
    async sendSubscriptionToBackend(subscription) {
        try {
            // Extract required fields from subscription
            const subscriptionData = {
                endpoint: subscription.endpoint,
                p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')),
                auth: this.arrayBufferToBase64(subscription.getKey('auth')),
                user_agent: navigator.userAgent,
            };

            // Send to backend
            const response = await api.post('/notifications/subscribe/', subscriptionData);

            console.log('Subscription sent to backend:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to send subscription to backend:', error);
            throw error;
        }
    }

    /**
     * Notify backend of unsubscription
     */
    async notifyBackendUnsubscribe(subscription) {
        try {
            const response = await api.post('/notifications/unsubscribe/', {
                endpoint: subscription.endpoint,
            });

            console.log('Unsubscription notified to backend:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to notify backend of unsubscription:', error);
            // Don't throw - unsubscription is in progress anyway
        }
    }

    /**
     * Convert VAPID public key from base64 to Uint8Array
     */
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    }

    /**
     * Convert ArrayBuffer to base64 string
     */
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';

        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return btoa(binary);
    }

    /**
     * Handle messages from service worker
     */
    handleServiceWorkerMessage = (event) => {
        console.log('Message from service worker:', event.data);
    };

    /**
     * Test push notification (development only)
     */
    async sendTestNotification() {
        try {
            const response = await api.post('/notifications/test/');
            console.log('Test notification sent:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to send test notification:', error);
            throw error;
        }
    }
}

// Export singleton instance
export default new NotificationService();
