import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  useToast,
  Box,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { FaHistory } from 'react-icons/fa';
import { getWithAuth, routes } from '../../utils/apiRoutes';

export default function HistorialCompras() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [compras, setCompras] = useState([]);
  const [productos, setProductos] = useState({});
  const [zonas, setZonas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Fetch purchases, products, and zones
    const fetchData = async () => {
      try {
        // Get all purchases
        const comprasResponse = await getWithAuth(routes.getAllCompras);

        // Get all products
        const productosResponse = await getWithAuth(routes.getAllProducts);
        const productosMap = {};
        productosResponse.forEach((prod) => {
          productosMap[prod.id] = prod.descripcion;
        });

        // Get all zones
        const zonasResponse = await getWithAuth(routes.getAllZonas);
        const zonasMap = {};
        zonasResponse.forEach((zona) => {
          zonasMap[zona.id] = zona.nombre;
        });

        setCompras(comprasResponse);
        setProductos(productosMap);
        setZonas(zonasMap);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: 'Error al cargar datos',
          description: 'No se pudieron cargar las compras.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [toast]);

  return (
    <>
      <Button
        leftIcon={<FaHistory />}
        colorScheme="gray"
        variant="solid"
        onClick={onOpen}
      >
        Historial de compra
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Historial de Compras</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Flex justify="center" align="center">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <Box maxH="auto" overflowY="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Producto</Th>
                      <Th>Cantidad</Th>
                      <Th>Precio</Th>
                      <Th>Zona</Th>
                      <Th>Fecha</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {compras.slice(0, 7).map((compra) => (
                      <Tr key={compra.id}>
                        <Td>{productos[compra.producto] || 'Desconocido'}</Td>
                        <Td>{compra.cantidad}</Td>
                        <Td>{compra.precio}</Td>
                        <Td>{zonas[compra.zona] || 'Desconocido'}</Td>
                        <Td>{new Date(compra.createdAt).toLocaleDateString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}