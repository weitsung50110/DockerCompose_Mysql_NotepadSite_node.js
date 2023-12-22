# 使用官方 Node.js 映像作為基礎映像
FROM node:14

# 指定工作目錄後，後續的指令（例如 COPY、RUN、CMD 等）會相對於這個工作目錄進行操作。
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json（如果有的話），複製到 Docker 映像檔中的 /usr/src/app 目錄。
COPY package*.json .

# 安裝相依套件
RUN npm install

# 複製應用程式代碼到容器中，複製到 Docker 映像檔中的 /usr/src/app 目錄。
COPY . .

# 開放應用程式使用的端口
EXPOSE 3000

# 定義啟動應用程式的指令
CMD ["npm", "start"]