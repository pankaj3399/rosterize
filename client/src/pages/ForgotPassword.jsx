import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import companyLogo from '../assets/rosterize.png';
import { sendResetCode, resetPassword } from '../api/Auth';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [passcode, setPasscode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Mutation to send reset code
  const sendCodeMutation = useMutation({
    mutationFn: sendResetCode,
    onSuccess: () => setStep(2),
    onError: (error) => {
      setErrorMessage(error.message);
      console.error('Failed to send code:', error);
    },
  });

  // Mutation to reset password
  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setSuccessMessage('Password reset successful');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      console.error('Failed to reset password:', error);
    },
  });

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    sendCodeMutation.mutate({ email });
  };

  useEffect(() => {
    console.log('Passcode:', passcode);
  }, [passcode]);
  const handleSubmitPassword = (e) => {
    e.preventDefault();
    resetPasswordMutation.mutate({ email, password: newPassword, code: passcode });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <img src={companyLogo} width="60px" alt="Logo" className="mx-auto" />
          <h1 className="text-2xl font-bold">{step === 1 ? 'Forgot Password' : step === 2 ? 'Enter Code' : 'Reset Password'}</h1>
        </div>
        {step === 1 && (
          <form onSubmit={handleSubmitEmail}>
            <div className="grid gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input"
                required
              />
            </div>
            <div className="flex justify-center mt-6">
              <button type="submit" className="btn bg-blue-600 text-white" disabled={sendCodeMutation.isLoading}>
                {sendCodeMutation.isPending ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleSubmitPassword}>
            <div className="grid gap-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="input"
                required
              />
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter 4-digit code"
                className="input"
                required
              />
            </div>
            <div className='grid gap-4'></div>
            <div className="flex justify-center mt-6">
              <button type="submit" className="btn bg-blue-600 text-white" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
        {errorMessage && <div className="mt-4 text-red-500 text-center">{errorMessage}</div>}
      </div>
    </div>
  );
}
