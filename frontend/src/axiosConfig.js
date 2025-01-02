import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  }
});

export default Axios;
