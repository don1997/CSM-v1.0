import React from 'react';
import {
  Box,
  Flex,
  Button,
  useColorMode,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { FaSave, FaEdit, FaMoon, FaSun, FaPlus } from 'react-icons/fa';
import LanguageSelector from './LanguageSelector'; // Ensure this import is correct

const CustomNavbar = ({ onSaveClick, onUpdateClick, onEditMarkdownClick, onLanguageChange, LogoutButton, onNewSnippet }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex bg={useColorModeValue('gray.100', 'black')} p={4} justifyContent="space-between" alignItems="center" borderBottom="1px" borderColor="gray.700">
      <Flex alignItems="center" flexGrow={1}>

        <Button leftIcon={<FaPlus />} onClick={onNewSnippet} mr={3}  colorScheme="orange">New</Button>

        <Button leftIcon={<FaSave />} onClick={onSaveClick} mr={3}  colorScheme="orange">Save</Button>
        <LanguageSelector onLanguageChange={onLanguageChange} />
        <Button leftIcon={<FaEdit />} onClick={onEditMarkdownClick} colorScheme="orange" ml={3}>Edit Markdown</Button>

      </Flex>
      <Flex>
        {LogoutButton}
      </Flex>
    </Flex>
  );
};

export default CustomNavbar;