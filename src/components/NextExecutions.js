// src/components/NextExecutions.js
import { Box, VStack, Text, Heading, List, ListItem } from '@chakra-ui/react';

const NextExecutions = ({ executionTimes, explanation }) => {
  return (
    <Box w="full" maxW="600px" p={6} borderWidth={1} borderRadius="lg">
      <VStack align="stretch" spacing={4}>
        {explanation && (
          <Box>
            <Heading size="sm" mb={2}>Explanation</Heading>
            <Text>{explanation}</Text>
          </Box>
        )}
        
        {executionTimes.length > 0 && (
          <Box>
            <Heading size="sm" mb={2}>Next 5 Execution Times</Heading>
            <List spacing={2}>
              {executionTimes.map((time, index) => (
                <ListItem key={index}>
                  {time}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default NextExecutions;