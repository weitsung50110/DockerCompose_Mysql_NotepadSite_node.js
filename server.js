const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'mysql-container',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'qq'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Handle POST request to insert message into MySQL
app.post('/add-message', (req, res) => {
  const { message } = req.body;
  const insertQuery = 'INSERT INTO messages (text) VALUES (?)';
  connection.query(insertQuery, [message], (error, results) => {
    if (error) {
      console.error('Error inserting data into database:', error);
      res.status(500).json({ error: 'Error inserting data into database' });
      return;
    }
    res.status(200).json({ success: true });
  });
});

// Handle GET request to retrieve messages from MySQL
app.get('/messages', (req, res) => {
  const selectQuery = 'SELECT * FROM messages';
  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Error querying database' });
      return;
    }
    res.json(results);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});