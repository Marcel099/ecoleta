import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3333'   // ? se precisar trocar o domínio hospedado basta vir trocar aqui
})

export default api;
