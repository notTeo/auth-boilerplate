import { useUser } from '../hooks/useUser';
import { authStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function DashboardPage() {
  const { data: user, isLoading } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await client.post('/auth/logout');
    authStore.clearToken();
    navigate('/login');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
