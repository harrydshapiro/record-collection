import axios from "axios";

const client = axios.create({ baseURL: process.env.REACT_APP_SERVER_BASE })

export function getAlbums () {
  return client.get('/library/albums')
}