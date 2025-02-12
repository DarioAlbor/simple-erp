import React, { useEffect, useState } from 'react';
import {
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
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Box,
} from '@chakra-ui/react';
import { getWithAuth, routes } from '../../utils/apiRoutes';

export default function ModalListStock({ isOpen, onClose, zona }) {
  const [compras, setCompras] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const comprasResponse = await getWithAuth(routes.getAllCompras);
        const productosResponse = await getWithAuth(routes.getAllProducts);

        if (Array.isArray(comprasResponse) && Array.isArray(productosResponse)) {
          const filteredCompras = comprasResponse
            .filter(compra => String(compra.zona) === String(zona.id))
            .reduce((acc, compra) => {
              const existingCompra = acc.find(c => c.producto === compra.producto);
              if (existingCompra) {
                existingCompra.cantidad += compra.cantidad;
              } else {
                acc.push({ ...compra });
              }
              return acc;
            }, []);

          setCompras(filteredCompras);
          setProductos(productosResponse);
        } else {
          setError('No se encontraron compras o productos.');
        }
      } catch (error) {
        setError('Hubo un error al obtener las compras.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCompras();
    }
  }, [isOpen, zona.id]);

  const getProductoDescripcion = (productoId) => {
    const producto = productos.find(prod => prod.id === productoId);
    return producto ? producto.descripcion : 'Producto desconocido';
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Stock de {zona.nombre}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Spinner size="xl" />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Stock de {zona.nombre}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Stock de {zona.nombre}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box maxHeight="400px" overflowY="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Producto</Th>
                  <Th>Cantidad</Th>
                  <Th>Última actualización</Th>
                </Tr>
              </Thead>
              <Tbody>
                {compras.length > 0 ? (
                  compras.map(compra => (
                    <Tr key={compra.id}>
                      <Td>{getProductoDescripcion(compra.producto)}</Td>
                      <Td>{compra.cantidad}</Td>
                      <Td>{new Date(compra.updatedAt).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="3" textAlign="center">
                      No hay stock para esta zona.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Volver
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}