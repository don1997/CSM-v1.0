'use client'

import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

export default function CallToActionWithAnnotation() {


  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Code with <br />
            <Text as={'span'} color={'yellow.700'}>
              CSM
            </Text>
          </Heading>
          <Text color={'gray.500'}>
          “I think that it’s extraordinarily important that we in computer science keep fun in computing. 
          When it started out it was an awful lot of fun. Of course the paying customers got shafted every now and 
          then and after a while we began to take their complaints seriously. We began to feel as if we really were 
          responsible for the successful error-free perfect use of these machines. I don’t think we are. I think we’re 
          responsible for stretching them setting them off in new directions and keeping fun in the house. I hope the 
          ﬁeld of computer science never loses its sense of fun. Above all I hope we don’t become missionaries. Don’t 
          feel as if you’re Bible sales-men. The world has too many of those already. What you know about computing 
          other people will learn. Don’t feel as if the key to successful computing is only in your hands. What’s in your 
          hands I think and hope is intelligence: 
            <Text as={'span'} color={'yellow.700'}> the ability to see the machine as more than when you were ﬁrst led up to 
          it that you can make it more.”
          ― Alan J. Perlis
            </Text>
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button
              onClick={navigateToLogin}
              colorScheme={'orange'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'orange.500',
              }}>
              Go to Login
            </Button>


            <Box>
              <Icon
                as={Arrow}
                color={useColorModeValue('gray.800', 'gray.300')}
                w={71}
                position={'absolute'}
                right={-71}
                top={'10px'}
              />

            </Box>
          </Stack>
        </Stack>
      </Container>
    </>
  )
}

//Remove this
const Arrow = createIcon({
  displayName: 'Arrow',
  viewBox: '0 0 72 24',
  path: (
    <path
  
    />
  ),
})
