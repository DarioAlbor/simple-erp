import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box } from '@chakra-ui/react';
import { getWithAuth, routes } from '../../utils/apiRoutes';
import ModalProduct from './modalProduct'; // Importa el modal

const ListProducts = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getWithAuth(routes.getAllProducts);

        if (Array.isArray(response)) {
          setProducts(response);
        } else {
          setProducts([]);
        }
      } catch (error) {
        // Error silencioso
      }
    };

    fetchProducts();

    const intervalId = setInterval(fetchProducts, 3000);
    return () => clearInterval(intervalId);
  }, []);

  // Filtrar productos basados en el término de búsqueda
  const filteredProducts = products.filter((product) => {
    return (
      product.id.toString().includes(searchTerm) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codbarras.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.zonastock?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleShowMore = () => {
    setVisibleProducts((prev) => prev + 5);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Box maxH="400px" overflowY="auto" className="scrollbar">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Acción</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredProducts.slice(0, visibleProducts).map((product) => (
            <Tr key={product.id}>
              <Td>{product.descripcion}</Td>
              <Td>
                <Button colorScheme="teal" onClick={() => handleOpenModal(product)}>
                  Ver más
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {visibleProducts < filteredProducts.length && (
        <Button onClick={handleShowMore} colorScheme="gray" mt={4}>
          Mostrar más
        </Button>
      )}

      {selectedProduct && (
        <ModalProduct
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </Box>
  );
};

export default ListProducts;