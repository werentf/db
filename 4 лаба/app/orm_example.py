import os
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

# Путь к файлу базы данных
db_file = 'sports.db'

# Удаление существующей базы данных, если она есть
if os.path.exists(db_file):
    os.remove(db_file)
    print(f"Существующая база данных '{db_file}' удалена.")

# Создание базы данных
engine = create_engine(f'sqlite:///{db_file}')
Base = declarative_base()

# Определение модели для таблицы sports_events
class SportsEvent(Base):
    __tablename__ = 'sports_events'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    date_time = Column(Text)
    sport_type = Column(String)
    coach = Column(String)
    category = Column(String)
    participants_count = Column(Integer)
    location_id = Column(Integer, ForeignKey('locations.id'))
    location = relationship("Location", back_populates="events")

# Определение модели для таблицы locations
class Location(Base):
    __tablename__ = 'locations'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    events = relationship("SportsEvent", back_populates="location")

# Создание таблиц
Base.metadata.create_all(engine)

# Создание сессии
Session = sessionmaker(bind=engine)
session = Session()

# Данные для вставки
locations = [
    Location(name="Стадион Лужники"),
    Location(name="Баскетбольный зал Олимпийский"),
    Location(name="Теннисный корт Центральный"),
    Location(name="Плавательный бассейн Аквапарк"),
    Location(name="Легкоатлетический манеж"),
    Location(name="Шахматный клуб"),
    Location(name="Гимнастический зал"),
    Location(name="Боксерский ринг"),
    Location(name="Фехтовальный зал"),
    Location(name="Йога-студия"),
    Location(name="Скалодром"),
    Location(name="Сноуборд-парк"),
]

events = [
    SportsEvent(date_time="2024-03-01 09:00", sport_type="Футбол", coach="Иванов И.И.", category="Командные", participants_count=22, location=locations[0]),
    SportsEvent(date_time="2024-03-01 10:00", sport_type="Баскетбол", coach="Петрова А.В.", category="Командные", participants_count=10, location=locations[1]),
    SportsEvent(date_time="2024-03-01 11:00", sport_type="Теннис", coach="Сидоров О.П.", category="Индивидуальные", participants_count=2, location=locations[2]),
    SportsEvent(date_time="2024-03-01 13:00", sport_type="Плавание", coach="Кузнецова Е.В.", category="Индивидуальные", participants_count=8, location=locations[3]),
    SportsEvent(date_time="2024-03-02 09:00", sport_type="Волейбол", coach="Морозов Д.С.", category="Командные", participants_count=12, location=locations[0]),
    SportsEvent(date_time="2024-03-02 10:00", sport_type="Бег", coach="Волкова Т.Н.", category="Индивидуальные", participants_count=15, location=locations[4]),
    SportsEvent(date_time="2024-03-02 12:00", sport_type="Хоккей", coach="Соколов А.М.", category="Командные", participants_count=12, location=locations[0]),
    SportsEvent(date_time="2024-03-03 09:00", sport_type="Шахматы", coach="Козлов П.Р.", category="Индивидуальные", participants_count=2, location=locations[5]),
    SportsEvent(date_time="2024-03-03 11:00", sport_type="Бадминтон", coach="Лебедева И.М.", category="Индивидуальные", participants_count=4, location=locations[2]),
    SportsEvent(date_time="2024-03-03 13:00", sport_type="Регби", coach="Павлова С.А.", category="Командные", participants_count=30, location=locations[0]),
    SportsEvent(date_time="2024-03-04 10:00", sport_type="Гимнастика", coach="Егорова В.Д.", category="Индивидуальные", participants_count=5, location=locations[6]),
    SportsEvent(date_time="2024-03-04 11:00", sport_type="Бокс", coach="Андреев К.П.", category="Индивидуальные", participants_count=2, location=locations[7]),
    SportsEvent(date_time="2024-03-04 13:00", sport_type="Фехтование", coach="Зайцева М.В.", category="Индивидуальные", participants_count=2, location=locations[8]),
    SportsEvent(date_time="2024-03-05 09:00", sport_type="Легкая атлетика", coach="Титова Ю.С.", category="Индивидуальные", participants_count=20, location=locations[4]),
    SportsEvent(date_time="2024-03-05 10:00", sport_type="Гандбол", coach="Семенов Г.А.", category="Командные", participants_count=14, location=locations[0]),
    SportsEvent(date_time="2024-03-05 12:00", sport_type="Каратэ", coach="Орлова Н.Н.", category="Индивидуальные", participants_count=2, location=locations[7]),
    SportsEvent(date_time="2024-03-06 09:00", sport_type="Йога", coach="Антонова Е.В.", category="Индивидуальные", participants_count=10, location=locations[9]),
    SportsEvent(date_time="2024-03-06 11:00", sport_type="Пауэрлифтинг", coach="Филиппов Д.С.", category="Индивидуальные", participants_count=6, location=locations[6]),
    SportsEvent(date_time="2024-03-06 13:00", sport_type="Скалолазание", coach="Максимова О.Ю.", category="Индивидуальные", participants_count=8, location=locations[10]),
    SportsEvent(date_time="2024-03-07 10:00", sport_type="Сноубординг", coach="Комаров А.И.", category="Индивидуальные", participants_count=5, location=locations[11]),
]

# Вставка данных в таблицы
session.add_all(locations)
session.add_all(events)
session.commit()

# Запрос 1: Вывод всех данных
print("Все данные:")
for event in session.query(SportsEvent).all():
    print(f"ID: {event.id}, Дата и время: {event.date_time}, Вид спорта: {event.sport_type}, "
          f"Тренер: {event.coach}, Категория: {event.category}, "
          f"Количество участников: {event.participants_count}, Местоположение: {event.location.name}")

# Запрос 2: Вывод всех командных видов спорта
print("\nКомандные виды спорта:")
for event in session.query(SportsEvent).filter(SportsEvent.category == "Командные").all():
    print(f"ID: {event.id}, Дата и время: {event.date_time}, Вид спорта: {event.sport_type}, "
          f"Тренер: {event.coach}, Количество участников: {event.participants_count}, "
          f"Местоположение: {event.location.name}")

# Запрос 3: Вывод всех событий с количеством участников больше 10
print("\nСобытия с количеством участников больше 10:")
for event in session.query(SportsEvent).filter(SportsEvent.participants_count > 10).all():
    print(f"ID: {event.id}, Дата и время: {event.date_time}, Вид спорта: {event.sport_type}, "
          f"Тренер: {event.coach}, Категория: {event.category}, "
          f"Количество участников: {event.participants_count}, Местоположение: {event.location.name}")

# Закрытие сессии
session.close() 