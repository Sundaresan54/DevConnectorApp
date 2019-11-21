const express = require('express');
const connectDb = require('./config/db');

const app = express();


app.get('/', (req, res) => {
    res.send('API is running');
})


//initiate middleware
app.use(express.json({
    extended: false
}))

//define route
app.use('/api/users', require('./route/api/users'));
app.use('/api/auth', require('./route/api/auth'));
app.use('/api/posts', require('./route/api/posts'));
app.use('/api/profile', require('./route/api/profile'));

const PORT = process.env.PORT || 5000;
connectDb();
app.listen(PORT, () => console.log(`Sucessfully running backend server ${PORT}`));