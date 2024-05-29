const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB', err);
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const Item = require('./models/item');

app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.render('index', { items });
});

app.post('/items', async (req, res) => {
    const item = new Item({
        name: req.body.name,
        quantity: req.body.quantity
    });
    await item.save();
    res.redirect('/items');
});

app.get('/', (req, res) => {
    res.redirect('/items');
});

app.post('/items/update/:id', async (req, res) => {
    const { id } = req.params;
    await Item.findByIdAndUpdate(id, { name: req.body.name, quantity: req.body.quantity });
    res.redirect('/items');
});

app.post('/items/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Item.findByIdAndRemove(id);
    res.redirect('/items');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
