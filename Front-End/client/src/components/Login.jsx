import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, Heading, useColorModeValue, useToast, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from './AuthContext'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/login', { username, password });
      console.log('Login successful', data);
      login(data.access_token); // Use the login function from context
      localStorage.setItem('authToken', data.access_token); // persist authToken

      navigate('/main');
    } catch (error) {
      console.error('Login failed', error.response.data);
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'An error occurred during login.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'black')}>
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color='orange.200'>Sign in to your account</Heading>
        </Stack>
        <Box
          as="form"
          rounded={'lg'}
          bg={useColorModeValue('white', 'black')}
          boxShadow={'lg'}
          p={8}
          border="1px solid" // Add border property
          borderColor="orange.200" // Set the border color to gold
          onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} // Ensure this matches
              />
            </FormControl>
              <Stack spacing={6}>
                <Button
                  type="submit"
                  bg={'orange.400'}
                  color={'white'}
                  _hover={{
                    bg: 'orange.500',
                  }}>
                  Sign in
                </Button>
                <Text textAlign="center">
                  Don't have an account? <Link to="/register" style={{ color: 'blue.400' }}>Register</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }