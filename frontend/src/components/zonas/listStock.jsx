import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Box,
  IconButton,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { getWithAuth, routes } from '../../utils/apiRoutes';

export default function ListStock() {
  const [compras, setCompras] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const comprasResponse = await getWithAuth(routes.getAllCompras);
        const zonasResponse = await getWithAuth(routes.getAllZonas);
        const productosResponse = await getWithAuth(routes.getAllProducts);

        if (
          Array.isArray(comprasResponse) &&
          Array.isArray(zonasResponse) &&
          Array.isArray(productosResponse)
        ) {
          setCompras(comprasResponse);
          setZonas(zonasResponse);
          setProductos(productosResponse);
        } else {
          setError('No se encontraron datos de compras, zonas o productos.');
        }
      } catch (error) {
        setError('Hubo un error al obtener los datos.');
      } finally {
        setLoading(false);
        setIsFirstLoad(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getProductoDescripcion = (productoId) => {
    const producto = productos.find((prod) => prod.id === productoId);
    return producto ? producto.descripcion : 'Producto desconocido';
  };

  const getCantidadProductoZona = (zonaId, productoId) => {
    const compra = compras.find(
      (compra) => compra.zona === zonaId && compra.producto === productoId
    );
    return compra ? compra.cantidad : 0;
  };

  const getTotalProductosZona = (zonaId) => {
    return productos.reduce((total, producto) => {
      return total + getCantidadProductoZona(zonaId, producto.id);
    }, 0);
  };

  const zonasOrdenadas = [...zonas].sort((a, b) => {
    if (sortBy === null) return 0;
    const cantidadA = getCantidadProductoZona(a.id, sortBy);
    const cantidadB = getCantidadProductoZona(b.id, sortBy);

    if (sortOrder === 'desc') {
      return cantidadB - cantidadA;
    } else {
      return cantidadA - cantidadB;
    }
  });

  const handleSort = (productoId) => {
    if (sortBy === productoId) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(productoId);
      setSortOrder('desc');
    }
  };

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
    <Box>
      <Box maxHeight="400px" overflowY={zonas.length > 6 ? 'auto' : 'visible'} className="scrollbar">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Zona</Th>
              {productos.map((producto) => (
                <Th key={producto.id}>
                  {getProductoDescripcion(producto.id)}
                  <IconButton
                    aria-label={`Ordenar por ${getProductoDescripcion(producto.id)}`}
                    icon={sortBy === producto.id && sortOrder === 'desc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    onClick={() => handleSort(producto.id)}
                    variant="ghost"
                    size="sm"
                    ml={2}
                  />
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {zonasOrdenadas.map((zona) => (
              <Tr key={zona.id}>
                <Td>{zona.nombre}</Td>
                {productos.map((producto) => (
                  <Td key={producto.id}>
                    {getCantidadProductoZona(zona.id, producto.id)}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}