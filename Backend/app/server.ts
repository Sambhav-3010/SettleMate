import express from 'express';

const app = express();
const PORT: number = 3000;

app.get('/', (req, res) => {
    console.log('Request received for /');
    res.send('Welcome to typescript backend!');
});

app.listen(PORT, () => {
    console.log('The application is listening on port http://localhost/' + PORT);
})
