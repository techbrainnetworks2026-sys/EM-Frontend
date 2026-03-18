import React, { useState, useEffect } from 'react';

const AttendanceTimer = ({ checkInTime, isCheckedIn, getWorkedHours }) => {
    const [elapsedTime, setElapsedTime] = useState(null);

    useEffect(() => {
        if (isCheckedIn && checkInTime) {
            const calcElapsed = () => {
                const now = new Date();
                const [h, m, s] = checkInTime.split(':').map(Number);
                const checkIn = new Date();
                checkIn.setHours(h, m, s, 0);
                const diffMs = now - checkIn;
                if (diffMs < 0) return;
                const totalSec = Math.floor(diffMs / 1000);
                const hrs = Math.floor(totalSec / 3600);
                const mins = Math.floor((totalSec % 3600) / 60);
                const secs = totalSec % 60;
                setElapsedTime(`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
            };
            calcElapsed();
            const interval = setInterval(calcElapsed, 1000);
            return () => clearInterval(interval);
        }
    }, [isCheckedIn, checkInTime]);

    return (
        <div className="stat-value">
            {isCheckedIn ? elapsedTime : getWorkedHours()}
        </div>
    );
};

export default React.memo(AttendanceTimer);
