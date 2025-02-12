import React from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  VStack,
} from '@chakra-ui/react';


export default function HousekeepingPage() {
  return (
    <>
        <Flex
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          align="center"
          justify="center"
          bg="linear-gradient(135deg, #2D3748 0%, #4A5568 100%)"
          color="white"
        >
          <VStack spacing={8}>
            <Box textAlign="center">
              <Heading as="h1" size="2xl" mb={4}>
                ¡Bienvenido al panel de gestión interna!
              </Heading>
              <Text fontSize="lg">
                Administra y supervisa todas las operaciones del software 🛠️
              </Text>
            </Box>
          </VStack>
        </Flex>
    </>
  );
}