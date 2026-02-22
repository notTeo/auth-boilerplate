import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '../api/auth.api';
import '../styles/pages/verify-email.css';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully. You can now log in.');
      })
      .catch((err: any) => {
        setStatus('error');
        setMessage(err.response?.data?.message ?? 'Verification failed.');
      });
  }, [searchParams]);

  return (
    <div className="page">
      <div className="card">
        <h1>Email Verification</h1>
        {status === 'loading' && <p className="verify-email-status">Verifying...</p>}
        {status === 'success' && (
          <>
            <div className="alert alert-success">{message}</div>
            <Link to="/login"><button className="btn btn-primary">Go to Login</button></Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="alert alert-error">{message}</div>
            <Link to="/register"><button className="btn btn-ghost">Back to Register</button></Link>
          </>
        )}
      </div>
    </div>
  );
}
