## Models


### Old Moldels


## Cupboard Model
This is `Cupboard` Model(Schema) for storing the cupboard details 

```javascript
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CupboardSchema = new Schema({
    id: String,
    name: String,
    place:String,
    space: String,
    date: {
        type: String,
        default: () => new Date().toISOString(), 
    },
});

module.exports = mongoose.model('Cupboard', CupboardSchema);
```

## Details Model 
This is the `Details` Model(Schema) for the storng details of costume with cupboard id which so you which costume in which cupboard through cpid(cupboard id)

```javascript
const DetailsSchema = new Schema({
    cpid: String,
    id: String,
    cpname: String,
    catagory: String,
    place: String,
    costumename: String,
    description: String,
    fileUrl: String,
    quantity: { type: Number, required: true },
    status: { type: String, default: "In Stock" },
    date: {
        type: String,
        default: () => new Date().toISOString(),
    },
});

```

### New Models

## Cupboard Model

The `Cupboard` model  can not contain any changes mens schema is old 

```javascript
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CupboardSchema = new Schema({
    id: String,
    name: String,
    place:String,
    space: String,
    date: {
        type: String,
        default: () => new Date().toISOString(), 
    },
});

module.exports = mongoose.model('Cupboard', CupboardSchema);
```

## Details Model

The `Details` model contain 11 things but it only store one cupboard id so we can add one item add in only one cupboard. 
Now crate a new structure of the `Details` which is store cpid also but in group menas one details (costume) contain group of cpid so it shows one costume in multiple cupboard

```javascript
const CostumeSchema = new Schema({
    id: String,//old
    costumename: String,//old
    description: String,//old
    fileUrl: String,//old
    catagory: String,//old
    status: { type: String, default: "In Stock" },//old
    totalQuantity: { type: Number, required: true },//newAdded
    stock: [
        {
            cpid: { type: String },
            cpname: String,
            quantity: { type: Number, required: true },
        }
    ],//new 

      date: {
        type: String,
        default: () => new Date().toISOString(),
    },//old
});

const Costume = mongoose.model('Costume', CostumeSchema);
```


