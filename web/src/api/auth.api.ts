import client from './client';

export const register = (email: string, password: string) =>
  client.post('/auth/register', { email, password }).then((res) => res.data);

export const login = (email: string, password: string) =>
  client.post('/auth/login', { email, password }).then((res) => res.data);

export const logout = () =>
  client.post('/auth/logout').then((res) => res.data);
