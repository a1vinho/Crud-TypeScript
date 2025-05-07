import mysql from 'mysql2/promise';
import "dotenv/config";

console.log(process.env)

if (
    !process.env.DATABASE 
    || 
    !process.env.HOST
    || 
    !process.env.PORT_DB
    || 
    !process.env.USERDB
    || 
    !process.env.PASSWORD
) {
    throw new Error('Váriaveis de ambientes incorretas.')
}

export default mysql.createPool({
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: 3306,
    user: process.env.USERDB,
    password: process.env.PASSWORD,
    connectionLimit: 10,
});