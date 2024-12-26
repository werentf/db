const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, initDatabase } = require('./db');
const { insertData } = require('./data');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Инициализация базы данных и вставка данных
async function initialize() {
    try {
        await initDatabase();
        await insertData();
        console.log('База данных инициализирована и заполнена данными');
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
        process.exit(1);
    }
}

initialize();

// Получение всех событий
app.get('/api/events', (req, res) => {
    const query = `
        SELECT 
            se.*,
            l.name as location_name
        FROM sports_events se
        JOIN locations l ON se.location_id = l.id
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Фильтрация событий
app.get('/api/events/filter', (req, res) => {
    const { category, minParticipants, date, sport_type } = req.query;
    let query = `
        SELECT 
            se.*,
            l.name as location_name
        FROM sports_events se
        JOIN locations l ON se.location_id = l.id
        WHERE 1=1
    `;
    const params = [];

    if (category) {
        query += ` AND se.category = ?`;
        params.push(category);
    }

    if (minParticipants) {
        query += ` AND se.participants_count >= ?`;
        params.push(parseInt(minParticipants));
    }

    if (date) {
        query += ` AND date(se.date_time) = date(?)`;
        params.push(date);
    }

    if (sport_type) {
        query += ` AND se.sport_type = ?`;
        params.push(sport_type);
    }

    query += ` ORDER BY se.date_time`;

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Корневой маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Получение всех локаций
app.get('/api/locations', (req, res) => {
    const query = 'SELECT * FROM locations';
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Обработка ошибок
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});