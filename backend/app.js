const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL)
    .then((d) => {
        console.log("connected");
    })
    .catch((e) => {
        console.log('not connected')
    })


app.get('/', (req, res) => {
    res.send("listening")
})

// defining Routes
const authRoute = require('./routes/auth');
const projectRoute = require('./routes/projects');
const dataRoute = require('./routes/data');
const userAuthRoute = require('./routes/userAuth');
const storageRoute = require('./routes/storage');


// Using routes 
app.use('/api/auth', authRoute);
app.use('/api/projects', projectRoute);
app.use('/api/data', dataRoute);
app.use('/api/userAuth', userAuthRoute);
app.use('/api/storage', storageRoute);

app.listen(1234, () => {
    console.log("http://localhost:1234");
})