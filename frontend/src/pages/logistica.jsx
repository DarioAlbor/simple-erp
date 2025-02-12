import React from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import AddZona from '../components/zonas/addZona';
import ListZonas from '../components/zonas/listZonas';
import ListStock from '../components/zonas/listStock';
import AddSell from '../components/ventas/modalAddSell';

export default function LogisticaPage() {
  return (
    <Box p={6} ml="40px">
      <Flex 
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        wrap="wrap"
      >
        <Box
          flex={{ base: '1', md: '0.90' }}
          p={6}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
          mb={{ base: 4, md: 0 }}
        >
          <Flex justify="space-between" alignItems="center" mb={4}>
            <Heading as="h2" size="lg">
              Zonas
            </Heading>
          </Flex>
          <ListZonas />
        </Box>

        <Box
          flex={{ base: '1', md: '0.10' }}
          p={4}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
          maxH="160px"
          ml={{ md: 6 }}
        >
          <AddZona />
          <Box mt={4}>
            <AddSell />
          </Box>
        </Box>
      </Flex>

      <Box my={6}></Box>

      <Box
        p={5}
        bg="white"
        boxShadow="lg"
        borderRadius="md"
        w="100%"
      >
        <Flex justify="space-between" alignItems="center" mb={4}>
          <Heading as="h2" size="lg">
            Stock de zonas
          </Heading>
        </Flex>
        <ListStock />
      </Box>
    </Box>
  );
}