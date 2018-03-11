import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const config = () => {
  return {
    headers: { Authorization: token },
  };
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const setToken = newToken => {
  token = `bearer ${newToken}`;
};

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject, config());
  return response.data;
};

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config());
  return response.data;
};

const remove = async id => {
  const response = await axios.delete(`${baseUrl}/${id}`, config());
  return response.data;
};

export default { getAll, create, update, remove, setToken };
