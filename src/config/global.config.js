import dotenv from "dotenv";
import path from "path";

let envPath = path.resolve(__dirname, path.join("..", "..", ".env"));
if (process.env.NODE_ENV == "production") {
    envPath = path.resolve(__dirname, path.join("..", ".env"));
}

dotenv.config({ path: envPath });
