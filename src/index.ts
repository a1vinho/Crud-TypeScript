import express from "express";
import router from "./routers/router";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(router);

const PORT = 8080;
app.listen(8080,() => {
    console.log('Server Runnin ' + PORT);
});