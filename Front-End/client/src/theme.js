import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    config: {
        initialColorMode: "dark", // Set default to dark
        useSystemColorMode: false,
    },
    styles: {
        global: {
            body: {
                backgroundColor: "black",
            },
        },
    },
    components: {
        Sidebar: {
            baseStyle: ({ colorMode }) => ({
                bg: colorMode === 'dark' ? 'black' : 'white', // Custom background color
                color: colorMode === 'dark' ? 'gold' : 'gray.800', // Custom text color
                borderColor: colorMode === 'dark' ? 'beige' : 'gray.200', // Custom border color
            }),
        },
    },
    colors: {
        black: "#19120A",
        gold: "#FFD700", // Example gold color
        beige: "#CFC1B1",
        brown: "#A4642C",
    },
});
export default theme;