import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [trainings, setTrainings] = useState([
    { date: '20.07.2019', distance: 5.7 },
    { date: '19.07.2019', distance: 14.2 },
    { date: '18.07.2019', distance: 3.4 }
  ]);
  
  const [dateInput, setDateInput] = useState('');
  const [distanceInput, setDistanceInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const sortTrainings = (trainingsArray) => {
    return [...trainingsArray].sort((a, b) => parseDate(b.date) - parseDate(a.date));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!dateInput || !distanceInput) return;
    
    const distance = parseFloat(distanceInput);
    if (isNaN(distance) || distance <= 0) return;

    if (editingIndex !== null) {
      const updatedTrainings = [...trainings];
      updatedTrainings[editingIndex] = { date: dateInput, distance };
      setTrainings(sortTrainings(updatedTrainings));
      setEditingIndex(null);
    } else {
      const existingIndex = trainings.findIndex(t => t.date === dateInput);
      
      if (existingIndex !== -1) {
        const updatedTrainings = [...trainings];
        updatedTrainings[existingIndex] = {
          date: dateInput,
          distance: updatedTrainings[existingIndex].distance + distance
        };
        setTrainings(sortTrainings(updatedTrainings));
      } else {
        setTrainings(sortTrainings([...trainings, { date: dateInput, distance }]));
      }
    }
    
    setDateInput('');
    setDistanceInput('');
  };

  const handleDelete = (index) => {
    const updatedTrainings = trainings.filter((_, i) => i !== index);
    setTrainings(sortTrainings(updatedTrainings));
  };

  const handleEdit = (index) => {
    setDateInput(trainings[index].date);
    setDistanceInput(trainings[index].distance.toString());
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setDateInput('');
    setDistanceInput('');
    setEditingIndex(null);
  };

  return (
    <div className="app">
      <h1>Учёт тренировок</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Дата (ДД.ММ.ГГГГ)</label>
            <input
              type="text"
              id="date"
              placeholder="20.07.2019"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              pattern="\d{2}\.\d{2}\.\d{4}"
              title="Введите дату в формате ДД.ММ.ГГГГ"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="distance">Пройдено км</label>
            <input
              type="number"
              id="distance"
              placeholder="5.7"
              value={distanceInput}
              onChange={(e) => setDistanceInput(e.target.value)}
              step="0.1"
              min="0.1"
              required
            />
          </div>
          
          <button type="submit" className="btn-submit">
            {editingIndex !== null ? 'Сохранить' : 'OK'}
          </button>
          
          {editingIndex !== null && (
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="table-container">
        <div className="table-header">
          <span>Дата (ДД.ММ.ГГ)</span>
          <span>Пройдено км</span>
          <span>Действия</span>
        </div>
        
        <div className="table-body">
          {trainings.length === 0 ? (
            <div className="empty-message">Нет данных о тренировках</div>
          ) : (
            trainings.map((training, index) => (
              <div key={index} className="table-row">
                <span>{training.date}</span>
                <span>{training.distance.toFixed(1)}</span>
                <span className="actions">
                  <button 
                    className="btn-action btn-edit"
                    onClick={() => handleEdit(index)}
                    title="Редактировать"
                  >
                    ✎
                  </button>
                  <button 
                    className="btn-action btn-delete"
                    onClick={() => handleDelete(index)}
                    title="Удалить"
                  >
                    ✘
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;