import axios from 'axios';

class ApiHandler {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api';
  }

  get(route, params = {}) {
    return axios.get(`${this.baseUrl}${route}`, {params});
  }

  post(route, data = {}) {
    return axios.post(`${this.baseUrl}${route}`, data);
  }
}


export default new ApiHandler();
