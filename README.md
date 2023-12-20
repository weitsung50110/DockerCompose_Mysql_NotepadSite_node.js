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

