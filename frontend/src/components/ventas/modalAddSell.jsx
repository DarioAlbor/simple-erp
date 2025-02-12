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
  Select,
  Textarea,
  useDisclosure,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { IoMdAdd } from 'react-icons/io';
import { getWithAuth, requestWithAuth, routes } from '../../utils/apiRoutes';
import { format, addDays, isBefore } from 'date-fns';

export default function AddPedido() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productos, setProductos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [selectedUbicacion, setSelectedUbicacion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [referencia, setReferencia] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState(format(new Date(), 'yyyy-MM-dd'));
  const toast = useToast();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getWithAuth(routes.userInfo);
        if (response && response.id) {
          setUserId(response.id);
        }
      } catch (error) {
        toast({
          title: 'Error al cargar usuario',
          description: 'No se pudo obtener la información del usuario.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUserInfo();
  }, [toast]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, zonasResponse] = await Promise.all([
          getWithAuth(routes.getAllProducts),
          getWithAuth(routes.getAllZonas)
        ]);

        if (Array.isArray(productsResponse)) {
          setProductos(productsResponse);
        }

        if (Array.isArray(zonasResponse)) {
          setZonas(zonasResponse);
        }
      } catch (error) {
        toast({
          title: 'Error al cargar productos o zonas',
          description: 'No se pudieron cargar los productos del stock o las zonas.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleAddPedido = async () => {
    const newPedido = {
      producto: selectedProducto,
      cantidad: parseInt(cantidad, 10),
      precioVenta: parseFloat(precioVenta.replace('$', '')),
      nombre,
      apellido,
      telefono,
      ubicacion: selectedUbicacion,
      direccion,
      referencia,
      vendedor: userId,
      entrega: fechaEntrega,
    };

    try {
      const response = await requestWithAuth(routes.addPedido, newPedido);
      if (response.status === 201) {
        toast({
          title: 'Pedido agregado',
          description: 'El pedido se ha agregado exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Error al agregar pedido',
          description: 'Hubo un problema al agregar el pedido.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error en la solicitud',
        description: 'No se pudo agregar el pedido. Inténtalo nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleNextStep = () => setCurrentStep(2);
  const handlePreviousStep = () => setCurrentStep(1);

  const isStep1Valid = selectedProducto && cantidad;
  const isStep2Valid = telefono;

  const handleFechaEntregaChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    if (isBefore(selectedDate, today)) {
      toast({
        title: 'Fecha inválida',
        description: 'La fecha de entrega no puede ser anterior a hoy.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      setFechaEntrega(format(today, 'yyyy-MM-dd'));
    } else {
      setFechaEntrega(e.target.value);
    }
  };

  return (
    <>
      <Button leftIcon={<IoMdAdd />} colorScheme="gray" variant="solid" onClick={onOpen}>
        Cargar Pedido
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cargar Pedido</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {currentStep === 1 && (
              <>
                <FormControl mb={4} isRequired>
                  <FormLabel>Producto</FormLabel>
                  <Select
                    placeholder="Seleccionar producto"
                    onChange={(e) => setSelectedProducto(e.target.value)}
                    value={selectedProducto}
                  >
                    {productos.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.descripcion}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl mb={4} isRequired>
                  <FormLabel>Cantidad</FormLabel>
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                </FormControl>

                <FormControl mb={4} isRequired>
                  <FormLabel>P. Venta</FormLabel>
                  <Input
                    type="text"
                    placeholder="$ 0.00"
                    value={precioVenta}
                    onChange={(e) => setPrecioVenta(e.target.value)}
                    onBlur={() => {
                      if (!precioVenta.startsWith('$')) {
                        setPrecioVenta(`$ ${precioVenta}`);
                      }
                    }}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Nombre(s)</FormLabel>
                  <Input
                    type="text"
                    placeholder="Nombre(s)"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Apellido(s)</FormLabel>
                  <Input
                    type="text"
                    placeholder="Apellido(s)"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                  />
                </FormControl>
              </>
            )}

            {currentStep === 2 && (
              <>
                <FormControl mb={4} isRequired>
                  <FormLabel>Teléfono</FormLabel>
                  <Input
                    type="text"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </FormControl>

                <FormControl mb={4} isRequired>
                  <FormLabel>Ubicación</FormLabel>
                  <Select
                    placeholder="Seleccionar ubicación"
                    onChange={(e) => setSelectedUbicacion(e.target.value)}
                    value={selectedUbicacion}
                  >
                    {zonas.map((zona) => (
                      <option key={zona.id} value={zona.id}>
                        {zona.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Dirección</FormLabel>
                  <Input
                    type="text"
                    placeholder="Dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Referencia / Notas</FormLabel>
                  <Textarea
                    placeholder="Referencia / Notas"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Fecha de entrega</FormLabel>
                  <Input
                    type="date"
                    value={fechaEntrega}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={handleFechaEntregaChange}
                  />
                </FormControl>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            {currentStep === 1 ? (
              <Tooltip label="Debes completar los campos obligatorios (*) para continuar" isDisabled={isStep1Valid}>
                <Button
                  colorScheme={isStep1Valid ? 'teal' : 'gray'}
                  onClick={handleNextStep}
                  isDisabled={!isStep1Valid}
                >
                  Siguiente
                </Button>
              </Tooltip>
            ) : (
              <>
                <Button variant="ghost" onClick={handlePreviousStep}>
                  Volver
                </Button>
                <Tooltip label="Debes completar los campos obligatorios (*) para continuar" isDisabled={isStep2Valid}>
                  <Button
                    colorScheme={isStep2Valid ? 'teal' : 'gray'}
                    onClick={handleAddPedido}
                    isDisabled={!isStep2Valid}
                  >
                    Agregar Pedido
                  </Button>
                </Tooltip>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}