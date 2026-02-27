import React, { useMemo } from 'react';
import { Box, Paper, Typography, Grid, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';

const Analytics = ({ tasks, attendance }) => {
    const theme = useTheme();

    // 1. Task Distribution (Status)
    const taskStatusData = useMemo(() => {
        const counts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});
        return [
            { name: 'Pending', value: counts['PENDING'] || 0, color: '#ffa726' },
            { name: 'In Progress', value: counts['IN_PROGRESS'] || 0, color: '#29b6f6' },
            { name: 'Completed', value: counts['COMPLETED'] || 0, color: '#66bb6a' },
        ].filter(d => d.value > 0);
    }, [tasks]);

    // 2. Priority Breakdown
    const priorityData = useMemo(() => {
        const counts = tasks.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        }, {});
        return [
            { name: 'High', count: counts['HIGH'] || 0 },
            { name: 'Medium', count: counts['MEDIUM'] || 0 },
            { name: 'Low', count: counts['LOW'] || 0 },
        ];
    }, [tasks]);

    // 3. Attendance Trends (Last 7 Days)
    const attendanceTrends = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const count = attendance.filter(a => a.date === date && (a.status === 'PRESENT' || a.status === 'ONGOING')).length;
            return {
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                count: count
            };
        });
    }, [attendance]);

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
                {/* Task Distribution Pie Chart */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, height: 350 }}>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>Task Distribution</Typography>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={taskStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {taskStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#1e1e1e', border: 'none', borderRadius: '8px', color: 'white' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Priority Breakdown Bar Chart */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, height: 350 }}>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>Tasks by Priority</Typography>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={priorityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{ background: '#1e1e1e', border: 'none', borderRadius: '8px', color: 'white' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="count" fill="#3f51b5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Attendance Trends Line Chart */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, height: 350 }}>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>Attendance Trends</Typography>
                        <ResponsiveContainer width="100%" height="80%">
                            <LineChart data={attendanceTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip contentStyle={{ background: '#1e1e1e', border: 'none', borderRadius: '8px', color: 'white' }} />
                                <Line type="monotone" dataKey="count" stroke="#f44336" strokeWidth={2} dot={{ fill: '#f44336' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;
