// App.js
import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import './App.css';

function Module({ id, name, children, isCatalogItem = false }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data: { name, type: 'module', isFromCatalog: isCatalogItem },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: isCatalogItem ? 'grab' : 'move',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
        position: isCatalogItem ? 'static' : 'absolute',
        zIndex: isDragging ? 1000 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} {...(isCatalogItem ? listeners : {})} {...attributes}>
            {!isCatalogItem && <div style={{ pointerEvents: 'none', height: '100%', width: '100%' }} {...listeners}></div>}
            {children}
        </div>
    );
}

function Catalog() {
    return (
        <div className="catalog">
            <h3>Каталог</h3>
            <Module id="catalog-1" name="Модуль 1" isCatalogItem={true}>Модуль 1</Module>
            <Module id="catalog-2" name="Модуль 2" isCatalogItem={true}>Модуль 2</Module>
        </div>
    );
}

function MainScreen({ modules, onModuleSelect, setModules }) {
    const { setNodeRef } = useDroppable({ id: 'main-screen' });

    return (
        <div ref={setNodeRef} className="main-screen">
            {modules.map((module) => (
                <Module key={module.id} id={module.id} name={module.name} style={{ left: module.x, top: module.y }}>
                    <div>
                        <span>{module.name}</span>
                        <button onMouseDown={(e) => { e.stopPropagation(); onModuleSelect(module.id); }}>⚙️</button>
                    </div>
                </Module>
            ))}
        </div>
    );
}

function PropertiesScreen({ selectedModule }) {
    return (
        <div className="properties-screen">
            <h3>Свойства</h3>
            {selectedModule ? <p>{selectedModule.name}</p> : <p>Выберите модуль</p>}
        </div>
    );
}

function App() {
    const [modules, setModules] = useState([]);
    const [selectedModuleId, setSelectedModuleId] = useState(null);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && over.id === 'main-screen' && active.data.current.isFromCatalog) {
            const mainScreen = document.querySelector('.main-screen').getBoundingClientRect();
            const x = event.clientX - mainScreen.left + (Math.random() * 50 - 25);
            const y = event.clientY - mainScreen.top + (Math.random() * 50 - 25);

            setModules(prev => [...prev, { id: `module-${Date.now()}`, name: active.data.current.name, x, y }]);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="app-container">
                <Catalog />
                <MainScreen modules={modules} onModuleSelect={(id) => setSelectedModuleId(id)} setModules={setModules} />
                <PropertiesScreen selectedModule={modules.find(m => m.id === selectedModuleId)} />
            </div>
        </DndContext>
    );
}

export default App;