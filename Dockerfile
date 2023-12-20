# 使用官方 Node.js 映像作為基礎映像
FROM node:14

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json（如果有的話）
COPY package*.json ./

# 安裝相依套件
RUN npm install

# 複製應用程式代碼到容器中
COPY . .

# 開放應用程式使用的端口
EXPOSE 3000

# 定義啟動應用程式的指令
CMD ["npm", "start"]