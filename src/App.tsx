import { ChakraProvider, Box } from "@chakra-ui/react";
import { TypingTest } from "./components/TypingTest";

function App() {
  return (
    <ChakraProvider>
      <Box minH="100vh" w="100%" bg="transparent">
        <TypingTest />
      </Box>
    </ChakraProvider>
  );
}

export default App;
