import { Box, HStack, Text, IconButton, Menu, MenuButton, MenuList, MenuItem, useColorModeValue, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const ActivityBar = ({ language, line, column, onLanguageChange }) => {
  const languages = ['c', 'clojure', 'cpp', 'csharp', 'css', 'go', 'html', 'ini', 'java', 'javascript', 'json','kotlin', 'lua', 'markdown', 'pascal', 'php', 'plaintext', 'python', 'rust', 'scheme','shell', 'typescript'];

  return (
    <Box
      bg={useColorModeValue('gray.100', '#5F370E')}
      w="100vw"
      h="2rem"
      padding="0 1rem"
      textAlign="center"
    >
      <HStack spacing={4} justifyContent="flex-end">
        <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="s" padding="0" height="auto" lineHeight="normal">
          {language}
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
        <Text fontSize="sm">Ln {line}</Text>
        <Text fontSize="sm">Col {column}</Text>
      </HStack>
    </Box>
  );
};

export default ActivityBar;