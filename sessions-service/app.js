const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Ajouter une session
app.post('/sessions', async (req, res) => {
    const { userId, duration } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.query('INSERT INTO sessions (user_id, date, duration) VALUES (?, NOW(), ?)', [userId, duration]);
        res.status(201).send({ message: 'Session added' });
    } finally {
        conn.release();
    }
});

// Récupérer les sessions
app.get('/sessions/:userId', async (req, res) => {
    const userId = req.params.userId;
    const conn = await db.getConnection();
    try {
        const [rows] = await conn.query('SELECT date, duration FROM sessions WHERE user_id = ? ORDER BY date DESC', [userId]);
        res.send(rows);
    } finally {
        conn.release();
    }
});

app.listen(3001, () => console.log('Sessions service running on port 3001'));