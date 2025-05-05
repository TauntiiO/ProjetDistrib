const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        res.status(201).send({ message: 'User created' });
    } catch (err) {
        res.status(400).send({ error: 'Username already exists' });
    } finally {
        conn.release();
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const conn = await db.getConnection();
    try {
        const [rows] = await conn.query('SELECT id FROM users WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) {
            res.send({ userId: rows[0].id });
        } else {
            res.status(401).send({ error: 'Invalid credentials' });
        }
    } finally {
        conn.release();
    }
});

app.listen(3000, () => console.log('Users service running on port 3000'));