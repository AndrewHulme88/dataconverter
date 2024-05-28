const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const json = require('./countries.json');

const app = express();

// Create a connection to the SQL database
const db = mysql.createConnection({
    host: 'your_host',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to the database');
});

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// RESTful API endpoints
app.get('/countries', (req, res) => {
    const query = 'SELECT * FROM countries';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error fetching countries' });
        } else {
            res.send(results);
        }
    });
});

app.post('/countries', (req, res) => {
    const country = req.body;
    const query = 'INSERT INTO countries (name, capital, region, population) VALUES (?, ?, ?, ?)';
    db.query(query, [country.name, country.capital, country.region, country.population], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error creating country' });
        } else {
            res.send({ message: 'Country created successfully' });
        }
    });
});

app.get('/countries/:name', (req, res) => {
    const name = req.params.name;
    const query = 'SELECT * FROM countries WHERE name = ?';
    db.query(query, [name], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error fetching country' });
        } else {
            res.send(results[0]);
        }
    });
});

app.put('/countries/:name', (req, res) => {
    const name = req.params.name;
    const country = req.body;
    const query = 'UPDATE countries SET capital = ?, region = ?, population = ? WHERE name = ?';
    db.query(query, [country.capital, country.region, country.population, name], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error updating country' });
        } else {
            res.send({ message: 'Country updated successfully' });
        }
    });
});

app.delete('/countries/:name', (req, res) => {
    const name = req.params.name;
    const query = 'DELETE FROM countries WHERE name = ?';
    db.query(query, [name], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error deleting country' });
        } else {
            res.send({ message: 'Country deleted successfully' });
        }
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
