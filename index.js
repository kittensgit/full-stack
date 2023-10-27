import express from 'express';
import mongoose from 'mongoose';
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controller/UserController.js';
import * as PostController from './controller/PostController.js';

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

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(2222, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('server run');
});
