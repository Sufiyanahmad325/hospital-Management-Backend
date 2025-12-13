import { configDotenv } from "dotenv";
import app from "./app.js";
import connectionWithDB from "./src/DB/DBConnection.js";

configDotenv();


const PORT = process.env.PORT || 8000;

connectionWithDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
        });
})