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
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  Select,
  Flex,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { IoMdAdd } from 'react-icons/io';
import { FaCircleInfo } from 'react-icons/fa6'; // Importar icono de información
import { getWithAuth, requestWithAuth, routes } from '../../utils/apiRoutes';

export default function AddCompra() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productos, setProductos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [precios, setPrecios] = useState([]);
  const [selectedPrecio, setSelectedPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [selectedZona, setSelectedZona] = useState('');
  const toast = useToast();

  useEffect(() => {
    // Fetch products and zones
    const fetchProductsAndZones = async () => {
      try {
        const productsResponse = await getWithAuth(routes.getAllProducts);
        const zonesResponse = await getWithAuth(routes.getAllZonas);

        if (Array.isArray(productsResponse)) setProductos(productsResponse);
        if (Array.isArray(zonesResponse)) setZonas(zonesResponse);
      } catch (error) {
        toast({
          title: 'Error al cargar datos',
          description: 'No se pudieron cargar productos y zonas.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchProductsAndZones();
  }, [toast]);

  // Manejo de selección de producto
  const handleProductoChange = (e) => {
    const productoId = e.target.value;
    setSelectedProducto(productoId);

    // Encontrar producto seleccionado para obtener los precios
    const productoSeleccionado = productos.find((prod) => prod.id === parseInt(productoId));
    if (productoSeleccionado) {
      setPrecios([
        productoSeleccionado.precio,
        productoSeleccionado.precio2,
        productoSeleccionado.precio3,
      ].filter((p) => p !== null)); // Filtrar precios no nulos
    }
  };

  const handleAddCompra = async () => {
    const newCompra = {
      producto: selectedProducto,
      cantidad: parseInt(cantidad, 10),
      precio: parseFloat(selectedPrecio),
      zona: selectedZona,
    };

    try {
      const response = await requestWithAuth(routes.addCompra, newCompra);
      if (response.status === 201) {
        toast({
          title: 'Compra agregada',
          description: 'La compra se ha agregado exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Error al agregar compra',
          description: 'Hubo un problema al agregar la compra.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error en la solicitud',
        description: 'No se pudo agregar la compra. Inténtalo nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button
        leftIcon={<IoMdAdd />}
        colorScheme="gray"
        variant="solid"
        onClick={onOpen}
      >
        Agregar compra
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar nueva compra</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Seleccionar producto */}
            <FormControl mb={4}>
              <FormLabel>Seleccionar producto</FormLabel>
              <Select
                placeholder="Seleccionar producto"
                onChange={handleProductoChange}
                value={selectedProducto}
              >
                {productos.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.descripcion}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Seleccionar precio */}
            <FormControl mb={4}>
              <FormLabel>Seleccionar precio</FormLabel>
              <Select
                placeholder="Seleccionar precio"
                onChange={(e) => setSelectedPrecio(e.target.value)}
                value={selectedPrecio}
                isDisabled={precios.length === 0}
              >
                {precios.map((precio, index) => (
                  <option key={index} value={precio}>
                    {precio}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Cantidad */}
            <FormControl mb={4}>
              <FormLabel>Cantidad</FormLabel>
              <Input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </FormControl>

            {/* Seleccionar zona */}
            <FormControl mb={4}>
              <FormLabel>Zona</FormLabel>
              <Select
                placeholder="Seleccionar zona"
                onChange={(e) => setSelectedZona(e.target.value)}
                value={selectedZona}
              >
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.id}>
                    {zona.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={handleAddCompra}>
              Agregar compra
            </Button>
            <Button variant="ghost" ml={3} onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}