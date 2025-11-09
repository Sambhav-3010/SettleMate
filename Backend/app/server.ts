import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const PORT: number = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to splitwise backend!');
});

app.listen(PORT, () => {
    console.log('The application is listening on port http://localhost:' + PORT);
})
