const express = require('express');
const connectDb = require('./config/db');
const cors = require('cors');
const app = express();


app.get('/', (req, res) => {
    res.send('API is running');
})

app.all('/api/users', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(cors());

//initiate middleware
app.use(express.json({
    extended: false
}))

//define route
app.use('/api/users', require('./route/api/users'));
app.use('/api/auth', require('./route/api/auth'));
app.use('/api/posts', require('./route/api/posts'));
app.use('/api/profile', require('./route/api/profile'));

const PORT = process.env.PORT || 5002;
connectDb();
app.listen(PORT, () => console.log(`Sucessfully running backend server ${PORT}`));