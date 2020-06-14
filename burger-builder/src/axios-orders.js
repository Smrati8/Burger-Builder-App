import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-9470c.firebaseio.com/'
});

export default instance;