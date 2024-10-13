import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm'; 
import KanbanBoard from './KanbanBoard'; 

const TaskDashboard = () => {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        const response = await axios.get('/api/tasks'); 
        setTasks(response.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const deleteTask = async (id) => {
        await axios.delete(`/api/tasks/${id}`);
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div>
            <h1>Görev Yönetimi</h1>
            <TaskForm refreshTasks={fetchTasks} />
            <KanbanBoard tasks={tasks} onDelete={deleteTask} refreshTasks={fetchTasks} />
        </div>
    );
};

export default TaskDashboard;
