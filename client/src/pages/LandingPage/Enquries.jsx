import React from 'react';
import { useNavigate } from 'react-router-dom';
import companyLogo from '../../assets/rosterize.png';
import Loader from '../../Components/Loader/Loader';
import { useMutation } from '@tanstack/react-query';
import { enquire } from '../../api/Public';

export default function EnquiriesPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState(null);

  const submitEnquiry = useMutation({
    mutationFn: enquire,
    onSuccess: () => {
      setErrorMessage(null);
      setSuccessMessage('Enquiry sent successfully');
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    },
    onError: (error) => {
      setSuccessMessage(null);
      setErrorMessage(error.message);
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };
    submitEnquiry.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
            <img src={companyLogo} width="60px" alt="Logo" className="mx-auto" />
          <h1 className="text-2xl font-bold">Enquiries</h1>
        </div>
        <div className="grid gap-4">
          <label>
            Name:
            <input
              type="text"
              name="name"
              className="input"
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              className="input"
              required
            />
          </label>
          <label>
            Company:
            <input
              type="text"
              name="company"
              className="input"
              required
            />
          </label>
          <label>
            Subject:
            <input
              type="text"
              name="subject"
              className="input"
              required
            />
          </label>
          <label>
            Message:
            <textarea
              name="message"
              className="input"
              rows="4"
              required
            ></textarea>
          </label>
        </div>
        <div className="flex justify-center mt-6 gap-2">
          <button
            type="submit"
            className="btn bg-blue-900 text-white w-full py-2 mb-2"
            disabled={submitEnquiry.isPending}
          >
            {submitEnquiry.isPending ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            className="btn bg-gray-800 text-white w-full py-2 mb-2"
            onClick={() => navigate(-1)} 
          >
            Back
          </button>
        </div>
        {errorMessage && <div className="text-red-500 text-center mt-4">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 text-center mt-4">{successMessage}</div>}

      </form>
    </div>
  );
}
