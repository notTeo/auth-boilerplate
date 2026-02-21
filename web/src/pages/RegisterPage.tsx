import { useState } from 'react';
import { useRegister } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      {error && <p>{(error as any).response?.data?.message ?? 'Something went wrong'}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Registering...' : 'Register'}
      </button>
      <Link to="/login">Already have an account?</Link>
    </form>
  );
}
