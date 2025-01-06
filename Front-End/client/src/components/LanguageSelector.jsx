import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useState } from 'react';
import { FaCode } from 'react-icons/fa';

const LanguageSelector = ({ onLanguageChange }) => {
  const languages = ['c', 'clojure', 'cpp', 'csharp', 'css', 'go', 'html', 'ini', 'java', 'javascript', 'json','kotlin', 'lua', 'markdown', 'pascal', 'php', 'plaintext', 'python', 'rust', 'scheme','shell', 'typescript'];
  return (
    <Box>
      <Menu>
        <MenuButton as={Button} leftIcon={<FaCode />} colorScheme="orange">
          Languages
        </MenuButton>
        <MenuList style={{
          backgroundColor: '#5D350E', // Use a CSS color value
          borderColor: 'black' // Use a CSS color value
        }}>
        {languages.map((language, index) => (
          <MenuItem 
            key={index} 
            onClick={() => onLanguageChange(language)}
            style={{
              backgroundColor: '#5D350E', // Normal state background
              color: 'white' // Text color
            }}
            _hover={{
              backgroundColor: '#EB8143 !important', // Hover state background
              color: 'white' // Hover state text color
            }}
          >
            {language}
          </MenuItem>
        ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;