const { Compras, Zona } = require('../config/dbConfig');

const addCompra = async (req, res) => {
  const { producto, cantidad, precio, zona } = req.body;

  try {
    const compraData = {
      producto,
      cantidad,
      precio,
      zona,
    };

    const newCompra = await Compras.create(compraData);

    if (zona && cantidad) {
      const zonaEncontrada = await Zona.findByPk(zona);

      if (zonaEncontrada) {
        zonaEncontrada.stocktotal = (zonaEncontrada.stocktotal || 0) + parseInt(cantidad, 10);
        await zonaEncontrada.save();
      }
    }

    return res.status(201).json({ message: 'Compra agregada exitosamente', compra: newCompra });
  } catch (error) {
    return res.status(500).json({ message: 'Error al agregar la compra', error: error.message });
  }
};


const deleteCompra = async (req, res) => {
  const { id } = req.params;

  try {
    const compra = await Compras.findByPk(id);

    if (!compra) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }

    await compra.destroy();
    return res.status(200).json({ message: 'Compra eliminada exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar la compra', error: error.message });
  }
};

const editCompra = async (req, res) => {
  const { id } = req.params;
  const { producto, cantidad, precio, zona } = req.body;

  try {
    const compra = await Compras.findByPk(id);

    if (!compra) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }

    compra.producto = producto || compra.producto;
    compra.cantidad = cantidad || compra.cantidad;
    compra.precio = precio || compra.precio;
    compra.zona = zona || compra.zona;

    await compra.save();
    return res.status(200).json({ message: 'Compra actualizada exitosamente', compra });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar la compra', error: error.message });
  }
};

const getAllCompras = async (req, res) => {
  try {
    const compras = await Compras.findAll();
    return res.status(200).json(compras);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener las compras', error: error.message });
  }
};

module.exports = {
  addCompra,
  deleteCompra,
  editCompra,
  getAllCompras,
};