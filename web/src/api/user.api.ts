import client from './client';

export const getMe = () =>
  client.get('/user/me').then((res) => res.data.data);