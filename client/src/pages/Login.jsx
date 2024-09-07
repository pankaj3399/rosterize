import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import companyLogo from '../assets/rosterize.png';
import { login } from '../api/Auth';
import { Link } from 'react-router-dom';

import {useAuth} from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate();

  const { setAuth } = useAuth();
  
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if(data && data.user){
        localStorage.setItem('token', data.token);
        setAuth(data);
      }
      navigate('/');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <img src={companyLogo} width="60px" alt="Logo" className="mx-auto" />
          <h1 className="text-2xl font-bold">Login</h1>
        </div>
        <div className="grid gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            required
          />
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="btn bg-blue-600 text-white"
            disabled={mutation.isLoading}
          >
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <Link to="/forgot-password" className="text-blue-600 text-sm">
          Forgot Password?
        </Link>
        {mutation.isError && <p className="text-red-500 text-sm mt-2">{mutation.error.message}</p>}
      </form>
    </div>
  );
}
