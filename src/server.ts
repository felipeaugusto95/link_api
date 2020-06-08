import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import connection from './database/connection';

const mongoose = require('mongoose');

const app = express();
const port = 3333;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(routes);

mongoose.connect(connection.url, connection.options);
mongoose.set('useCreateIndex', true);

mongoose.connection.on('error', (err: string) => {
  console.log('Connection DB Error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Aplicattion disconneted');
});

mongoose.connection.on('connected', () => {
  console.log('Aplicattion connected successfully!');
});

app.listen(port, () => {
  console.log(`Server is running at localhost:${port}`);
});
