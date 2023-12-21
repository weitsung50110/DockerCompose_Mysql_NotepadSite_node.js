# Implementing Containerization with Docker Compose and MySQL on Express within Node.js for a Notepad Functionality Website
## 藉由docker-compose使用mysql和node.js的方法
我的mysql目錄掛載在本地的位置為./mysql-data，因此若有sql相關檔案想要置放，請放在mysql-data資料夾下面。<br />
如果mysql沒有掛載，只要重啟container後，新增的東西就會不見。

    services:
      my-node-app:
        volumes:
          - .:/usr/src/app  # 將本地程式碼目錄掛載到容器內
      mysql-container:
        volumes:
          - ./mysql-data:/var/lib/mysql

因為本專案的server取名為server_wei.js，因此需要進去package.json中，加上以下指令，<br />
這樣在Dockerfile的CMD ["npm", "start"]才能夠抓去到server的位置並啟動node.js。

      "scripts": {
        "start": "node server_wei.js"
      }

本專案的project名稱為mysql_DockerCopmpose，因此network名稱為mysql_dockercopmpose_default。<br />
(在尾端加上default字樣是docker-compose的network名稱預設)

### process.env
server_wei.js中，
process.env 是一個 Node.js 的全域對象，其中包含了系統環境變數。<br />
這些環境變數可以在執行程式時由作業系統或者在 Docker Compose 中設置。<br />
DB_HOST、DB_PORT、DB_USER、DB_PASSWORD 和 DB_NAME是根據你在 docker-compose.yml 中定義的環境變數名稱。

透過這種方式，程式碼中不直接硬編碼連接詳細資訊，而是使用環境變數，<br />
這樣的好處是在不同的環境中（開發、測試、部署）時，只需更改 docker-compose.yml 中的環境變數設置<br />
而不需要修改程式碼，這使得應用程式更具可移植性和安全性。<br />

        // 建立 MySQL 連接
        const connection = mysql.createConnection({
          host: process.env.DB_HOST, // 從環境變數中獲取 MySQL 主機名稱
          user: process.env.DB_USER, // 從環境變數中獲取 MySQL 用戶名
          password: process.env.DB_PASSWORD, // 從環境變數中獲取 MySQL 密碼
          database: process.env.DB_NAME // 從環境變數中獲取 MySQL 資料庫名稱
        });

若不想使用docker-compose來啟動的話，也可以個別來跑，但要注意有要通訊的containers必須要連接近同一個network當中。

***Create a Docker network***

    docker network create mynetwork

***Run Mysql***

    docker run --network=mynetwork --name=mysql-container -e MYSQL_ROOT_PASSWORD=root -d mysql:8.2-oraclelinux8
    
***Build the Dockerfile for Node.js***

    docker build -t my-express-app .

***Run Node.js***

    docker run --name my-node-app --rm -v D:/mysql:/app --network=mynetwork -p 3000:3000 -d node:14 node /app/server_wei.js

可以看到都連進同一個--network=mynetwork當中，並會使用node /app/server_wei.js來啟動伺服器。<br />
雖然可以個別運行容器，但使用 Docker Compose 通常是管理多個相互關聯的容器更簡便和方便的方式。<br />
這對於開發、測試和部署複雜的應用程式尤其有益。

## 常見問題解決方法 Common Problem-Solving Methods.
### - 在node.js當中，使用mysql2

        my-node-app      | 
        Error connecting to database: Error: 
        ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client

這個錯誤表示 MySQL 用戶端不支援 MySQL 伺服器所要求的身份驗證協定。這通常是由於 MySQL 伺服器使用了新的身份驗證插件，而舊版的 MySQL 用戶端不支援這種插件造成的。

- 使用 npm 命令更新 MySQL 模块
更新前和更新後版本都一樣，即使更新到最新的mysql，也只有2.18.1版本~

- 使用mysql2 > const mysql = require('mysql2');，不使用mysql，才能成功啟動。

### - Docker錯誤 > failed to solve: Canceled: context canceled
        PS D:\mysql_DockerCopmpose> docker-compose up
        [+] Building 3.2s (5/9)                                                                                                                  docker:default
         => [my-node-app internal] load .dockerignore                                                                                                      0.0s
         => => transferring context: 81B                                                                                                                   0.0s
         => [my-node-app internal] load build definition from Dockerfile                                                                                   0.0s
         => => transferring dockerfile: 443B                                                                                                               0.0s
         => [my-node-app internal] load metadata for docker.io/library/node:14                                                                             3.0s
         => [my-node-app 1/5] FROM docker.io/library/node:14@sha256:a158d3b9b4e3fa813fa6c8c590b8f0a860e015ad4e59bbce5744d2f6fd8461aa                       0.0s
         => CANCELED [my-node-app internal] load build context                                                                                             0.2s
         => => transferring context: 6.27MB                                                                                                                0.2s
        failed to solve: Canceled: context canceled

把mysql 的volume裡面內容刪除就可以跑了，
出現這個訊息試著清空/mysql-data <br />
(mysql-data~刪除後，需要再次創DB、table等內容)

        mysql-container:
        volumes:
          - ./mysql-data:/var/lib/mysql    

## docker-compose.yml
#### my-node-app 服務：
1. container_name: 指定此容器的名稱為 my-node-app。
2. build: 定義如何建構此服務的映像檔。context 指定了 Dockerfile 的位置（目前設定為當前目錄），dockerfile 則指定了要使用的 Dockerfile。
3. ports: 將容器內的端口映射到主機的端口。在這裡是將容器的 3000 口映射到主機的 3000 口。
4. volumes: 將主機的當前目錄（.）掛載到容器內的 /usr/src/app 路徑下。這樣可以讓容器內的應用程式與本機的程式碼同步，使開發更方便。
5. depends_on: 定義此服務所依賴的其他服務，這裡是依賴於 mysql-container。
6. environment: 設定容器內的環境變數。在此設定了與 MySQL 相關的環境變數，例如資料庫的連接資訊和密碼等。

#### mysql-container 服務：
1. container_name: 指定此容器的名稱為 mysql-container。
2. image: 使用的映像檔為 mysql:8.2-oraclelinux8，這是 MySQL 的官方映像檔。
3. restart: 設置容器停止時自動重新啟動。
4. ports: 將容器的 MySQL 服務端口 3306 映射到主機的 3306 口，以便能夠從主機端連接到 MySQL。
5. volumes: 將主機的 ./mysql-data 目錄掛載到容器內的 /var/lib/mysql 目錄下。這樣可以保留 MySQL 的資料持久化，即使容器被刪除也不會遺失資料。
6. environment: 設定容器內的環境變數。這裡設定了 MySQL 的 root 密碼和要建立的資料庫名稱。

資料庫的帳號、密碼和名稱可以依照自己的需要來更改。
>environment:<br />
   MYSQL_ROOT_PASSWORD=root # 設置MySQL root密碼<br />
   MYSQL_DATABASE=qq # 資料庫名稱

## Dockerfile
1. FROM node:14：
FROM 指令指定了這個 Dockerfile 使用的基礎映像。在這裡，它使用官方的 Node.js 映像作為基礎，版本是 14。這表示應用程式將建立在 Node.js 14 的運行環境之上。
2. WORKDIR /usr/src/app：
WORKDIR 指令用於設定容器中的工作目錄。在這裡，它設置工作目錄為 /usr/src/app，這將是應用程式代碼的主要位置。
3. COPY package*.json ./：
COPY 指令將主機中的 package.json 和 package-lock.json 檔案複製到容器中的工作目錄。這麼做是為了讓 Docker 在建構映像時安裝應用程式所需的相依套件。
4. RUN npm install：
RUN 指令用於在容器內執行命令。在這裡，它執行 npm install 命令，安裝了在剛才複製進來的 package.json 中定義的相依套件。這個步驟將會在建立映像時執行。
5. COPY . .：
COPY 指令將目前目錄下的所有檔案複製到容器的工作目錄中。這個步驟將會把整個應用程式的代碼複製進容器中。
6. EXPOSE 3000：
EXPOSE 指令定義了容器執行的應用程式使用的端口號。在這裡，它設置容器內部使用的端口號為 3000，但這僅僅是一種宣告，並不會實際打開該端口。
7. CMD ["npm", "start"]：
CMD 指令定義了容器啟動時要運行的預設命令。在這裡，它設置容器啟動後要執行的指令是 npm start，這將啟動 Node.js 應用程式。

## .dockerignore
- node_modules：忽略整個 node_modules 目錄。
- .git：忽略 Git 相關的文件和目錄。
- .vscode：忽略 VS Code 相關的文件和目錄。
- logs/：忽略名為 logs 的目錄。
- *.log：忽略所有擴展名為 .log 的文件。

.dockerignore 文件會指示 Docker 在構建映像時忽略列出的文件或目錄。<br />
這對於減少構建上下文的大小、加快構建速度以及避免將不必要的文件包含到映像中都非常有用。
