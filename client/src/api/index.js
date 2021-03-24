import axios from 'axios';

class ApiHandler {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api';
  }

  get(route, params = {}) {
    return axios.get(`${this.baseUrl}${route}`, {params});
  }

  post(route, data = {}, headers = {}) {
    return axios.post(`${this.baseUrl}${route}`, data, { headers });
  }

  put(route, data = {}, headers = {}) {
    return axios.put(`${this.baseUrl}${route}`, data, { headers });
  }
}


export default new ApiHandler();
