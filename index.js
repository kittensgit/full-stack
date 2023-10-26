import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { registerValidation } from './validations/auth.js';
import UserModel from './models/user.js';
import checkAuth from './utils/checkAuth.js';

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

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email,
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const validPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!validPass) {
            return res.status(400).json({
                message: 'invalid password or login',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            { expiresIn: '30d' }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            userData,
            token,
        });
    } catch (error) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to login',
        });
    }
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            { expiresIn: '30d' }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
});

app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(403).json({
                message: 'User not found',
            });
        }

        const { passwordHash, ...userData } = user._doc;

        res.json({
            userData,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'No access',
        });
    }
});

app.listen(2222, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('server run');
});
