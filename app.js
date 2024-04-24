const express = require('express');
const app = express();
const knex = require('knex')(require('./knexfile').development);
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser());
app.use(session({
    secret: 'verySecretValue',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Ustaw na `true` jeśli używasz HTTPS
}));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true })); // Middleware do parsowania body formularza

app.get('/', async (req, res) => {
    let userName = 'Nieznajomy'; // Domyślna wartość, jeśli nie ma sesji ani ciasteczka
    if (req.session.user) {
        userName = req.session.user; // Użyj nazwy z sesji, jeśli dostępna
    } else if (req.cookies.username) {
        userName = req.cookies.username; // Użyj nazwy z ciasteczka, jeśli sesja nie istnieje
        req.session.user = userName; // Odtwórz sesję z ciasteczka
    }
    try {
        const users = await knex('users').select('*'); // Pobieranie użytkowników z bazy danych
        res.render('index', { users, userName }); // Przekazanie użytkowników i nazwy użytkownika do szablonu
    } catch (error) {
        console.error(error);
        res.status(500).send('Błąd serwera');
    }
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

app.get('/login', (req, res) => {
    res.render('login');  // Wyświetl formularz logowania
});


app.post('/login', (req, res) => {
    const { username } = req.body;
    req.session.user = username; // Przechowaj nazwę użytkownika w sesji
    res.cookie('username', username, { maxAge: 900000, httpOnly: true }); // Ustaw ciasteczko
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Błąd podczas niszczenia sesji', err);
            return res.status(500).send('Nie udało się wylogować');
        }
        res.clearCookie('username'); // Usuń ciasteczko z nazwą użytkownika
        res.clearCookie('connect.sid'); // Usuń ciasteczko sesji
        res.redirect('/');
    });
});


app.listen(3000, () => console.log('Server running on port 3000'));
