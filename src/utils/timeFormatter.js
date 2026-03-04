/**
 * Formats a time string (HH:MM:SS or HH:MM) into "HH:MM AM/PM" format.
 * @param {string} timeStr - The time string to format.
 * @returns {string} - The formatted time string or "--" if input is invalid.
 */
export const formatTime = (timeStr) => {
    if (!timeStr || timeStr === "-") return "--";

    // Handle cases where time might be already formatted or in a different format
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr;

    const hour = parseInt(parts[0], 10);
    const minute = parts[1];

    if (isNaN(hour)) return timeStr;

    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${displayHour.toString().padStart(2, "0")}:${minute} ${period}`;
};
