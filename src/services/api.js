import axios from 'axios' 
const api = axios.create({ 
  baseURL: 'http://localhost:9091/guardia-api', 
  headers: { 'Content-Type': 'application/json' } 
}) 
export default api 
