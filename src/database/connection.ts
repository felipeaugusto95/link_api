require('dotenv/config');

const connection = {
    url: process.env.DB_CONNECTION,
    options: { reconnectTries: Number.MAX_VALUE, reconnectInterval: 500, poolSize: 5, useNewUrlParser: true }
}   

export default connection;