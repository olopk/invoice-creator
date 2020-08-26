import axios from 'axios';

let headers = { 'content-type': 'application/json'}

const axiosInstance = axios.create({
    // baseURL: 'https://powerful-lake-55337.herokuapp.com',
    baseURL: 'http://127.0.0.1:8080',
    headers: headers
})
   
axiosInstance.interceptors.request.use(function(config) {    
    const token = localStorage.getItem('token');
    if(token){
            config.headers = {
            ...config.headers,
            'Authorization': 'Bearer '+token
        }
    }
        return config;
    }, function(error) {
        return Promise.reject(error);
});

export default axiosInstance;