const { Pedidos } = require('../config/dbConfig');

const addPedido = async (req, res) => {
  const { producto, cantidad, precioVenta, clienteId, nombre, apellido, telefono, ubicacion, direccion, referencia, vendedor, status, entrega, tarifa, repartidor } = req.body;

  try {
    const nuevoPedido = await Pedidos.create({
      producto,
      cantidad,
      precioVenta,
      clienteId,
      nombre,
      apellido,
      telefono,
      ubicacion,
      direccion,
      referencia,
      vendedor,
      status,
      entrega,
      tarifa,
      repartidor,
    });

    return res.status(201).json({ message: 'Pedido agregado exitosamente', pedido: nuevoPedido });
  } catch (error) {
    return res.status(500).json({ message: 'Error al agregar el pedido', error: error.message });
  }
};

const editPedido = async (req, res) => {
  const { id } = req.params;
  const { producto, cantidad, precioVenta, clienteId, nombre, apellido, telefono, ubicacion, direccion, referencia, vendedor, status, entrega, tarifa, repartidor } = req.body;

  try {
    const pedido = await Pedidos.findByPk(id);

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    pedido.producto = producto || pedido.producto;
    pedido.cantidad = cantidad || pedido.cantidad;
    pedido.precioVenta = precioVenta || pedido.precioVenta;
    pedido.clienteId = clienteId || pedido.clienteId;
    pedido.nombre = nombre || pedido.nombre;
    pedido.apellido = apellido || pedido.apellido;
    pedido.telefono = telefono || pedido.telefono;
    pedido.ubicacion = ubicacion || pedido.ubicacion;
    pedido.direccion = direccion || pedido.direccion;
    pedido.referencia = referencia || pedido.referencia;
    pedido.vendedor = vendedor || pedido.vendedor;
    pedido.status = status || pedido.status;
    pedido.entrega = entrega || pedido.entrega;
    pedido.tarifa = tarifa || pedido.tarifa;
    pedido.repartidor = repartidor || pedido.repartidor;

    await pedido.save();
    return res.status(200).json({ message: 'Pedido actualizado exitosamente', pedido });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el pedido', error: error.message });
  }
};

const getPedidosByVendedor = async (req, res) => {
  const { vendedorId } = req.params;

  try {
    const pedidos = await Pedidos.findAll({ where: { vendedor: vendedorId } });

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron pedidos para este vendedor' });
    }

    return res.status(200).json(pedidos);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los pedidos', error: error.message });
  }
};

const deletePedido = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await Pedidos.findByPk(id);

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    await pedido.destroy();
    return res.status(200).json({ message: 'Pedido eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el pedido', error: error.message });
  }
};

const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedidos.findAll();

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron pedidos' });
    }

    return res.status(200).json(pedidos);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los pedidos', error: error.message });
  }
};

module.exports = {
  addPedido,
  editPedido,
  getPedidosByVendedor,
  getAllPedidos,
  deletePedido,
};