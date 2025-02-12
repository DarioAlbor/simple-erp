import React from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import AddSell from '../components/ventas/modalAddSell';
import LastSells from '../components/ventas/listLastSells';

export default function LogisticaPage() {

  return (
    <Box p={6}>
      <Flex justify="space-between">
        <Box flex="1" p={6} bg="white" boxShadow="lg" borderRadius="md" maxW="80%" mx="auto">
          <Flex justify="space-between" alignItems="center" mb={4}>
            <Heading as="h2" size="lg">
              Pedidos
            </Heading>
          </Flex>
          <LastSells />
        </Box>

        <Box
          p={4}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
          ml={6}
          maxW="auto"
          maxH="80px"
        >
            <AddSell />
        </Box>
      </Flex>
    </Box>
  );
}