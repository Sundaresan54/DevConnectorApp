const express = require('express');
const connectDb = require('./config/db');

const app = express();


app.get('/', (req, res) => {
    res.send('API is running');
})
const PORT = process.env.PORT || 5000;
connectDb();
app.listen(PORT, () => console.log(`Sucessfully running backend server ${PORT}`));