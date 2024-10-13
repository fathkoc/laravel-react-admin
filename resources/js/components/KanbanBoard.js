import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

const KanbanBoard = ({ tasks, onDelete, refreshTasks }) => {
    const columns = {
        'Yapılacak': tasks.filter(task => task.status === 'pending'),
        'Devam Ediyor': tasks.filter(task => task.status === 'in_progress'),
        'Tamamlandı': tasks.filter(task => task.status === 'completed'),
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { draggableId, destination } = result;
        const updatedTask = tasks.find(task => task.id.toString() === draggableId);
        if (updatedTask) {
            const statusMap = {
                'Yapılacak': 'pending',
                'Devam Ediyor': 'in_progress',
                'Tamamlandı': 'completed',
            };
            const newStatus = statusMap[destination.droppableId];

            await axios.put(`/api/tasks/${updatedTask.id}`, { ...updatedTask, status: newStatus });
            refreshTasks();
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'flex' }}>
                {Object.entries(columns).map(([columnName, columnTasks]) => (
                    <Droppable key={columnName} droppableId={columnName}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{ margin: '0 16px', border: '1px solid #ccc', padding: '8px' }}
                            >
                                <h2>{columnName}</h2>
                                {columnTasks.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{ margin: '8px 0', padding: '16px', backgroundColor: '#f4f4f4' }}
                                            >
                                                {task.title}
                                                <button onClick={() => onDelete(task.id)}>Sil</button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
