const { Stock } = require('../config/dbConfig');

const addProduct = async (req, res) => {
  let { descripcion, img, precio, precio2, precio3 } = req.body;

  try {
    precio = precio !== undefined ? precio : null;
    precio2 = precio2 !== undefined ? precio2 : null;
    precio3 = precio3 !== undefined ? precio3 : null;

    const newProduct = await Stock.create({
      descripcion,
      img,
      precio,
      precio2,
      precio3,
    });

    return res.status(201).json({ message: 'Producto agregado exitosamente', product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: 'Error al agregar el producto', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Stock.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await product.destroy();
    return res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  const { descripcion, img } = req.body;

  try {
    const product = await Stock.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    product.descripcion = descripcion || product.descripcion;
    product.img = img || product.img;

    await product.save();
    return res.status(200).json({ message: 'Producto actualizado exitosamente', product });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Stock.findAll();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
};