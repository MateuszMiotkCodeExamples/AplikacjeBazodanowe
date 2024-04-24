const express = require('express');
const app = express();
const knex = require('knex')(require('./knexfile').development);

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true })); // Middleware do parsowania body formularza

app.get('/', async (req, res) => {
    const users = await knex('users').select('*');
    res.render('index', { users });
});

app.post('/users', async (req, res) => {
    const { name, age, email } = req.body;
    try {
        await knex('users').insert({ name, age, email });
        res.redirect('/'); // Przekierowanie z powrotem na stronę główną po dodaniu użytkownika
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding user');
    }
});


app.listen(3000, () => console.log('Server running on port 3000'));
