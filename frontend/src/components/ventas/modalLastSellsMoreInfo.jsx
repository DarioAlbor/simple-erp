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
  useToast,
  Flex,
} from '@chakra-ui/react';
import { FaPencil, FaTrash } from "react-icons/fa6";
import { getWithAuth, requestWithAuth, routes } from '../../utils/apiRoutes';
import { format, isBefore } from 'date-fns';

export default function ModalLastSellsMoreInfo({ isOpen, onClose, pedido, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [productos, setProductos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(pedido.producto);
  const [cantidad, setCantidad] = useState(pedido.cantidad);
  const [precioVenta, setPrecioVenta] = useState(pedido.precioVenta);
  const [nombre, setNombre] = useState(pedido.nombre || '');
  const [apellido, setApellido] = useState(pedido.apellido || '');
  const [telefono, setTelefono] = useState(pedido.telefono);
  const [selectedUbicacion, setSelectedUbicacion] = useState(pedido.ubicacion || '');
  const [direccion, setDireccion] = useState(pedido.direccion || '');
  const [referencia, setReferencia] = useState(pedido.referencia || '');
  const [fechaEntrega, setFechaEntrega] = useState(pedido.entrega ? format(new Date(pedido.entrega), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const toast = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getWithAuth(routes.getAllProducts);
        if (Array.isArray(response)) {
          setProductos(response);
        }
      } catch (error) {
        toast({
          title: 'Error al cargar productos',
          description: 'No se pudieron cargar los productos del stock.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    const fetchZonas = async () => {
      try {
        const zonasResponse = await getWithAuth(routes.getAllZonas);
        if (Array.isArray(zonasResponse)) {
          setZonas(zonasResponse);
        }
      } catch (error) {
        toast({
          title: 'Error al cargar ubicaciones',
          description: 'No se pudieron cargar las ubicaciones.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchProducts();
    fetchZonas();
  }, [toast]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    const updatedPedido = {
      producto: selectedProducto,
      cantidad: parseInt(cantidad, 10),
      precioVenta: parseFloat(precioVenta.replace('$', '')),
      nombre,
      apellido,
      telefono,
      ubicacion: selectedUbicacion,
      direccion,
      referencia,
      entrega: fechaEntrega,
    };

    try {
      const response = await requestWithAuth(`${routes.editPedido}/${pedido.id}`, updatedPedido, 'PUT');
      if (response.status === 200) {
        toast({
          title: 'Pedido actualizado',
          description: 'El pedido se ha actualizado exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setIsEditing(false);
        onClose();
      } else {
        toast({
          title: 'Error al actualizar pedido',
          description: 'Hubo un problema al actualizar el pedido.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error en la solicitud',
        description: 'No se pudo actualizar el pedido. Inténtalo nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await requestWithAuth(`${routes.deletePedido}/${pedido.id}`, {}, 'DELETE');
      if (response.status === 200) {
        toast({
          title: 'Pedido eliminado',
          description: 'El pedido se ha eliminado exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onDelete(pedido.id);
        onClose();
      } else {
        toast({
          title: 'Error al eliminar pedido',
          description: 'Hubo un problema al eliminar el pedido.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error en la solicitud',
        description: 'No se pudo eliminar el pedido. Inténtalo nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalles del Pedido</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Producto</FormLabel>
            <Select
              value={selectedProducto}
              onChange={(e) => setSelectedProducto(e.target.value)}
              isDisabled={!isEditing}
            >
              {productos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.descripcion}
                </option>
              ))}
            </Select>
          </FormControl>

          <Flex mb={4}>
            <FormControl mr={2} isRequired>
              <FormLabel>Cantidad</FormLabel>
              <Input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                isDisabled={!isEditing}
              />
            </FormControl>
            <FormControl ml={2} isRequired>
              <FormLabel>P. Venta</FormLabel>
              <Input
                type="text"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                onBlur={() => {
                  if (!precioVenta.startsWith('$')) {
                    setPrecioVenta(`$ ${precioVenta}`);
                  }
                }}
                isDisabled={!isEditing}
              />
            </FormControl>
          </Flex>

          <Flex mb={4}>
            <FormControl mr={2}>
              <FormLabel>Nombre(s)</FormLabel>
              <Input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                isDisabled={!isEditing}
              />
            </FormControl>
            <FormControl ml={2}>
              <FormLabel>Apellido(s)</FormLabel>
              <Input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                isDisabled={!isEditing}
              />
            </FormControl>
          </Flex>

          <FormControl mb={4} isRequired>
            <FormLabel>Teléfono</FormLabel>
            <Input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              isDisabled={!isEditing}
            />
          </FormControl>

          <Flex mb={4}>
            <FormControl mr={2}>
              <FormLabel>Ubicación</FormLabel>
              <Select
                value={selectedUbicacion}
                onChange={(e) => setSelectedUbicacion(e.target.value)}
                isDisabled={!isEditing}
              >
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.id}>
                    {zona.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl ml={2}>
              <FormLabel>Dirección</FormLabel>
              <Input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                isDisabled={!isEditing}
              />
            </FormControl>
          </Flex>

          <FormControl mb={4}>
            <FormLabel>Referencia / Notas</FormLabel>
            <Textarea
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              isDisabled={!isEditing}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Fecha de entrega</FormLabel>
            <Input
              type="date"
              value={fechaEntrega}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={handleFechaEntregaChange}
              isDisabled={!isEditing}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          {!isEditing && pedido.status === 'Nuevo' && (
            <>
              <Button
                leftIcon={<FaPencil />}
                variant="outline"
                colorScheme="teal"
                mr={3}
                onClick={handleEditToggle}
              >
                Editar
              </Button>
              <Button
                leftIcon={<FaTrash />}
                colorScheme="red"
                onClick={handleDelete}
              >
                Borrar
              </Button>
            </>
          )}
          {isEditing && (
            <Button colorScheme="teal" onClick={handleSaveChanges}>
              Guardar Cambios
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}