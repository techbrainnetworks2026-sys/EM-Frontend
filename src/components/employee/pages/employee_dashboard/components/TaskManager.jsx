import React, { useState } from 'react';
import './TaskManager.css';
import { useEffect } from 'react';
import api from '../../../../../services/service.js';
import { useAppContext } from '../../../../context/AppContext.jsx';

const TaskManager = () => {

    const [tasks, setTasks] = useState([]);
    const { userData } = useAppContext();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const years = ["2026", "2027", "2028", "2029", "2030"];

    const [filterMonth, setFilterMonth] = useState(months[new Date().getMonth()]);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'In Progress',
        startDate: '',
        endDate: ''
    });

    const handleChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onAddTask) {
            onAddTask(newTask);
            setNewTask({
                title: '',
                description: '',
                status: 'In Progress',
                startDate: '',
                endDate: ''
            });
        }
    };

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
                        status: task.status === "PENDING" ? "Pending" : "Completed",
                        startDate: task.start_date,
                        endDate: task.end_date
                    }))
                );
            } catch (err) {
                console.log(err);
            }
        };

        fetchTasks();

    }, [userData]);

    return (
        <div className="dashboard-view task-manager-view">
            {/* Add Task Form - Standardized Alignment
            <div className="card no-hover add-task-card">
                <h3 className="h3-uppercase">Add New Task</h3>
                <form onSubmit={handleSubmit} className="add-task-form">
                    {/* Row 1: Task Title & Work Description *
                    <div className="form-row row-1">
                        <div className="form-group">
                            <label className="label-compact">Task Title</label>
                            <input
                                type="text"
                                name="title"
                                value={newTask.title}
                                onChange={handleChange}
                                placeholder="Enter task title"
                                required
                                className="input-full"

                            />
                        </div>
                        <div className="form-group">
                            <label className="label-compact">Work Description</label>
                            <input
                                type="text"
                                name="description"
                                value={newTask.description}
                                onChange={handleChange}
                                placeholder="what im done?"
                                required
                                className="input-full"

                            />
                        </div>
                    </div>

                    {/* Row 2: Status, Dates & Add Button *
                    <div className="form-row controls-row">
                        <div className="form-group">
                            <label className="label-compact">Status</label>
                            <select
                                name="status"
                                value={newTask.status}
                                onChange={handleChange}
                                className="compact-input"

                            >
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="label-compact">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={newTask.startDate}
                                onChange={handleChange}
                                required
                                className="compact-input"

                            />
                        </div>
                        <div className="form-group">
                            <label className="label-compact">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={newTask.endDate}
                                onChange={handleChange}
                                required
                                className="compact-input"

                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="primary-btn block">
                                Add Task
                            </button>
                        </div>
                    </div>
                </form>
            </div> */}

            {/* Task List - Independently Scrollable */}
            <div className="task-list-scroll">
                <div className="task-list-header">
                    <h3 className="h3-uppercase">My Tasks</h3>
                    <div className="task-filters">
                        <select
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="compact-input"
                        >
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="compact-input"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                <div className="task-list-container">
                    {tasks
                        .filter(task => {
                            if (!task.startDate) return true;
                            const taskDate = new Date(task.startDate);
                            const taskMonth = months[taskDate.getMonth()];
                            const taskYear = taskDate.getFullYear().toString();

                            const matchesMonth = taskMonth === filterMonth;
                            const matchesYear = taskYear === filterYear;

                            return matchesMonth && matchesYear;
                        })
                        .map(task => {
                            const statusClass = task.status === 'Completed' ? 'status-completed' : (task.status === 'Pending' ? 'status-pending' : 'status-inprogress');
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
                    {tasks.length === 0 && (
                        <div className="card empty-card">
                            No tasks found. Start by adding one above!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskManager;
