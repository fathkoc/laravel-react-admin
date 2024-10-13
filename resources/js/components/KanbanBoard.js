// src/components/KanbanBoard.js
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const KanbanBoard = ({ tasks, onDelete }) => {
    const columns = {
        'Yapılacak': tasks.filter(task => task.status === 'pending'),
        'Devam Ediyor': tasks.filter(task => task.status === 'in_progress'),
        'Tamamlandı': tasks.filter(task => task.status === 'completed'),
    };

    const onDragEnd = (result) => {
        // Burada görevin durumunu güncelleyin
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
