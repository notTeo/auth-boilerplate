import { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      {error && <p>{(error as any).response?.data?.message ?? 'Something went wrong'}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
      <a href={`${import.meta.env.VITE_API_URL}/auth/google`}>Login with Google</a>
      <Link to="/register">Don't have an account?</Link>
      <Link to="/forgot-password">Forgot password?</Link>
    </form>
  );
}
