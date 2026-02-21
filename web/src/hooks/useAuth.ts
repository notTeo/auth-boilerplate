import { useMutation } from '@tanstack/react-query';
import { login, register } from '../api/auth.api';
import { authStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      authStore.setToken(data.data.accessToken);
      navigate('/dashboard');
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      register(email, password),
    onSuccess: () => {
      navigate('/verify-email');
    },
  });
};
