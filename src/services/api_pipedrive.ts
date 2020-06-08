import axios from 'axios';


//'https://linkapi7.pipedrive.com/api/v1/deals/?api_token=2426b4267050ad2aeb0274c538383ee5c969bb20'
const api = axios.create({
    baseURL: 'https://linkapi7.pipedrive.com/api/v1/'
});

export default api;