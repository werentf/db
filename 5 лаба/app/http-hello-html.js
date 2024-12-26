const http = require("http");
const sqlite3 = require('sqlite3').verbose();

// Подключение к базе данных


const server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    
    // Начало HTML
    response.write(`<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Данные из БД</title>
    <style>
        table { 
            border-collapse: collapse; 
            width: 100%; 
        }
        th, td { 
            border: 1px solid black; 
            padding: 8px; 
            text-align: left; 
        }
        th { 
            background-color: #f2f2f2; 
        }
    </style>
</head>
<body>
    <h1>Данные о спортивных событиях</h1>
    <table>
        <tr>
            <th>ID</th>
            <th>Дата и время</th>
            <th>Вид спорта</th>
            <th>Тренер</th>
            <th>Категория</th>
            <th>Количество участников</th>
            <th>Местоположение</th>
        </tr>
        <tr>
            <td>1</td>
            <td>2024-03-01 09:00</td>
            <td>Футбол</td>
            <td>Иванов И.И.</td>
            <td>Командные</td>
            <td>22</td>
            <td>Стадион Лужники</td>
        </tr>
        <tr>
            <td>2</td>
            <td>2024-03-01 10:00</td>
            <td>Баскетбол</td>
            <td>Петрова А.В.</td>
            <td>Командные</td>
            <td>10</td>
            <td>Баскетбольный зал Олимпийский</td>
        </tr>
        <tr>
            <td>3</td>
            <td>2024-03-01 11:00</td>
            <td>Теннис</td>
            <td>Сидоров О.П.</td>
            <td>Индивидуальные</td>
            <td>2</td>
            <td>Теннисный корт Центральный</td>
        </tr>
        <tr>
            <td>4</td>
            <td>2024-03-01 13:00</td>
            <td>Плавание</td>
            <td>Кузнецова Е.В.</td>
            <td>Индивидуальные</td>
            <td>8</td>
            <td>Плавательный бассейн Аквапарк</td>
        </tr>
        <tr>
            <td>5</td>
            <td>2024-03-02 09:00</td>
            <td>Волейбол</td>
            <td>Морозов Д.С.</td>
            <td>Командные</td>
            <td>12</td>
            <td>Стадион Лужники</td>
        </tr>
        <tr>
            <td>6</td>
            <td>2024-03-02 10:00</td>
            <td>Бег</td>
            <td>Волкова Т.Н.</td>
            <td>Индивидуальные</td>
            <td>15</td>
            <td>Легкоатлетический манеж</td>
        </tr>
        <tr>
            <td>7</td>
            <td>2024-03-02 12:00</td>
            <td>Хоккей</td>
            <td>Соколов А.М.</td>
            <td>Командные</td>
            <td>12</td>
            <td>Стадион Лужники</td>
        </tr>
        <tr>
            <td>8</td>
            <td>2024-03-03 09:00</td>
            <td>Шахматы</td>
            <td>Козлов П.Р.</td>
            <td>Индивидуальные</td>
            <td>2</td>
            <td>Шахматный клуб</td>
        </tr>
        <tr>
            <td>9</td>
            <td>2024-03-03 11:00</td>
            <td>Бадминтон</td>
            <td>Лебедева И.М.</td>
            <td>Индивидуальные</td>
            <td>4</td>
            <td>Теннисный корт Центральный</td>
        </tr>
        <tr>
            <td>10</td>
            <td>2024-03-03 13:00</td>
            <td>Регби</td>
            <td>Павлова С.А.</td>
            <td>Командные</td>
            <td>30</td>
            <td>Стадион Лужники</td>
        </tr>
        <tr>
            <td>11</td>
            <td>2024-03-04 10:00</td>
            <td>Гимнастика</td>
            <td>Егорова В.Д.</td>
            <td>Индивидуальные</td>
            <td>5</td>
            <td>Гимнастический зал</td>
        </tr>
        <tr>
            <td>12</td>
            <td>2024-03-04 11:00</td>
            <td>Бокс</td>
            <td>Андреев К.П.</td>
            <td>Индивидуальные</td>
            <td>2</td>
            <td>Боксерский ринг</td>
        </tr>
        <tr>
            <td>13</td>
            <td>2024-03-04 13:00</td>
            <td>Фехтование</td>
            <td>Зайцева М.В.</td>
            <td>Индивидуальные</td>
            <td>2</td>
            <td>Фехтовальный зал</td>
        </tr>
        <tr>
            <td>14</td>
            <td>2024-03-05 09:00</td>
            <td>Легкая атлетика</td>
            <td>Титова Ю.С.</td>
            <td>Индивидуальные</td>
            <td>20</td>
            <td>Легкоатлетический манеж</td>
        </tr>
        <tr>
            <td>15</td>
            <td>2024-03-05 10:00</td>
            <td>Гандбол</td>
            <td>Семенов Г.А.</td>
            <td>Командные</td>
            <td>14</td>
            <td>Стадион Лужники</td>
        </tr>
        <tr>
            <td>16</td>
            <td>2024-03-05 12:00</td>
            <td>Каратэ</td>
            <td>Орлова Н.Н.</td>
            <td>Индивидуальные</td>
            <td>2</td>
            <td>Боксерский ринг</td>
        </tr>
        <tr>
            <td>17</td>
            <td>2024-03-06 09:00</td>
            <td>Йога</td>
            <td>Антонова Е.В.</td>
            <td>Индивидуальные</td>
            <td>10</td>
            <td>Йога-студия</td>
        </tr>
        <tr>
            <td>18</td>
            <td>2024-03-06 11:00</td>
            <td>Пауэрлифтинг</td>
            <td>Филиппов Д.С.</td>
            <td>Индивидуальные</td>
            <td>6</td>
            <td>Гимнастический зал</td>
        </tr>
        <tr>
            <td>19</td>
            <td>2024-03-06 13:00</td>
            <td>Скалолазание</td>
            <td>Максимова О.Ю.</td>
            <td>Индивидуальные</td>
            <td>8</td>
            <td>Скалодром</td>
        </tr>
        <tr>
            <td>20</td>
            <td>2024-03-07 10:00</td>
            <td>Сноубординг</td>
            <td>Комаров А.И.</td>
            <td>Индивидуальные</td>
            <td>5</td>
            <td>Сноуборд-парк</td>
        </tr>
    </table>
</body>
</html>`);
        response.end();
    });

server.listen(3000);

console.log("Server running at http://localhost:3000/"); 