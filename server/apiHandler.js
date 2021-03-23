const axios = require('axios');

class ApiHandler {
  constructor() {
    this.baseUrl = 'https://uxcandy.com/~shapoval/test-task-backend/v2';
  }

  get(route, params = {}) {
    return axios.get(`${this.baseUrl}${route}`, {
      params: {
        ...params,
        developer: 'n.khlyustin'
      }
    });
  }

  post(route, data = {}, headers = {}) {
    return axios.post(`${this.baseUrl}${route}`, data, {
      headers,
      params: {
        developer: 'n.khlyustin'
      }
    });
  }
}

module.exports = new ApiHandler();
