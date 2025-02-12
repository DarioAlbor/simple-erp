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
  Input,
  FormControl,
  FormLabel,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Checkbox,
  Icon,
} from '@chakra-ui/react';
import { getWithAuth, routes } from '../../utils/apiRoutes';
import { format } from 'date-fns';
import { FaFileExcel, FaFilePdf, FaArrowDown, FaArrowUp, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ModalCortes({ isOpen, onClose, zona }) {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedRepartidores, setSelectedRepartidores] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const pedidosResponse = await getWithAuth(routes.getAllPedidos);
        const productosResponse = await getWithAuth(routes.getAllProducts);
        const repartidoresResponse = await getWithAuth(routes.getAllUsers);

        if (Array.isArray(pedidosResponse) && Array.isArray(productosResponse) && Array.isArray(repartidoresResponse)) {
          const filteredPedidos = pedidosResponse.filter(
            (pedido) =>
              pedido.status === 'Entregado' &&
              format(new Date(pedido.updatedAt), 'yyyy-MM-dd') === selectedDate &&
              String(pedido.ubicacion) === String(zona.id) &&
              (selectedRepartidores.length === 0 || selectedRepartidores.includes(String(pedido.repartidor)))
          );
          setPedidos(filteredPedidos);
          setProductos(productosResponse);

          const zonaRepartidoresIds = zona.repartidores?.split(',') || [];
          const repartidoresZona = repartidoresResponse.filter((rep) =>
            zonaRepartidoresIds.includes(String(rep.id))
          );
          setRepartidores(repartidoresZona);
        } else {
          setError('No se encontraron pedidos con el estado "Entregado".');
        }
      } catch (error) {
        setError('Hubo un error al obtener los pedidos.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPedidos();
    }
  }, [isOpen, selectedDate, selectedRepartidores, zona.id]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = format(new Date(), 'yyyy-MM-dd');
    if (selectedDate <= today) {
      setSelectedDate(selectedDate);
    }
  };

  const handleRepartidorChange = (selectedIds) => {
    setSelectedRepartidores(selectedIds);
    setIsAllSelected(selectedIds.length === repartidores.length);
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRepartidores([]);
      setIsAllSelected(false);
    } else {
      const allIds = repartidores.map((rep) => String(rep.id));
      setSelectedRepartidores(allIds);
      setIsAllSelected(true);
    }
  };

  const getProductoDescripcion = (productoId) => {
    const producto = productos.find((prod) => prod.id === productoId);
    return producto ? producto.descripcion : 'Producto desconocido';
  };

  const groupedPedidos = pedidos.reduce((acc, pedido) => {
    if (!acc[pedido.producto]) {
      acc[pedido.producto] = {
        producto: pedido.producto,
        cantidad: 0,
        precioVenta: 0,
        tarifa: pedido.tarifa,
        clientesAtendidos: 0,
      };
    }
    acc[pedido.producto].cantidad += pedido.cantidad;
    acc[pedido.producto].precioVenta += parseFloat(pedido.precioVenta);
    acc[pedido.producto].clientesAtendidos += 1;
    return acc;
  }, {});

  const totalVenta = Object.values(groupedPedidos).reduce((total, pedido) => total + pedido.precioVenta, 0);
  const totalArticulos = Object.values(groupedPedidos).reduce((total, pedido) => total + pedido.cantidad, 0);
  const totalPagoServicios = Object.values(groupedPedidos).reduce((total, pedido) => {
    const tarifa = parseFloat(pedido.tarifa) || 0;
    return total + pedido.cantidad * tarifa;
  }, 0);
  const totalPorPagar = totalVenta - totalPagoServicios;

  const handleExportExcel = () => {
    const data = Object.values(groupedPedidos).map((pedido) => ({
      Producto: getProductoDescripcion(pedido.producto),
      'Clientes atendidos': pedido.clientesAtendidos,
      Ubicación: zona.nombre,
      'Pago por entrega': `$${pedido.tarifa}`,
      Subtotal: `$${(pedido.cantidad * parseFloat(pedido.tarifa)).toFixed(2)}`,
      'Artículos entregados': pedido.cantidad,
      Venta: `$${pedido.precioVenta.toFixed(2)}`,
    }));

    data.push(
      { Producto: '', 'Clientes atendidos': '', Ubicación: '', 'Pago por entrega': '', Subtotal: '', 'Artículos entregados': 'Totales', Venta: '' },
      { Producto: '', 'Clientes atendidos': '', Ubicación: '', 'Pago por entrega': '', Subtotal: `Total Venta: $${totalVenta.toFixed(2)}`, 'Artículos entregados': `Total Artículos: ${totalArticulos}`, Venta: `Total por pagar: $${totalPorPagar.toFixed(2)}` }
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Corte Diario');
    XLSX.writeFile(wb, `Corte_Diario_${selectedDate}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Corte Diario', 14, 16);

    const data = Object.values(groupedPedidos).map((pedido) => [
      getProductoDescripcion(pedido.producto),
      pedido.clientesAtendidos,
      zona.nombre,
      `$${pedido.tarifa}`,
      `$${(pedido.cantidad * parseFloat(pedido.tarifa)).toFixed(2)}`,
      pedido.cantidad,
      `$${pedido.precioVenta.toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [['Producto', 'Clientes atendidos', 'Ubicación', 'Pago por entrega', 'Subtotal', 'Artículos entregados', 'Venta']],
      body: data,
    });

    doc.text(`Total de venta: $${totalVenta.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Total de artículos entregados: ${totalArticulos}`, 14, doc.autoTable.previous.finalY + 20);
    doc.text(`Pago total por servicios: $${totalPagoServicios.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 30);
    doc.text(`Por pagar: $${totalPorPagar.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 40);

    doc.save(`Corte_Diario_${selectedDate}.pdf`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Corte diario</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Seleccionar fecha</FormLabel>
            <Input
              type="date"
              value={selectedDate}
              max={format(new Date(), 'yyyy-MM-dd')}
              onChange={handleDateChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              rightIcon={isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
              variant="outline"
            >
              {isAllSelected
                ? 'Todos Seleccionados'
                : selectedRepartidores.length > 0
                ? `${selectedRepartidores.length} Seleccionado(s)`
                : 'Seleccionar repartidor(es)'}
            </Button>
            {isMenuOpen && (
              <Box mt={2} border="1px solid #ccc" p={4} borderRadius="md" boxShadow="md">
                <Checkbox isChecked={isAllSelected} onChange={toggleSelectAll}>
                  Seleccionar todos
                </Checkbox>
                <Stack direction="column" mt={2}>
                  {repartidores.map((repartidor) => (
                    <Checkbox
                      key={repartidor.id}
                      value={String(repartidor.id)}
                      isChecked={selectedRepartidores.includes(String(repartidor.id))}
                      onChange={() => handleRepartidorChange(
                        selectedRepartidores.includes(String(repartidor.id))
                          ? selectedRepartidores.filter(id => id !== String(repartidor.id))
                          : [...selectedRepartidores, String(repartidor.id)]
                      )}
                    >
                      {repartidor.name}
                    </Checkbox>
                  ))}
                </Stack>
              </Box>
            )}
          </FormControl>

          <Box maxHeight="400px" overflowY="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Producto</Th>
                  <Th>Clientes atendidos</Th>
                  <Th>Ubicación</Th>
                  <Th>Pago por entrega</Th>
                  <Th>Subtotal</Th>
                  <Th>Artículos entregados</Th>
                  <Th>Venta</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.values(groupedPedidos).length > 0 ? (
                  Object.values(groupedPedidos).map((pedido, index) => (
                    <Tr key={index}>
                      <Td>{getProductoDescripcion(pedido.producto)}</Td>
                      <Td>{pedido.clientesAtendidos}</Td>
                      <Td>{zona.nombre}</Td>
                      <Td>${pedido.tarifa}</Td>
                      <Td>${(pedido.cantidad * parseFloat(pedido.tarifa)).toFixed(2)}</Td>
                      <Td>{pedido.cantidad}</Td>
                      <Td>${pedido.precioVenta.toFixed(2)}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="7" textAlign="center">
                      No hay pedidos entregados para esta fecha.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          <Divider my={4} />
          <Box>
            <Box display="flex" justifyContent="space-between">
              <Box>Total de venta:</Box>
              <Box>${totalVenta.toFixed(2)}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box>Total de artículos entregados:</Box>
              <Box>{totalArticulos}</Box>
            </Box>
          </Box>

          <Divider my={4} />
          <Box display="flex" justifyContent="space-between">
            <Box>Pago total por servicios:</Box>
            <Box>${totalPagoServicios.toFixed(2)}</Box>
          </Box>

          <Divider my={4} />
          <Box display="flex" justifyContent="space-between" fontWeight="bold">
            <Box>Por pagar:</Box>
            <Box>${totalPorPagar.toFixed(2)}</Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Menu isOpen={isExportMenuOpen}>
            <MenuButton
              as={Button}
              variant="ghost"
              rightIcon={isExportMenuOpen ? <FaArrowUp /> : <FaArrowDown />}
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            >
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
          <Button variant="ghost" onClick={onClose}>
            Volver
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}