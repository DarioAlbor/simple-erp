const { Zona } = require('../config/dbConfig');

const addZona = async (req, res) => {
    const { nombre, tarifa1, tarifa2, tarifa3, tarifa4, repartidores } = req.body;
  
    try {
      const zonaData = {
        nombre,
        tarifa1: tarifa1 || null,
        tarifa2: tarifa2 || null,
        tarifa3: tarifa3 || null,
        tarifa4: tarifa4 || null,
        stocktotal: null,
        repartidores: repartidores || null,
      };
  
      const newZona = await Zona.create(zonaData);
  
      return res.status(201).json({ message: 'Zona agregada exitosamente', zona: newZona });
    } catch (error) {
      return res.status(500).json({ message: 'Error al agregar la zona', error: error.message });
    }
  };  

const deleteZona = async (req, res) => {
  const { id } = req.params;

  try {
    const zona = await Zona.findByPk(id);

    if (!zona) {
      return res.status(404).json({ message: 'Zona no encontrada' });
    }

    await zona.destroy();
    return res.status(200).json({ message: 'Zona eliminada exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar la zona', error: error.message });
  }
};

const editZona = async (req, res) => {
  const { id } = req.params;
  const { nombre, tarifa1, tarifa2, tarifa3, tarifa4, stocktotal, repartidores } = req.body;

  try {
    const zona = await Zona.findByPk(id);

    if (!zona) {
      return res.status(404).json({ message: 'Zona no encontrada' });
    }

    zona.nombre = nombre || zona.nombre;
    zona.tarifa1 = tarifa1 || zona.tarifa1;
    zona.tarifa2 = tarifa2 || zona.tarifa2;
    zona.tarifa3 = tarifa3 || zona.tarifa3;
    zona.tarifa4 = tarifa4 || zona.tarifa4;
    zona.stocktotal = stocktotal || zona.stocktotal;
    zona.repartidores = repartidores === null ? null : repartidores || zona.repartidores;

    await zona.save();
    return res.status(200).json({ message: 'Zona actualizada exitosamente', zona });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar la zona', error: error.message });
  }
};

const getAllZonas = async (req, res) => {
  try {
    const zonas = await Zona.findAll();
    return res.status(200).json(zonas);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener las zonas', error: error.message });
  }
};

module.exports = {
  addZona,
  deleteZona,
  editZona,
  getAllZonas,
};