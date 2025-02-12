const { Publicidad } = require('../config/dbConfig');

const addPublicidad = async (req, res) => {
    const { producto_id, fecha, dia_semana, monto } = req.body;
  
    try {
      const publicidadData = {
        producto_id,
        fecha,
        dia_semana,
        monto,
      };
  
      const newPublicidad = await Publicidad.create(publicidadData);
  
      return res.status(201).json({ message: 'Registro de publicidad agregado exitosamente', publicidad: newPublicidad });
    } catch (error) {
      console.error("Error en addPublicidad:", error);
      return res.status(500).json({ message: 'Error al agregar el registro de publicidad', error: error.message });
    }
  };  

const deletePublicidad = async (req, res) => {
  const { id } = req.params;

  try {
    const publicidad = await Publicidad.findByPk(id);

    if (!publicidad) {
      return res.status(404).json({ message: 'Registro de publicidad no encontrado' });
    }

    await publicidad.destroy();
    return res.status(200).json({ message: 'Registro de publicidad eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el registro de publicidad', error: error.message });
  }
};

const editPublicidad = async (req, res) => {
  const { id } = req.params;
  const { producto_id, fecha, dia_semana, monto } = req.body;

  try {
    const publicidad = await Publicidad.findByPk(id);

    if (!publicidad) {
      return res.status(404).json({ message: 'Registro de publicidad no encontrado' });
    }

    publicidad.producto_id = producto_id || publicidad.producto_id;
    publicidad.fecha = fecha || publicidad.fecha;
    publicidad.dia_semana = dia_semana || publicidad.dia_semana;
    publicidad.monto = monto || publicidad.monto;

    await publicidad.save();
    return res.status(200).json({ message: 'Registro de publicidad actualizado exitosamente', publicidad });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el registro de publicidad', error: error.message });
  }
};

const getAllPublicidad = async (req, res) => {
  try {
    const publicidad = await Publicidad.findAll();
    return res.status(200).json(publicidad);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los registros de publicidad', error: error.message });
  }
};

module.exports = {
  addPublicidad,
  deletePublicidad,
  editPublicidad,
  getAllPublicidad,
};