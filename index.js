import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { PostController, UserController } from './controllers/index.js';

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

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post(
    '/auth/login',
    loginValidation,
    handleValidationErrors,
    UserController.login
);
app.post(
    '/auth/register',
    registerValidation,
    handleValidationErrors,
    UserController.register
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post(
    '/posts',
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.create
);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
    '/posts/:id',
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.update
);

app.listen(2222, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('server run');
});
