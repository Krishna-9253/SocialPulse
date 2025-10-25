import React, { useState } from 'react';
import { Box, Heading, Input, Button, VStack, Text, Link, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: 'Please fill all fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast({
        title: 'Login successful!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (err) {
      toast({
        title: err.response?.data?.message || 'Login failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={8} bg="white" rounded="xl" shadow="md">
      <VStack spacing={4}>
        <Heading size="lg">Login</Heading>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button colorScheme="blue" w="full" onClick={handleLogin} isLoading={loading}>
          Login
        </Button>

        <Text fontSize="sm" pt={2}>
          Don't have an account?{' '}
          <Link as={RouterLink} to="/register" color="blue.500">
            Register
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}
