import React, { useState } from 'react';
import { Box, Heading, Input, Button, VStack, Text, Link, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
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
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });

      toast({
        title: 'Registration successful!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/'); // Redirect to login page
    } catch (err) {
      toast({
        title: err.response?.data?.message || 'Registration failed',
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
        <Heading size="lg">Register</Heading>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Button colorScheme="green" w="full" onClick={handleRegister} isLoading={loading}>
          Register
        </Button>

        <Text fontSize="sm" pt={2}>
          Already have an account?{' '}
          <Link as={RouterLink} to="/" color="blue.500">
            Login
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}
