import axios from 'axios';

export default axios.create({
  baseURL: 'https://astroreha.herokuapp.com/api/v1',
});
