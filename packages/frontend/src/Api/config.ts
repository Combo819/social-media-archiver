import axios from 'axios';

const BASE_URL = '';

axios.defaults.baseURL = BASE_URL + '/api';

export { axios, BASE_URL };
