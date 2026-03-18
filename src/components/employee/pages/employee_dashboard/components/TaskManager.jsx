import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './TaskManager.css';
import api from '../../../../../services/service.js';
import { useAppContext } from '../../../../context/AppContext.jsx';

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const years = ["2026", "2027", "2028", "2029", "2030"];

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const { userData } = useAppContext();

    const [filterMonth, setFilterMonth] = useState(months[new Date().getMonth()]);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

    // State for new task form (even if UI is currently hidden/commented)
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'In Progress',
        startDate: '',
        endDate: ''
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        console.log("Submit triggered", newTask);
        setNewTask({
            title: '',
            description: '',
            status: 'In Progress',
            startDate: '',
            endDate: ''
        });
    }, [newTask]);

    useEffect(() => {
        if (!userData?.id) return;

        const fetchTasks = async () => {
            try {
                const res = await api.get('task/tasks/');
                setTasks(
                    res.data.map(task => ({
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        status: task.status === 'PENDING' ? 'Pending' :
                            task.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed',
                        startDate: task.start_date,
                        endDate: task.end_date
                    }))
                );
            } catch (err) {
                console.error("Error fetching tasks:", err);
            }
        };

        fetchTasks();
    }, [userData]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (!task.startDate) return true;
            const taskDate = new Date(task.startDate);
            const taskMonth = months[taskDate.getMonth()];
            const taskYear = taskDate.getFullYear().toString();

            return taskMonth === filterMonth && taskYear === filterYear;
        });
    }, [tasks, filterMonth, filterYear]);

    return (
        <div className="dashboard-view task-manager-view">
            <div className="task-list-scroll">
                <div className="task-list-header">
                    <h3 className="h3-uppercase">My Tasks</h3>
                    <div className="task-filters">
                        <select
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="compact-input-1"
                        >
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="compact-input-2"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                <div className="task-list-container">
                    {filteredTasks.map(task => {
                        const statusClass = task.status === 'Completed' ? 'status-completed' : 
                                          (task.status === 'Pending' ? 'status-pending' : 'status-inprogress');
                        return (
                            <div key={task.id} className={`card task-item no-hover ${statusClass}`}>
                                <div className="task-header">
                                    <h4 className="task-title">{task.title}</h4>
                                    <span className={`task-badge ${statusClass}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <p className="task-desc">{task.description}</p>
                                <div className="task-meta">
                                    <span>📅 {task.startDate}</span>
                                    <span>🏁 {task.endDate || 'Ongoing'}</span>
                                </div>
                            </div>
                        );
                    })}
                    {filteredTasks.length === 0 && (
                        <div className="card empty-card">
                            No tasks found for this period.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(TaskManager);
