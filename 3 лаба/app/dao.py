import sqlite3

class SportsEventDao:
    def __init__(self, db_file):
        self.conn = sqlite3.connect(db_file)
        self.cursor = self.conn.cursor()
        self.create_tables()

    def create_tables(self):
        # Удаление существующей таблицы sports_events, если она есть
        self.cursor.execute('DROP TABLE IF EXISTS sports_events')
        
        # Создание таблицы sports_events с правильной структурой
        self.cursor.execute('''
            CREATE TABLE sports_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date_time TEXT,
                sport_type TEXT,
                coach TEXT,
                category TEXT,
                participants_count INTEGER
            )
        ''')
        
        # Удаление существующей таблицы event_locations, если она есть
        self.cursor.execute('DROP TABLE IF EXISTS event_locations')
        
        # Создание таблицы event_locations
        self.cursor.execute('''
            CREATE TABLE event_locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER,
                location TEXT,
                FOREIGN KEY (event_id) REFERENCES sports_events(id)
            )
        ''')
        self.conn.commit()

    def insert_event(self, event):
        self.cursor.execute('''
            INSERT INTO sports_events (date_time, sport_type, coach, category, participants_count)
            VALUES (?, ?, ?, ?, ?)
        ''', event)
        self.conn.commit()

    def insert_event_location(self, event_id, location):
        self.cursor.execute('''
            INSERT INTO event_locations (event_id, location)
            VALUES (?, ?)
        ''', (event_id, location))
        self.conn.commit()

    def get_all_events(self):
        self.cursor.execute('SELECT * FROM sports_events')
        return self.cursor.fetchall()

    def get_event_locations(self):
        try:
            # Выполнение запроса для получения событий и их местоположений
            self.cursor.execute('''
                SELECT se.id, se.sport_type, el.location
                FROM sports_events se
                LEFT JOIN event_locations el ON se.id = el.event_id
            ''')
            results = self.cursor.fetchall()
            if not results:
                print("Нет данных для отображения.")
            return results
        except sqlite3.Error as e:
            print(f"Ошибка при выполнении запроса: {e}")
            return []

    def get_team_sports(self):
        # Параметризованный запрос не требуется, так как нет пользовательского ввода
        self.cursor.execute('SELECT * FROM sports_events WHERE category = "Командные"')
        return self.cursor.fetchall()

    def get_events_with_more_than_10_participants(self):
        # Параметризованный запрос не требуется, так как нет пользовательского ввода
        self.cursor.execute('SELECT * FROM sports_events WHERE participants_count > 10')
        return self.cursor.fetchall()

    def close(self):
        self.conn.close() 