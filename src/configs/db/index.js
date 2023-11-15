const mongoose = require('mongoose');

let connect = async () => {
    try {
        const url = `mongodb+srv://nguyenlt2713:${process.env.DB_PASSWORD}@cluster0.dnohyh3.mongodb.net/`
        await mongoose.connect(url);
        console.log('Database connection has been complete!');
    } catch (error) {
        console.log(error);
        console.log('Failed to connection database!!!');
    }
};

module.exports = { connect };