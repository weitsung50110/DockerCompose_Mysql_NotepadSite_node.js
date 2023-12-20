// scripts.js
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
        // Clear input field after submission
        messageInput.value = '';
        // Fetch and display data from MySQL after submission
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
          dataDiv.innerHTML = ''; // Clear previous data
          data.forEach(row_data => {
            const rowDiv = document.createElement('div');
            rowDiv.innerText = JSON.stringify(row_data);
            dataDiv.appendChild(rowDiv);
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    // Initial data load on page load
    getData();
  });