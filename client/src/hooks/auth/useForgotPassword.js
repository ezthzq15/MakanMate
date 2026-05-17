import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../lib/apiClient';

const TWO_FACTOR_TIMER = 120; // 120 seconds (2 minutes)

const useForgotPassword = (props = {}) => {
  const [step, setStep] = useState('find-account'); // 'find-account' | 'verify-code' | 'reset-password'
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [resetPasswordError, setResetPasswordError] = useState(null);
  const navigate = useNavigate();

  // Timer state
  const [timer, setTimer] = useState(TWO_FACTOR_TIMER);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (step === 'verify-code' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Step 1: Find Account
  const findAccountForm = useForm({
    initialValues: {
      usr_email: '',
    },
    validate: {
      usr_email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleFindAccount = async (values) => {
    setIsLoading(true);
    if (props.onMutate) props.onMutate();
    try {
      const response = await apiClient.post('/auth/forgot-password', {
        userEmail: values.usr_email
      });
      
      setUserEmail(values.usr_email);
      setStep('verify-code');
      setTimer(TWO_FACTOR_TIMER);
      setCanResend(false);
      if (props.onSuccess) props.onSuccess();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || error.message || 'An error occurred. Please try again.';
      findAccountForm.setFieldError('usr_email', message);
      if (props.onError) props.onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (otp) => {
    setIsLoading(true);
    setOtpError(null);
    if (props.onMutate) props.onMutate();
    
    try {
      const response = await apiClient.post('/auth/verify-otp', {
        userEmail,
        otp
      });
      
      setUserId(response.data.userID);
      setStep('reset-password');
      if (props.onSuccess) props.onSuccess();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || error.message || 'Invalid OTP code';
      setOtpError(message);
      if (props.onError) props.onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', {
        userEmail
      });
      setTimer(TWO_FACTOR_TIMER);
      setCanResend(false);
      setOtpError(null);
    } catch (error) {
      console.error(error);
      setOtpError(error.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordForm = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (val) => {
        if (val.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(val)) return 'Password must include at least one uppercase letter';
        if (!/[a-z]/.test(val)) return 'Password must include at least one lowercase letter';
        if (!/[0-9]/.test(val)) return 'Password must include at least one number';
        if (!/[^a-zA-Z0-9]/.test(val)) return 'Password must include at least one symbol (!@#$%^&*()_+{}[]|:;<>?,.-)';
        return null;
      },
      confirmPassword: (val, values) =>
        val !== values.password ? 'Passwords do not match' : null,
    },
  });

  const handleResetPassword = async (values) => {
    setIsLoading(true);
    setResetPasswordError(null);
    if (props.onMutate) props.onMutate();
    
    try {
      await apiClient.post('/auth/reset-password', {
        userID: userId,
        newPassword: values.password
      });
      
      alert('Password reset successful! Redirecting to login...');
      navigate('/auth/login', { replace: true });
      if (props.onSuccess) props.onSuccess();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || error.message || 'Failed to reset password';
      setResetPasswordError(message);
      if (props.onError) props.onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnToLogin = () => {
    navigate('/auth/login', { replace: true });
  };

  return {
    step,
    userEmail,
    isLoading,
    otpError,
    findAccountForm,
    handleFindAccount,
    handleVerifyCode,
    handleReturnToLogin,
    resetPasswordForm,
    handleResetPassword,
    timer,
    canResend,
    handleResend,
    resetPasswordError
  };
};

export default useForgotPassword;
