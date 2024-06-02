const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const Post = require('./models/Post');
const dotenv = require('dotenv')

const cors = require('cors');
dotenv.config();
require("./configs/dbConfig");

const salt = bcrypt.genSaltSync(10);
const secret = 'awdsadkalsdk129843knasdja'

const corsOptions = {
    origin: ['https://blog-app-psi-nine-34.vercel.app/*'],
    Credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))

app.post('/register', async (req,res)=>{
    const {username, password} = req.body
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password,salt),
        });
        res.json(userDoc);
    } catch (error) {
        res.status(400).json(error);
    }
});

app.post('/login', async(req,res)=>{
    const {username, password} = req.body;
    try {
        const userDoc = await User.findOne({username: username});
        if (!userDoc) {
            // User not found with the provided username
            return res.status(400).json('User not found');
        }
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            // User authenticated
            jwt.sign({username,id: userDoc._id}, secret, {}, (err, token)=>{
                if(err) throw err;
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
                });
            })
        }else{
            // Incorrect password
            res.status(400).json('Wrong credentials')
        }
    } catch (error) {
        // Error handling
        res.status(500).json(error.message);
    }
})

app.get('/profile', (req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info)=>{
        if(err) throw err;
        res.json(info)
    })
})


app.post('/logout', (req,res)=>{
    res.cookie('token', '').json({
        id: userDoc._id,
        username,
    });
})

app.post('/post',uploadMiddleware.single('file'), async (req,res)=>{
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1]
    const newPath = path +'.'+ ext
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info)=>{
        if(err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id
        })
        res.json(postDoc);
    })

})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        try {
            const postDoc = await Post.findById(id);
            if (!postDoc) {
                return res.status(404).json('Post not found');
            }
            const isAuthor = postDoc.author.toString() === info.id;
            if (!isAuthor) {
                return res.status(403).json('You are not the author');
            }
            // Update post fields
            postDoc.title = title;
            postDoc.summary = summary;
            postDoc.content = content;
            if (newPath) {
                postDoc.cover = newPath;
            }
            await postDoc.save();
            res.json(postDoc);
        } catch (error) {
            console.error('Error updating post:', error);
            res.status(500).json('Internal server error');
        }
    });
});


app.get('/post', async (req,res)=>{
    res.json(await Post.find()
    .populate('author', ['username'])
    .sort({createdAt: -1})
    .limit(20)
    );
})


app.get('/post/:id', async(req,res)=>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

app.listen(4000);

