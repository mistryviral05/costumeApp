const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const cupboards = require('./routes/cupboard.route');
const details = require('./routes/details.route')
const files = require('./routes/uploadefile.route')
const users = require('./routes/user.route')
const catagory = require('./routes/catagory.route')
const fs = require('fs')
const path = require('path')

const app = express();
const port = 3002;

app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the size as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({ 
    origin: 'http://localhost:5173', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use('/cupboards', cupboards);
app.use('/cpdetails', details);
app.use('/users',users)
app.use('/catagories',catagory)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads')
}



app.use('/uploadefile', files)


app.get('/', (req, res) => {
    res.send('hellow world')
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});