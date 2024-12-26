const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            family: 4 // Используем IPv4
        };

        await mongoose.connect('mongodb://127.0.0.1:27017/sports_db', options);
        console.log('MongoDB подключена успешно');
    } catch (error) {
        console.error('Ошибка подключения к MongoDB:', error);
        process.exit(1);
    }
};

module.exports = { connectDB }; 