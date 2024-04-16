const express = require('express');
const app = express();

// Ustawienie EJS jako silnika szablonów
app.set('view engine', 'ejs');
app.set('view cache', true);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.render('pages/home', { title: 'Strona Główna', body: 'Witaj w naszej aplikacji!' });
});


app.get('/users', (req, res) => {
    const users = [{name: 'Anna'}, {name: 'Jan'}];
    res.render('pages/userList', { users: users });
});

app.get('/submit-user', (req, res) => {
    res.render('pages/submit-form', {title: "Formualarz"})
})

app.post('/submit-user', (req, res) => {
    console.log(req.body);
    const { name, email } = req.body;
    // Tutaj można dodać logikę do przetwarzania danych, np. zapis do bazy danych
    res.send(`Dane zarejestrowane: ${name}, ${email}`);
});


app.listen(3000,() => console.log("Server is running"));