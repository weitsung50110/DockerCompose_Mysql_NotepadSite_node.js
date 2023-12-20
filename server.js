
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
// 建立 MySQL 連接
const connection = mysql.createConnection({
    host: 'mysql-container', // MySQL 容器的 IP 地址
    port: '3306',       // MySQL 默认端口号
    user: 'root',
    password: 'root', // 修改为您的 MySQL 密码
    database: 'qq' // 修改为您的数据库名称
});

// 連接到 MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

/* 路由設定
app.get('/', (req, res) => {
  // 在此處可以編寫您的資料庫查詢等程式碼
  connection.query('SELECT * FROM messages', (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      return;
    }
    // 將查詢結果顯示在網頁上
    res.send(`<h1>Data from MySQL:</h1><pre>${JSON.stringify(results, null, 2)}</pre>`);
  });
});*/

// 新的路由用于处理按钮点击事件并执行查询
app.get('/messages', (req, res) => {
    connection.query('SELECT * FROM messages', (error, results) => {
      if (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Error querying database' });
        return;
      }
      res.json(results);
    });
  });  

// 啟動伺服器
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});