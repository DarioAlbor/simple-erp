import React, { useEffect, useState, useRef } from 'react';
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
  Flex,
  AlertIcon,
  Button,
  Box,
  Input,
  Tooltip,
  Select,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { getWithAuth, requestWithAuth, routes } from '../../utils/apiRoutes';
import { FaSave, FaExclamationTriangle, FaFileExcel, FaFilePdf, FaArrowDown } from 'react-icons/fa';
import { format, addDays } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ModalListSells({ isOpen, onClose, zona }) {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [compras, setCompras] = useState([]);
  const [tarifas, setTarifas] = useState({ tarifa1: '', tarifa2: '', tarifa3: '' });
  const [repartidoresZona, setRepartidoresZona] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [tarifa, setTarifa] = useState('');
  const [selectedRepartidor, setSelectedRepartidor] = useState(null);
  const [newDeliveryDate, setNewDeliveryDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [editedPedidos, setEditedPedidos] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();
  const { isOpen: isReprogramOpen, onOpen: onReprogramOpen, onClose: onReprogramClose } = useDisclosure();
  const toast = useToast();
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const pedidosResponse = await getWithAuth(routes.getAllPedidos);
        const productosResponse = await getWithAuth(routes.getAllProducts);
        const vendedoresResponse = await getWithAuth(routes.getAllUsers);
        const zonasResponse = await getWithAuth(routes.getAllZonas);
        const comprasResponse = await getWithAuth(routes.getAllCompras);

        if (
          Array.isArray(pedidosResponse) &&
          Array.isArray(productosResponse) &&
          Array.isArray(vendedoresResponse) &&
          Array.isArray(zonasResponse) &&
          Array.isArray(comprasResponse)
        ) {
          const filteredPedidos = pedidosResponse.filter(
            (pedido) => String(pedido.ubicacion) === String(zona.id) && ['Nuevo', 'Reprogramado'].includes(pedido.status)
          );
          setPedidos(filteredPedidos);
          setProductos(productosResponse);
          setVendedores(vendedoresResponse);
          setZonas(zonasResponse);
          setCompras(comprasResponse);

          const currentZone = zonasResponse.find((z) => z.id === zona.id);
          if (currentZone) {
            setTarifas({
              tarifa1: currentZone.tarifa1,
              tarifa2: currentZone.tarifa2,
              tarifa3: currentZone.tarifa3,
            });

            const repartidoresIds = currentZone.repartidores?.split(',') || [];
            const repartidoresData = vendedoresResponse.filter((vendedor) =>
              repartidoresIds.includes(String(vendedor.id))
            );
            setRepartidoresZona(repartidoresData);
          }
        } else {
          setError('No se encontraron pedidos, productos, vendedores o zonas.');
        }
      } catch (error) {
        setError('Hubo un error al obtener los datos iniciales.');
      } finally {
        setLoading(false);
      }
    };

    const fetchPedidosInterval = async () => {
      try {
        const pedidosResponse = await getWithAuth(routes.getAllPedidos);
        if (Array.isArray(pedidosResponse)) {
          const filteredPedidos = pedidosResponse.filter(
            (pedido) => String(pedido.ubicacion) === String(zona.id) && ['Nuevo', 'Reprogramado'].includes(pedido.status)
          );
          setPedidos(filteredPedidos);
        }
      } catch (error) {
        setError('Hubo un error al actualizar los pedidos.');
      }
    };

    if (isOpen) {
      fetchInitialData();
      intervalRef.current = setInterval(fetchPedidosInterval, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isOpen, zona.id]);

  const getProductoDescripcion = (productoId) => {
    const producto = productos?.find((prod) => prod.id === productoId);
    return producto ? producto.descripcion : 'Producto desconocido';
  };

  const getVendedorNombre = (vendedorId) => {
    const vendedor = vendedores?.find((vend) => vend.id === vendedorId);
    return vendedor ? vendedor.name : 'Desconocido';
  };

  const handleStatusChange = (e, pedido) => {
    const newStatus = e.target.value;
    if (newStatus === 'Entregado') {
      setSelectedPedido(pedido);
      onConfirmOpen();
    } else if (newStatus === 'Cancelado') {
      setSelectedPedido(pedido);
      onCancelOpen();
    } else if (newStatus === 'Reprogramado') {
      setSelectedPedido(pedido);
      onReprogramOpen();
    } else {
      setEditedPedidos({
        ...editedPedidos,
        [pedido.id]: { ...pedido, status: newStatus }
      });
      setIsButtonDisabled(false);
    }
  };

  const handleInputChange = (e, pedidoId, field) => {
    const value = e.target.value;
    setEditedPedidos({
      ...editedPedidos,
      [pedidoId]: { ...editedPedidos[pedidoId], [field]: value }
    });
    setIsButtonDisabled(false);
  };

  const handleSaveChanges = async () => {
    for (const pedidoId in editedPedidos) {
      try {
        const updatedPedido = editedPedidos[pedidoId];
        await requestWithAuth(`${routes.editPedido}/${pedidoId}`, updatedPedido, 'PUT');
        setEditedPedidos({});
        setIsButtonDisabled(true);
        toast({
          title: 'Cambios guardados',
          description: 'Los cambios se han guardado exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        setError('Hubo un error al guardar los cambios.');
      }
    }
  };

  const handleConfirmEntrega = async () => {
    if (!tarifa || !selectedRepartidor) {
      toast({
        title: 'Campos requeridos',
        description: 'Debes seleccionar una tarifa y un repartidor antes de confirmar la entrega.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const comprasZonaProducto = compras
      .filter((compra) => compra.producto === selectedPedido.producto && compra.zona === zona.id)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const totalStockDisponible = comprasZonaProducto.reduce((acc, compra) => acc + compra.cantidad, 0);

    if (totalStockDisponible < selectedPedido.cantidad) {
      toast({
        title: 'Stock insuficiente',
        description: `No hay suficiente stock para entregar ${selectedPedido.cantidad} unidades.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let cantidadPendiente = selectedPedido.cantidad;
    for (const compra of comprasZonaProducto) {
      const cantidadADescontar = Math.min(compra.cantidad, cantidadPendiente);
      cantidadPendiente -= cantidadADescontar;

      try {
        await requestWithAuth(`${routes.editCompra}/${compra.id}`, {
          producto: compra.producto,
          cantidad: compra.cantidad - cantidadADescontar,
          precio: compra.precio,
          zona: compra.zona,
        }, 'PUT');

        if (cantidadPendiente <= 0) break;
      } catch (error) {
        setError('Hubo un error al actualizar el stock de la compra.');
        return;
      }
    }

    const updatedPedido = { ...selectedPedido, status: 'Entregado', tarifa, repartidor: selectedRepartidor };
    try {
      await requestWithAuth(`${routes.editPedido}/${selectedPedido.id}`, updatedPedido, 'PUT');
      onConfirmClose();
      setTarifa('');
      setSelectedRepartidor(null);
    } catch (error) {
      setError('Hubo un error al confirmar la entrega.');
    }
  };

  const handleCancelPedido = async () => {
    const updatedPedido = { ...selectedPedido, status: 'Cancelado' };
    try {
      await requestWithAuth(`${routes.editPedido}/${selectedPedido.id}`, updatedPedido, 'PUT');
      onCancelClose();
    } catch (error) {
      setError('Hubo un error al cancelar el pedido.');
    }
  };

  const handleReprogramPedido = async () => {
    const updatedPedido = { ...selectedPedido, status: 'Reprogramado', entrega: `${newDeliveryDate} 00:00:00` };
    try {
      await requestWithAuth(`${routes.editPedido}/${selectedPedido.id}`, updatedPedido, 'PUT');
      onReprogramClose();
    } catch (error) {
      setError('Hubo un error al reprogramar el pedido.');
    }
  };

  const handleExportExcel = () => {
    const data = pedidos.map((pedido) => ({
      Status: pedido.status,
      Fecha: format(new Date(pedido.createdAt), 'yyyy-MM-dd'),
      Producto: getProductoDescripcion(pedido.producto),
      Cantidad: pedido.cantidad,
      Precio: `$${pedido.precioVenta}`,
      Nombre: pedido.nombre,
      Apellido: pedido.apellido,
      Teléfono: pedido.telefono,
      Ubicación: zona.nombre,
      Dirección: pedido.direccion,
      Referencia: pedido.referencia,
      'Nueva fecha de entrega': pedido.status === 'Reprogramado' ? format(new Date(pedido.entrega), 'yyyy-MM-dd') : '',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, 'Pedidos.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Pedidos', 14, 16);

    const data = pedidos.map((pedido) => [
      pedido.status,
      format(new Date(pedido.createdAt), 'yyyy-MM-dd'),
      getProductoDescripcion(pedido.producto),
      pedido.cantidad,
      `$${pedido.precioVenta}`,
      pedido.nombre,
      pedido.apellido,
      pedido.telefono,
      zona.nombre,
      pedido.direccion,
      pedido.referencia,
      pedido.status === 'Reprogramado' ? format(new Date(pedido.entrega), 'yyyy-MM-dd') : '',
    ]);

    doc.autoTable({
      head: [['Status', 'Fecha', 'Producto', 'Cantidad', 'Precio', 'Nombre', 'Apellido', 'Teléfono', 'Ubicación', 'Dirección', 'Referencia', 'Nueva fecha de entrega']],
      body: data,
    });

    doc.save('Pedidos.pdf');
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pedidos de {zona.nombre}</ModalHeader>
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
          <ModalHeader>Pedidos de {zona.nombre}</ModalHeader>
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
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pedidos de {zona.nombre}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box maxHeight="400px" overflowY="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Status</Th>
                    <Th>Producto</Th>
                    <Th>Cantidad</Th>
                    <Th>Precio</Th>
                    <Th>Cliente</Th>
                    <Th>Teléfono</Th>
                    <Th>Vendedor</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pedidos.length > 0 ? (
                    pedidos.map((pedido) => (
                      <Tr key={pedido.id}>
                        <Td>
                          <Flex alignItems="center">
                            <Select value={editedPedidos[pedido.id]?.status || pedido.status} onChange={(e) => handleStatusChange(e, pedido)}>
                              <option value="Nuevo">Nuevo</option>
                              <option value="Entregado">Entregado</option>
                              <option value="Cancelado">Cancelado</option>
                              <option value="Reprogramado">Reprogramado</option>
                            </Select>
                            {pedido.status === 'Reprogramado' && (
                              <Box ml={2}>
                                <Tooltip
                                  label={`Fecha de entrega: ${format(new Date(pedido.entrega), 'yyyy-MM-dd')}`}
                                  hasArrow
                                  placement="top"
                                >
                                  <span>
                                    <Icon as={FaExclamationTriangle} color="orange.500" cursor="pointer" />
                                  </span>
                                </Tooltip>
                              </Box>
                            )}
                          </Flex>
                        </Td>
                        <Td>
                          <Select
                            value={editedPedidos[pedido.id]?.producto || pedido.producto}
                            onChange={(e) => handleInputChange(e, pedido.id, 'producto')}
                          >
                            {productos.map((producto) => (
                              <option key={producto.id} value={producto.id}>
                                {producto.descripcion}
                              </option>
                            ))}
                          </Select>
                        </Td>
                        <Td>
                          <Input
                            type="number"
                            value={editedPedidos[pedido.id]?.cantidad || pedido.cantidad}
                            onChange={(e) => handleInputChange(e, pedido.id, 'cantidad')}
                          />
                        </Td>
                        <Td>
                          <Input
                            type="number"
                            value={editedPedidos[pedido.id]?.precioVenta || pedido.precioVenta}
                            onChange={(e) => handleInputChange(e, pedido.id, 'precioVenta')}
                          />
                        </Td>
                        <Td>
                          <Input
                            value={editedPedidos[pedido.id]?.nombre || pedido.nombre}
                            onChange={(e) => handleInputChange(e, pedido.id, 'nombre')}
                          />
                        </Td>
                        <Td>
                          <Input
                            value={editedPedidos[pedido.id]?.telefono || pedido.telefono}
                            onChange={(e) => handleInputChange(e, pedido.id, 'telefono')}
                          />
                        </Td>
                        <Td>{getVendedorNombre(pedido.vendedor)}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan="7" textAlign="center">
                        No hay pedidos para esta zona.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button leftIcon={<FaSave />} colorScheme="green" onClick={handleSaveChanges} isDisabled={isButtonDisabled}>
              Guardar cambios
            </Button>
            <Menu>
              <MenuButton as={Button} variant="ghost" rightIcon={<FaArrowDown />}>
                Exportar
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaFileExcel />} onClick={handleExportExcel}>
                  Exportar a Excel
                </MenuItem>
                <MenuItem icon={<FaFilePdf />} onClick={handleExportPDF}>
                  Exportar a PDF
                </MenuItem>
              </MenuList>
            </Menu>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {selectedPedido && (
        <>
          <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirmar entrega</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>
                  <strong>Producto:</strong> {getProductoDescripcion(selectedPedido.producto)}
                </p>
                <p>
                  <strong>Cantidad:</strong> {selectedPedido.cantidad}
                </p>
                <p>
                  <strong>Precio:</strong> ${selectedPedido.precioVenta}
                </p>
                <FormControl mt={4} isRequired>
                  <FormLabel>Tarifa</FormLabel>
                  <Select placeholder="Seleccionar tarifa" value={tarifa} onChange={(e) => setTarifa(e.target.value)}>
                    <option value={tarifas.tarifa1}>Tarifa 1: ${tarifas.tarifa1}</option>
                    <option value={tarifas.tarifa2}>Tarifa 2: ${tarifas.tarifa2}</option>
                    <option value={tarifas.tarifa3}>Tarifa 3: ${tarifas.tarifa3}</option>
                  </Select>
                </FormControl>

                <FormControl mt={4} isRequired>
                  <FormLabel>Repartidor</FormLabel>
                  <Select
                    placeholder={repartidoresZona.length > 0 ? 'Seleccionar repartidor' : 'No hay repartidores asignados a esta zona'}
                    value={selectedRepartidor}
                    onChange={(e) => setSelectedRepartidor(e.target.value)}
                    isDisabled={repartidoresZona.length === 0}
                  >
                    {repartidoresZona.map((repartidor) => (
                      <option key={repartidor.id} value={repartidor.id}>
                        {repartidor.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="green" onClick={handleConfirmEntrega}>
                  Confirmar entrega
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isCancelOpen} onClose={onCancelClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirmar cancelación</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>¿Estás seguro de que deseas cancelar este pedido?</p>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" onClick={handleCancelPedido}>
                  Cancelar pedido
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isReprogramOpen} onClose={onReprogramOpen}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Reprogramar entrega</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mt={4} isRequired>
                  <FormLabel>Seleccionar nueva fecha de entrega</FormLabel>
                  <Input
                    type="date"
                    min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                    value={newDeliveryDate}
                    onChange={(e) => setNewDeliveryDate(e.target.value)}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleReprogramPedido}>
                  Reprogramar entrega
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}