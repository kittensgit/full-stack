import express from 'express';

const app = express(); // создвем експресс приложение

app.get('/', (req, res) => {
    res.send('hello, customer!!');
});

app.post('/auth/login', (req, res) => {
    res.json({
        success: true,
    });
});

app.listen(2222, (err) => {
    if (err) {
        console.log(err);
    }

    console.log('server run');
});
