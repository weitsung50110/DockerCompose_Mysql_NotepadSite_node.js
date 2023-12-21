/* DOMContentLoaded它會在整個 HTML 文件的 DOM（文件物件模型）被完全載入並解析完成後觸發。
這個事件通常是用來確保網頁的 HTML 元素已經被建立，JavaScript 代碼可以安全地運行。*/

// 等待整個 HTML 文件加載完畢後執行
document.addEventListener('DOMContentLoaded', function () {
    // 獲取表單元素、訊息輸入框和顯示數據的 div
    const form = document.getElementById('dataForm');
    const messageInput = document.getElementById('message');
    const dataDiv = document.getElementById('data');

    // 當表單提交時觸發事件
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // 阻止預設提交行為

        // 獲取訊息輸入框的值
        const message = messageInput.value;

        // 使用 Fetch API 發送 POST 請求
        fetch('/add-message', {
            method: 'POST', // 設置請求方法為 POST
            headers: {
                'Content-Type': 'application/json' // 設置請求頭部的 Content-Type 為 JSON
            },
            body: JSON.stringify({ message }) // 將訊息轉換為 JSON 字串並作為請求體發送
        })
        .then(() => {
            messageInput.value = ''; // 清空訊息輸入框的值
            getData(); // 重新獲取數據並刷新顯示
        })
        .catch(error => {
            console.error('Error:', error); // 若發生錯誤則輸出錯誤信息到控制台
        });
    });

    // 獲取數據的函數
    function getData() {
        fetch('/messages')
            .then(response => { return response.json()}) // 解析 JSON 格式的回應
            .then(data => {
                dataDiv.innerHTML = ''; // 清空顯示數據的 div

                // 遍歷每一條數據並顯示在網頁上
                data.forEach(row_data => {
                    const rowDiv = document.createElement('div'); // 創建新的 div 元素
                    const deleteButton = document.createElement('button'); // 創建刪除按鈕元素
                    deleteButton.innerText = 'Delete'; // 設置按鈕文本
                    deleteButton.classList.add('delete-button'); // 添加 CSS 類到刪除按鈕

                    // 點擊刪除按鈕時調用 deleteData 函數刪除該條數據
                    deleteButton.addEventListener('click', function () {
                        deleteData(row_data.id);
                    });

                    // 將數據轉為 JSON 字串並顯示在網頁上，並將刪除按鈕添加到該條數據下
                    rowDiv.innerText = JSON.stringify(row_data);
                    rowDiv.appendChild(deleteButton);
                    dataDiv.appendChild(rowDiv); // 將 div 添加到顯示數據的 div 中
                });
            })
            .catch(error => {
                console.error('Error:', error); // 若發生錯誤則輸出錯誤信息到控制台
            });
    }

    // 刪除數據的函數
    function deleteData(id) {
        fetch(`/delete-message/${id}`, {
            method: 'DELETE' // 發送 DELETE 請求刪除特定數據
        })
        .then(response => {
            if (response.status === 200) {
                getData(); // 刪除成功後重新獲取數據並刷新顯示
            } else {
                console.error('Error:', response.statusText); // 若刪除失敗則輸出錯誤信息到控制台
            }
        })
        .catch(error => {
            console.error('Error:', error); // 若發生錯誤則輸出錯誤信息到控制台
        });
    }

    getData(); // 初始時獲取並顯示數據
});