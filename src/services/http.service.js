import axios from "axios";

const $http = axios.create({
    baseURL: process.env.SG_URL || "",
    headers: {
        Authentication: `Bearer ${process.env.SG_KEY}`,
        Aceept: "application/json",
        "Content-Type": "application/json",
    },
});

export default $http;
