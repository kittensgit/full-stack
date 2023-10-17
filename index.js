import express from 'express';

const app = express(); // создвем експресс приложение

app.get('/', (req, res) => {
    res.send('hello, customer!!');
});

app.listen(2222, (err) => {
    if (err) {
        console.log(err);
    }

    console.log('server run');
});
