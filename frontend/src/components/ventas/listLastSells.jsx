import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { getWithAuth, routes } from '../../utils/apiRoutes';
import ModalLastSellsMoreInfo from './modalLastSellsMoreInfo';

export default function ListLastSells() {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pedidosPerPage = 5;

  const fetchPedidosYProductos = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const userInfo = await getWithAuth(routes.userInfo);
      if (userInfo && userInfo.id) {
        const vendedorId = userInfo.id;
        const pedidosResponse = await getWithAuth(`${routes.getPedidosByVendedor}/${vendedorId}`);
        if (!Array.isArray(pedidosResponse)) {
          setError('No se encontraron pedidos.');
          return;
        }

        const productosResponse = await getWithAuth(routes.getAllProducts);
        if (!Array.isArray(productosResponse)) {
          setError('No se encontraron productos.');
          return;
        }

        const filteredPedidos = pedidosResponse.filter(pedido => pedido.status === 'Nuevo');
        const sortedPedidos = filteredPedidos.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPedidos(sortedPedidos);
        setProductos(productosResponse);
      } else {
        setError('Error al obtener la información del vendedor.');
      }
    } catch (error) {
      setError('Hubo un error al obtener los pedidos y productos.');
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  };

  useEffect(() => {
    fetchPedidosYProductos();
    const interval = setInterval(() => {
      fetchPedidosYProductos(false);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = (pedido) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPedido(null);
    setIsModalOpen(false);
  };

  const getProductoDescripcion = (productoId) => {
    const producto = productos.find(prod => prod.id === productoId);
    return producto ? producto.descripcion : 'Producto desconocido';
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(pedidos.length / pedidosPerPage);
  const paginatedPedidos = pedidos.slice(
    (currentPage - 1) * pedidosPerPage,
    currentPage * pedidosPerPage
  );

  if (isFirstLoad && loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={5}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Fecha</Th>
            <Th>Hora</Th>
            <Th>Producto</Th>
            <Th>Cantidad</Th>
            <Th>Precio</Th>
            <Th>Cliente</Th>
            <Th>Teléfono</Th>
            <Th>Acción</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedPedidos.map(pedido => (
            <Tr key={pedido.id}>
              <Td>{new Date(pedido.createdAt).toLocaleDateString()}</Td>
              <Td>{new Date(pedido.createdAt).toLocaleTimeString()}</Td>
              <Td>{getProductoDescripcion(pedido.producto)}</Td>
              <Td>{pedido.cantidad}</Td>
              <Td>$ {pedido.precioVenta}</Td>
              <Td>{pedido.nombre ? `${pedido.nombre} ${pedido.apellido}` : 'Desconocido'}</Td>
              <Td>{pedido.telefono}</Td>
              <Td>
                <Button colorScheme="teal" onClick={() => handleOpenModal(pedido)}>
                  Ver más
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {paginatedPedidos.length > 0 && (
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <IconButton
            icon={<ArrowLeftIcon />}
            onClick={handlePreviousPage}
            isDisabled={currentPage === 1}
            aria-label="Página anterior"
          />
          <Flex>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                colorScheme={currentPage === index + 1 ? 'teal' : 'gray'}
                mx={1}
              >
                {index + 1}
              </Button>
            ))}
          </Flex>
          <IconButton
            icon={<ArrowRightIcon />}
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
            aria-label="Página siguiente"
          />
        </Flex>
      )}

      {selectedPedido && (
        <ModalLastSellsMoreInfo
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          pedido={selectedPedido}
        />
      )}
    </Box>
  );
}