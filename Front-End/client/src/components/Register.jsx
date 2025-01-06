import React, { useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adjust the URL to your API's registration endpoint
      const { data } = await axios.post('http://localhost:5000/register', { username, password, email });
      console.log('Registration successful', data);
      toast({
        title: 'Registration successful',
        description: "You're now registered. Please log in.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      navigate('/login'); 
    } catch (error) {
      console.error('Registration failed', error.response.data);
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'An error occurred during registration.',
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
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color='orange.200'>Create your account</Heading>
        </Stack>
        <Box
          as="form"
          rounded={'lg'}
          bg={useColorModeValue('white', 'black')}
          boxShadow={'lg'}
          p={8}
          onSubmit={handleSubmit}
          border="1px solid"
          borderColor="orange.200">
          <Stack spacing={4}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Stack spacing={10}>
              <Button
                type="submit"
                bg={'orange.400'}
                color={'white'}
                _hover={{
                  bg: 'orange.500',
                }}>
                Register
              </Button>
              <Text textAlign="center">
                Already have an account? <Link to="/login" style={{ color: 'blue.400' }}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}