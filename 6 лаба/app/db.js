const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'sports.db');

// Удаляем существующую БД если она есть
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath);

function initDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            try {
                // Создание таблицы locations
                db.run(`
                    CREATE TABLE IF NOT EXISTS locations (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL UNIQUE
                    )
                `);

                // Создание таблицы sports_events
                db.run(`
                    CREATE TABLE IF NOT EXISTS sports_events (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        date_time TEXT NOT NULL,
                        sport_type TEXT NOT NULL,
                        coach TEXT NOT NULL,
                        category TEXT NOT NULL CHECK(category IN ('Командные', 'Индивидуальные', 'Групповые')),
                        participants_count INTEGER NOT NULL CHECK(participants_count > 0),
                        location_id INTEGER,
                        FOREIGN KEY (location_id) REFERENCES locations(id)
                    )
                `);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
}

module.exports = { db, initDatabase }; 