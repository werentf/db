const { db } = require('./db');

const locations = [
    "Стадион Лужники",
    "Баскетбольный зал Олимпийский",
    "Теннисный корт Центральный",
    "Плавательный бассейн Аквапарк",
    "Легкоатлетический манеж",
    "Шахматный клуб",
    "Гимнастический зал",
    "Боксерский ринг",
    "Фехтовальный зал",
    "Йога-студия",
    "Скалодром",
    "Сноуборд-парк"
];

const events = [
    ["2024-03-01 09:00", "Футбол", "Иванов И.И.", "Командные", 22, 1],
    ["2024-03-01 10:00", "Баскетбол", "Петрова А.В.", "Командные", 10, 2],
    ["2024-03-01 11:00", "Теннис", "Сидоров О.П.", "Индивидуальные", 2, 3],
    ["2024-03-01 12:00", "Плавание", "Морозова Е.С.", "Индивидуальные", 1, 4],
    ["2024-03-01 14:00", "Бег", "Козлов Д.Н.", "Индивидуальные", 1, 5],
    ["2024-03-01 15:00", "Шахматы", "Белов Г.М.", "Индивидуальные", 2, 6],
    ["2024-03-01 16:00", "Гимнастика", "Соколова И.А.", "Индивидуальные", 1, 7],
    ["2024-03-01 17:00", "Бокс", "Волков С.П.", "Индивидуальные", 2, 8],
    ["2024-03-02 10:00", "Фехтование", "Попов А.С.", "Индивидуальные", 2, 9],
    ["2024-03-02 11:00", "Йога", "Новикова О.В.", "Групповые", 15, 10],
    ["2024-03-02 12:00", "Скалолазание", "Орлов М.И.", "Индивидуальные", 1, 11],
    ["2024-03-02 14:00", "Сноуборд", "Лебедев К.А.", "Групповые", 8, 12]
];

function insertData() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            try {
                // Начинаем транзакцию
                db.run('BEGIN TRANSACTION');

                // Вставка локаций
                const locationStmt = db.prepare('INSERT OR IGNORE INTO locations (name) VALUES (?)');
                locations.forEach(location => {
                    locationStmt.run(location);
                });
                locationStmt.finalize();

                // Вставка событий
                const eventStmt = db.prepare(`
                    INSERT INTO sports_events 
                    (date_time, sport_type, coach, category, participants_count, location_id)
                    VALUES (?, ?, ?, ?, ?, ?)
                `);
                events.forEach(event => {
                    eventStmt.run(...event);
                });
                eventStmt.finalize();

                // Завершаем транзакцию
                db.run('COMMIT', (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            } catch (error) {
                db.run('ROLLBACK');
                reject(error);
            }
        });
    });
}

module.exports = { insertData }; 