const express = require('express'); // 引入 Express 框架
const mysql = require('mysql2'); // 引入 MySQL 模組
const path = require('path'); // 引入 path 模組
const app = express(); // 建立 Express 應用程式

app.use(express.static(path.join(__dirname, 'public'))); // 設置靜態資源路徑 //變成絕對路徑 
app.use(express.urlencoded({ extended: true })); // 處理 URL 編碼的資料
app.use(express.json()); // 解析 JSON 格式的請求資料

// 建立 MySQL 連接
const connection = mysql.createConnection({
  host: 'mysql-container',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'qq'
});

// 連接至 MySQL 數據庫
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database wei');
});

// 處理 POST 請求，將訊息插入 MySQL 數據庫
app.post('/add-message', (req, res) => {
  const message = req.body.message; // 從請求中獲取訊息
  const insertQuery = 'INSERT INTO messages (text) VALUES (?)'; // 插入訊息的 SQL 語句
  connection.query(insertQuery, [message], (error, results) => {
    if (error) {
      console.error('Error inserting data into database:', error);
      res.status(500).json({ error: 'Error inserting data into database' }); // 回傳錯誤訊息
      return;
    }
    res.status(200).json({ success: true }); // 插入成功，回傳成功訊息
  });
});

// 處理 GET 請求，從 MySQL 數據庫檢索訊息
app.get('/messages', (req, res) => {
  const selectQuery = 'SELECT * FROM messages'; // 查詢所有訊息的 SQL 語句
  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Error querying database' }); // 回傳錯誤訊息
      return;
    }
    res.json(results); // 將查詢結果回傳給客戶端
  });
});

// 處理 DELETE 請求，從 MySQL 數據庫刪除訊息
app.delete('/delete-message/:id', (req, res) => {
  const messageId = req.params.id; // 從 URL 中獲取訊息 ID
  const deleteQuery = 'DELETE FROM messages WHERE id = ?'; // 刪除訊息的 SQL 語句
  connection.query(deleteQuery, [messageId], (error, results) => {
    if (error) {
      console.error('Error deleting data from database:', error);
      res.status(500).json({ error: 'Error deleting data from database' }); // 回傳錯誤訊息
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Message ID not found' }); // 如果訊息 ID 未找到，回傳錯誤訊息
      return;
    }
    res.status(200).json({ success: true }); // 成功刪除，回傳成功訊息
  });
});

const port = 3000; // 設置伺服器執行的端口
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // 在控制台上顯示伺服器執行的端口
});