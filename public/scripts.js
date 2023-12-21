/* DOMContentLoaded它會在整個 HTML 文件的 DOM（文件物件模型）被完全載入並解析完成後觸發。
這個事件通常是用來確保網頁的 HTML 元素已經被建立，JavaScript 代碼可以安全地運行。*/
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('dataForm');
    const messageInput = document.getElementById('message');
    const dataDiv = document.getElementById('data');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const message = messageInput.value;
  
      fetch('/add-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      })
      .then(() => {
        messageInput.value = '';
        getData();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  
    function getData() {
        fetch('/messages')
          .then(response => response.json())
          .then(data => {
            dataDiv.innerHTML = '';
            data.forEach(row_data => {
              const rowDiv = document.createElement('div');
              const deleteButton = document.createElement('button');
              deleteButton.innerText = 'Delete';
              deleteButton.classList.add('delete-button'); // Add CSS class to delete button
              deleteButton.addEventListener('click', function () {
                deleteData(row_data.id);
              });
              rowDiv.innerText = JSON.stringify(row_data);
              rowDiv.appendChild(deleteButton);
              dataDiv.appendChild(rowDiv);
            });
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
  
    function deleteData(id) {
      fetch(`/delete-message/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.status === 200) {
          getData(); // Refresh data after deletion
        } else {
          console.error('Error:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  
    getData();
});