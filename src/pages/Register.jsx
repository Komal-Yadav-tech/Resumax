import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Register = ({ onNavigate }) => {
  return <RegisterForm onNavigate={onNavigate} />;
};
