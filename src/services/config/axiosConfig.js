import axios from 'axios';

const api = axios.create({
    baseURL: "https://06mtgz5m-5000.asse.devtunnels.ms/api",
    headers: {
        "Content-Type": "application/json",
    },
}); 

export default api;
