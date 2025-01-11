const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cupboards = require('./routes/cupboard.route');
const details = require('./routes/details.route')
const files = require('./routes/uploadefile.route')
const fs = require('fs')
// const path = require('path')

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use('/cupboards', cupboards);
app.use('/cpdetails', details);

if(!fs.existsSync('uploads')){
    fs.mkdirSync('uploads')
}



app.use('/uploadefile',files)


app.get('/',(req,res)=>{
    res.send('hellow world')
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});