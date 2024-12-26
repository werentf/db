import sqlite3

def clear_database(db_file):
    # Подключение к базе данных
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    # Удаление всех записей из таблицы
    cursor.execute('DELETE FROM sports_events')

    # Сохранение изменений
    conn.commit()

    # Закрытие соединения
    conn.close()
    print("База данных очищена.")

if __name__ == "__main__":
    clear_database('sports.db') 