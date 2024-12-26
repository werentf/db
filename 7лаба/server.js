const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./db');
const { insertData } = require('./data');
const { Event, Location } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Инициализация базы данных и вставка данных
async function initialize() {
    try {
        await connectDB();
        await insertData();
        console.log('База данных инициализирована и заполнена данными');
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
        process.exit(1);
    }
}

initialize();

// Получение всех событий
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find()
            .populate('location', 'name')
            .lean();

        const formattedEvents = events.map(event => ({
            ...event,
            location_name: event.location.name
        }));

        res.json(formattedEvents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Фильтрация событий
app.get('/api/events/filter', async (req, res) => {
    try {
        const { category, minParticipants, date, sport_type } = req.query;
        const query = {};

        if (category) {
            query.category = category;
        }

        if (minParticipants) {
            query.participants_count = { $gte: parseInt(minParticipants) };
        }

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date_time = { $gte: startDate, $lt: endDate };
        }

        if (sport_type) {
            query.sport_type = sport_type;
        }

        const events = await Event.find(query)
            .populate('location', 'name')
            .sort('date_time')
            .lean();

        const formattedEvents = events.map(event => ({
            ...event,
            location_name: event.location.name
        }));

        res.json(formattedEvents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение всех локаций
app.get('/api/locations', async (req, res) => {
    try {
        const locations = await Location.find().lean();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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