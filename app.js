const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 9870;
const connectDB = require('./database/dbConnection');
const employeeRouter = require('./routers/employeeRouter');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const corsOptions = {
    origin: "*",
    methods: ["GET, POST, PUT, DELETE, OPTIONS, PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

connectDB();

app.get('/', (req, res)=>{
    res.send('Welcome to Employee Api');
})

app.use('/api/auth', employeeRouter);

app.listen(port, (err)=>{
    if (err) throw err;
    console.info(`Server is running on port ${port}`);
})