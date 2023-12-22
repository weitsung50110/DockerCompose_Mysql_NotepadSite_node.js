// 創建 Vue 應用程序
const app = Vue.createApp({
    data() {
      return {
        message: '',
        items: [], // 數據項目將用於顯示從 API 獲取的數據
        foodName: '',
        tastyFood: '',
        table_toggle: 'food',
        title_toggle: 'food',
        come_close: true
      };
    },
    mounted() {
        //mounted 鉤子只會在 Vue 實例首次被掛載到 DOM 元素後執行一次。
        //一旦 Vue 實例被掛載到 DOM，mounted 鉤子就會被觸發，之後不會再重複執行
        this.getData(); // 在 Vue 實例掛載時獲取數據 
        this.first_come(); // 檢查是否為第一次來
    },
    methods: {
      // 提交消息
      submitMessage() {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: this.message })
        };
  
        // 使用 Fetch API 發送 POST 請求
        fetch('/messages', requestOptions)
          .then(() => {
            this.message = ''; // 清空訊息輸入框的值
            this.getData(); // 重新獲取數據並刷新顯示
          })
          .catch(error => {
            console.error('Error:', error); // 若發生錯誤則輸出錯誤信息到控制台
          });
      },
      // 提交食物
      submitFood() {
        const foodData = {
          foodName_j: this.foodName,
          tastyFood_j: this.tastyFood
        };
  
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(foodData)
        };
  
        // 使用 Fetch API 發送 POST 請求
        fetch('/food', requestOptions)
          .then(() => {
            this.tastyFood = ''; // 清空訊息輸入框的值
            this.getData(); // 重新獲取數據並刷新顯示
          })
          .catch(error => {
            console.error('Error:', error); // 若發生錯誤則輸出錯誤信息到控制台
          });
      },
      // 獲取數據的方法
      getData() {
        const requestOptions = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          };

        // 在 URL 中包含需要傳遞的參數，table_toggle 參數將透過 URL 的查詢字串傳遞
        // 原本只有/messages，但當GET要傳遞參數時，加上?table_toggle 代表要傳遞的參數
        fetch(`/messages?table_toggle=${this.table_toggle}`, requestOptions)
          .then(response => response.json())
          .then(data => {
            this.items = data; // 更新數據
          })
          .catch(error => {
            console.error('Error:', error); // 若發生錯誤則輸出錯誤信息到控制台
          });
      },
      // 刪除數據的方法
      deleteItem(id, table_toggle_parm) {
        console.log("table_toggle_parm : ",table_toggle_parm)
        fetch(`/${table_toggle_parm}/${id}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (response.status === 200) {
            this.getData(); // 刪除成功後重新獲取數據並刷新顯示
          } else {
            console.error('Error:', response.statusText); // 若刪除失敗則輸出錯誤信息到控制台
          }
        })
        .catch(error => {
          console.error('Error:', error); // 若發生錯誤則輸出錯誤信息到控制台
        });
      },
      // Get不同表格的方法 food messages table
      table_toggle_func() {
        if (this.table_toggle === 'food') {
          this.table_toggle = 'messages';
        } else {
          this.table_toggle = 'food';
        }
        this.getData(); // 更新数据
      },
      // Get不同表格的方法 food messages table
      title_toggle_func() {
        if (this.title_toggle === 'food') {
          this.title_toggle = 'messages';
        } else {
          this.title_toggle = 'food';
        }
      },
      first_come_close(){
        this.come_close = false;
      },
      first_come(){
        // 檢查本地存儲中是否有訪問標記
        if (!localStorage.getItem('visited')) {
          // 如果是第一次訪問，顯示模態框
          // 創建一個新的圖片元素
          const newImage = document.createElement('img');
          const CloseButton = document.createElement('button');
          const NextButton = document.createElement('button');
          const PreviousButton = document.createElement('button');
          CloseButton.textContent="Close"
          NextButton.textContent="Next"
          PreviousButton.textContent="Previous"

          // 設定圖片的路徑和描述文字
          newImage.src = 'img/50.png';
          newImage.alt = 'instruction img';

          // 找到要放置圖片的容器元素
          const imageContainer = document.getElementById('imageContainer');

          // 把圖片添加到容器中
          imageContainer.appendChild(newImage);
          imageContainer.appendChild(PreviousButton);
          imageContainer.appendChild(NextButton);
          imageContainer.appendChild(CloseButton);

          localStorage.setItem('visited', 'true');
          // 監聽按鈕點擊事件，調用 first_come_close 方法
          CloseButton.addEventListener('click', this.first_come_close); 
          NextButton.addEventListener('click', ()=>{
            newImage.src = 'img/51.png';
          }); 
          PreviousButton.addEventListener('click', ()=>{
            newImage.src = 'img/50.png';
          }); 
          
        }
      },
    }
  });
  // 將 Vue 應用程序掛載到具有 id="app" 的 HTML 元素上
  app.mount('#app');
  