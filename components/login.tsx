import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: white;
`;

const LoginFormContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputField = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  
  &::placeholder {
    color: white;
  }
`;

const LoginButton = styled.button`
  background-color: #ffa500;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #ff8c00;
  }
`;

const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
  max-width: 400px;
`;

const ForgotPassword = styled.a`
  color: #666;
  font-size: 0.875rem;
  text-align: right;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: -0.5rem;
`;

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    setError('');
    login(email);
    navigate('/');
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log('Google Sign-In Success:', credentialResponse);
    login(email); // Use the email from Google response
    navigate('/');
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In Failed');
  };

  return (
    <LoginContainer>
      <LoginFormContainer>
        <Heading>Login</Heading>
        <LoginForm onSubmit={handleSubmit}>
          <InputField
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <LoginButton type="submit">Log In</LoginButton>
          <ForgotPassword href="#">Forgot Password?</ForgotPassword>
        </LoginForm>
      </LoginFormContainer>

      <SocialLoginContainer>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          size="large"
          width="400"
          text="continue_with"
        />
      </SocialLoginContainer>
    </LoginContainer>
  );
};

export default Login;
