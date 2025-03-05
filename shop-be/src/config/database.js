import mysql from "mysql2/promise";

const connection = mysql.createPool({
    host: "127.0.0.1",
    port: 3306, // default port 3306
    user: "root", // default user is empty
    database: "shop",
    password: "nigma1357",
    charset: "utf8mb4",
});

(async () => {
    try {
        console.log("Connect to MySQL successfully");
    } catch (err) {
        console.error("Error connecting to MySQL: ", err);
    }
})();

export default connection;
