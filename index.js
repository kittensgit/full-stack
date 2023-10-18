import express from 'express';
import jwt from 'jsonwebtoken';

const app = express(); // создвем експресс приложение

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello, customer!!');
});

app.post('/auth/login', (req, res) => {
    console.log(req.body);
    const token = jwt.sign(
        {
            email: req.body.email,
            fullName: 'kto-to',
        },
        'password123'
    );

    res.json({
        success: true,
        token,
    });
});

app.listen(2222, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('server run');
});
