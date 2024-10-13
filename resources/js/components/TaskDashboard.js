// src/components/TaskDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm'; // Görev formunu içe aktar
import KanbanBoard from './KanbanBoard'; // Kanban görünümünü içe aktar

const TaskDashboard = () => {
    const [tasks, setTasks] = useState([]);

    // Görevleri veritabanından çekme
    useEffect(() => {
        const fetchTasks = async () => {
            const response = await axios.get('/api/tasks'); // Backend API'si
            setTasks(response.data);
        };
        fetchTasks();
    }, []);

    // Görev silme işlemi
    const deleteTask = async (id) => {
        await axios.delete(`/api/tasks/${id}`);
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div>
            <h1>Görev Yönetimi</h1>
            <TaskForm refreshTasks={() => fetchTasks()} />
            <KanbanBoard tasks={tasks} onDelete={deleteTask} />
        </div>
    );
};

export default TaskDashboard;
