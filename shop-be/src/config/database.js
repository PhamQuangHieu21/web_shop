import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    charset: "utf8mb4",
});

(async () => {
    try {
        console.log("Connect to MySQL SUCCESS");
    } catch (err) {
        console.error("Error when connecting to MySQL: ", err);
    }
})();

export default pool;
