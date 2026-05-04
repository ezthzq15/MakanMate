import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Alert,
  Stack,
  Anchor,
  Center,
  Popover,
  Progress,
  Box,
} from '@mantine/core';
import { 
  IconCheck, 
  IconX, 
  IconBowl, 
  IconMail, 
  IconLock, 
  IconUser,
  IconCompass,
  IconChevronRight
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useRegister } from '../../hooks/auth/useRegister';

const PasswordRequirement = ({ meets, label }) => (
  <Text 
    c={meets ? 'teal' : 'red'} 
    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }} 
    mt="xs"
  >
    {meets ? <IconCheck size={14} stroke={3} /> : <IconX size={14} stroke={3} />}
    {label}
  </Text>
);

export function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [popoverOpened, setPopoverOpened] = useState(false);

  const checks = [
    { label: 'Includes at least 8 characters', meets: formData.userPassword.length >= 8 },
    { label: 'Includes number', meets: /[0-9]/.test(formData.userPassword) },
    { label: 'Includes lowercase letter', meets: /[a-z]/.test(formData.userPassword) },
    { label: 'Includes uppercase letter', meets: /[A-Z]/.test(formData.userPassword) },
    { label: 'Includes special symbol', meets: /[^A-Za-z0-9]/.test(formData.userPassword) },
  ];

  const strength = checks.filter(c => c.meets).length;
  const color = strength === 5 ? 'teal' : strength > 2 ? 'yellow' : 'red';

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.userName || !formData.userEmail || !formData.userPassword || !formData.confirmPassword) {
      setValidationError('All fields are required.');
      return;
    }

    if (formData.userPassword !== formData.confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (!validatePassword(formData.userPassword)) {
      setValidationError('Password must be at least 8 characters, include uppercase, lowercase, number and special character.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.userName,
          userEmail: formData.userEmail,
          userPassword: formData.userPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Registration failed');
      }

      notifications.show({
        title: 'Success',
        message: 'Registration successful! Please log in.',
        color: 'green'
      });
      navigate('/auth/login');
    } catch (error) {
      setValidationError(error.message);
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper 
      p={40} 
      style={{ 
        width: '100%', 
        maxWidth: '520px', 
        backgroundColor: '#FFFFFF',
        boxShadow: '0 40px 120px rgba(0,0,0,0.5)',
        zIndex: 100,
        borderRadius: '40px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack align="center" mb={25}>
        <Box style={{ position: 'relative', height: '60px', width: '100px', display: 'flex', justifyContent: 'center' }}>
          <IconBowl size={32} color="#0A4337" stroke={2} />
          <Box style={{ position: 'absolute', top: '10px', right: '0', opacity: 0.3 }}>
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <path d="M0,10 Q10,0 20,10 T40,10" stroke="#0A4337" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </Box>
        </Box>
        <Title order={2} fw={900} style={{ color: '#0A4337', fontSize: '32px', marginBottom: '5px' }}>
          Create an Account
        </Title>
        <Text c="dimmed" size="sm" ta="center" style={{ fontSize: '15px' }}>
          Join <span style={{ fontWeight: 800, color: '#333' }}>MakanMate</span> and discover great food
        </Text>
      </Stack>

      {validationError && (
        <Alert color="red" mb="md" variant="light">
          {validationError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap={20}>
          <Box>
            <Text size="14px" fw={700} color="#333" mb={8}>Full Name <span style={{ color: 'red' }}>*</span></Text>
            <TextInput
              placeholder="John Hamsten"
              value={formData.userName}
              onChange={(event) => setFormData({...formData, userName: event.currentTarget.value})}
              required
              size="md"
              variant="default"
              leftSection={<IconUser size={18} color="#bbb" />}
              styles={{
                input: { 
                  borderRadius: '25px', 
                  border: '1.5px solid #eee',
                  fontSize: '14px',
                  height: '50px',
                  backgroundColor: '#fff'
                }
              }}
            />
          </Box>

          <Box>
            <Text size="14px" fw={700} color="#333" mb={8}>Email <span style={{ color: 'red' }}>*</span></Text>
            <TextInput
              placeholder="@gmail.com"
              value={formData.userEmail}
              onChange={(event) => setFormData({...formData, userEmail: event.currentTarget.value})}
              required
              size="md"
              variant="default"
              leftSection={<IconMail size={18} color="#bbb" />}
              styles={{
                input: { 
                  borderRadius: '25px', 
                  border: '1.5px solid #eee',
                  fontSize: '14px',
                  height: '50px',
                  backgroundColor: '#fff'
                }
              }}
            />
          </Box>

          <Box>
            <Text size="14px" fw={700} color="#333" mb={8}>Password <span style={{ color: 'red' }}>*</span></Text>
            <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }} radius="lg">
              <Popover.Target>
                <PasswordInput
                  placeholder="••••••••••••••"
                  value={formData.userPassword}
                  onChange={(event) => setFormData({...formData, userPassword: event.currentTarget.value})}
                  onFocus={() => setPopoverOpened(true)}
                  onBlur={() => setPopoverOpened(false)}
                  required
                  size="md"
                  variant="default"
                  leftSection={<IconLock size={18} color="#bbb" />}
                  styles={{
                    input: { 
                      borderRadius: '25px', 
                      border: '1.5px solid #eee',
                      fontSize: '14px',
                      height: '50px',
                      backgroundColor: '#fff'
                    },
                    innerInput: { height: '48px' }
                  }}
                />
              </Popover.Target>
              <Popover.Dropdown p="md" style={{ backgroundColor: '#fff', borderColor: '#eee' }}>
                <Progress color={color} value={strength * 20} size="xs" mb="md" />
                {checks.map((check, index) => (
                  <PasswordRequirement key={index} label={check.label} meets={check.meets} />
                ))}
              </Popover.Dropdown>
            </Popover>
          </Box>

          <Box>
            <Text size="14px" fw={700} color="#333" mb={8}>Confirm Password <span style={{ color: 'red' }}>*</span></Text>
            <PasswordInput
              placeholder="••••••••••••••"
              value={formData.confirmPassword}
              onChange={(event) => setFormData({...formData, confirmPassword: event.currentTarget.value})}
              required
              size="md"
              variant="default"
              leftSection={<IconLock size={18} color="#bbb" />}
              styles={{
                input: { 
                  borderRadius: '25px', 
                  border: '1.5px solid #eee',
                  fontSize: '14px',
                  height: '50px',
                  backgroundColor: '#fff'
                },
                innerInput: { height: '48px' }
              }}
            />
          </Box>

          {/* Green Adventure Box */}
          <Box 
            p="sm" 
            style={{ 
              backgroundColor: '#eff6f0', 
              borderRadius: '16px', 
              border: '1px solid #e0ede1',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Center style={{ width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', border: '1px solid #d0e4d2' }}>
              <IconCompass size={20} color="#4c7c54" stroke={2.5} />
            </Center>
            <Box>
              <Text size="13px" fw={800} color="#2c4c32">Start your food adventure today</Text>
              <Text size="11px" color="#5c7c64">Find, taste and share the world's best bites!</Text>
            </Box>
            <Box style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.2 }}>
               <svg width="40" height="40" viewBox="0 0 40 40">
                 <path d="M0,40 Q10,20 30,30 T40,0" stroke="#4c7c54" strokeWidth="2" fill="none" />
               </svg>
            </Box>
          </Box>

          <Button 
            type="submit" 
            fullWidth 
            size="xl"
            radius="xl"
            loading={loading}
            mt={10}
            style={{ 
              backgroundColor: '#094033', 
              fontWeight: 800,
              height: '56px',
              fontSize: '17px',
              boxShadow: '0 10px 30px rgba(9, 64, 51, 0.3)'
            }}
          >
            Sign Up
          </Button>

          <Center mt="xs">
            <Text size="sm" c="dimmed">
              Already have an account?{' '}
              <Anchor size="sm" fw={800} component={Link} to="/auth/login" style={{ color: '#0A4337', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Sign In <IconChevronRight size={14} stroke={3} />
              </Anchor>
            </Text>
          </Center>
        </Stack>
      </form>
    </Paper>
  );
}
