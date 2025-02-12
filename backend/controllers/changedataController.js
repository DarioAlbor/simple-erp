const { User } = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const changeProfileImage = async (req, res) => {
    const { imageProfile } = req.body;
  
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }  
      user.imageprofile = imageProfile;
      await user.save();
  
      return res.status(200).json({ message: 'Imagen de perfil actualizada correctamente', imageProfile: user.imageprofile });
    } catch (error) {
      return res.status(500).json({ message: 'Error al actualizar la imagen de perfil', error });
    }
  };  

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({ message: 'La contraseña antigua es incorrecta' });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar la contraseña', error });
  }
};

const updateUserData = async (req, res) => {
  const { name, lastname, phone, country, city } = req.body;

  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.name = name || user.name;
    user.lastname = lastname || user.lastname;
    user.phone = phone || user.phone;
    user.country = country || user.country;
    user.city = city || user.city;
    await user.save();

    return res.status(200).json({ message: 'Datos actualizados correctamente', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar los datos del usuario', error });
  }
};

const updateSendNotifications = async (req, res) => {
  const { notifications } = req.body;

  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.notifications = notifications;
    await user.save();

    return res.status(200).json({ message: 'Preferencia de notificaciones actualizada correctamente', notifications: user.notifications });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar las notificaciones', error });
  }
};

const disabledAccount = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.disabled = '1';
    await user.save();

    return res.status(200).json({ message: 'Cuenta deshabilitada correctamente', disabled: user.disabled });
  } catch (error) {
    return res.status(500).json({ message: 'Error al deshabilitar la cuenta', error });
  }
};

module.exports = { 
  changeProfileImage, 
  changePassword, 
  updateUserData, 
  updateSendNotifications, 
  disabledAccount 
};