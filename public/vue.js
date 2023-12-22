// 創建 Vue 應用程序
const app = Vue.createApp({
    data() {
      return {
        message: '',
        items: [], // 數據項目將用於顯示從 API 獲取的數據
        foodName: '',
        tastyFood: '',
        table_toggle: 'food'
      };
    },
    mounted() {
        //mounted 鉤子只會在 Vue 實例首次被掛載到 DOM 元素後執行一次。
        //一旦 Vue 實例被掛載到 DOM，mounted 鉤子就會被觸發，之後不會再重複執行
        this.getData(); // 在 Vue 實例掛載時獲取數據 
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
      deleteItem(id) {
        fetch(`/messages/${id}`, {
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
      // 刪除數據的方法
      table_toggle_func() {
        if (this.table_toggle === 'food') {
          this.table_toggle = 'messages';
        } else {
          this.table_toggle = 'food';
        }
        this.getData(); // 更新数据
      },
    }
  });
  // 將 Vue 應用程序掛載到具有 id="app" 的 HTML 元素上
  app.mount('#app');
  