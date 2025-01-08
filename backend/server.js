const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cupboards = require('./routes/cupboard.route');

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use('/cupboards', cupboards);

app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});