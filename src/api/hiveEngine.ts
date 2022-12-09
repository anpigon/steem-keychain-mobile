const SSC = require('sscjs');
import axios from 'axios';

export default new SSC('https://api.steem-engine.net/rpc');

export const hiveEngineAPI = axios.create({
  baseURL: 'https://api.steem-engine.net/',
});
