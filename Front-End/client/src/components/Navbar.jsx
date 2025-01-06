'use client'

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode, 
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'
import { Icon } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { CiUser } from "react-icons/ci";

import { useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

const NavLink = ({ children }) => {
    return (
      <Box
        as="a"
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}>
        {children}
      </Box>
    )
  }


  NavLink.propTypes = {
    children: PropTypes.node.isRequired,
  }
export default function WithAction({onLanguageChange, toggleColorMode, onNewClick, onSaveClick}) { // Added toggleColorMode prop and onNewClick, onSaveClick for buttons
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode } = useColorMode(); // Added useColorMode hook for colorMode state

  const navigate = useNavigate();

  return (
    
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
         
            <Box>CSM</Box>
            <Button onClick={toggleColorMode}> {/* Added Toggle Light/Dark button */}
              Toggle {colorMode === "light" ? "Dark" : "Light"}
            </Button>

            {/*
            <Button leftIcon={<AddIcon />} onClick={onNewClick}> {/* Added New button * /}
              New
            </Button>
            <Button onClick={onSaveClick}> {/* Added Save button * /}
              Save
            </Button>
            */}
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
           
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
          <LanguageSelector onLanguageChange={onLanguageChange} /> {/* Insert language handler*/}
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Icon as={CiUser} boxSize={6} />

              </MenuButton>
              
              <MenuList>
                
                <MenuDivider />

              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
         
            </Stack>
          </Box>
        ) : null}
      </Box>

    </>
  )
}
