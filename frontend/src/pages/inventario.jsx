import React, { useState } from 'react';
import { Box, Heading, Flex, Divider } from '@chakra-ui/react';
import ListProducts from '../components/inventario/listProducts';
import AddProduct from '../components/inventario/addProduct';
import AddCompra from '../components/inventario/addCompra';
import ModalHistorialCompra from '../components/inventario/modalHistorialCompras';
import SearchProducts from '../components/inventario/searchProduct';

export default function InventarioPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Box p={6}>
      <Flex justify="space-between">
        <Box flex="1" p={6} bg="white" boxShadow="lg" borderRadius="md" maxW="60%" mx="auto">
          <Flex justify="space-between" alignItems="center" mb={4}>
            <Heading as="h2" size="lg">
              Inventario
            </Heading>
            <SearchProducts onSearch={handleSearch} />
          </Flex>

          <ListProducts searchTerm={searchTerm} />
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
          maxH="200px"
        >
          <AddProduct />
          <Divider/>
          <br/>
          <AddCompra />
          <br/>
          <br/>
          <ModalHistorialCompra />
        </Box>
      </Flex>
    </Box>
  );
}