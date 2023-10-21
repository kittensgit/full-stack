import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { registerValidation } from './validations/auth.js';
import UserModel from './models/user.js';

mongoose
    .connect(
        'mongodb+srv://nika:222222@cluster0.1vzxdh1.mongodb.net/blog?retryWrites=true&w=majority'
    )
    .then(() => {
        console.log('db ok');
    })
    .catch((err) => {
        console.log('db error', err);
    });

const app = express(); // создвем експресс приложение

app.use(express.json());

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash,
        });

        const user = await doc.save();

        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
});

app.listen(2222, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('server run');
});
