const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/dbConfig');
const { sendWelcomeEmail } = require('../assets/emails/emailFunctions');
const secretKey = process.env.JWT_SECRET;

require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    secretKey,
    { expiresIn: '1h' }
  );
};

const createUser = async (req, res) => {
  const { name, lastname, email, password, rank } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está en uso' });
    }

    const validRanks = ['client', 'admin', 'seller', 'dealer'];
    const userRank = validRanks.includes(rank) ? rank : 'admin';

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      rank: userRank,
      firstactivity: new Date(),
      lastactivity: null,
      isActive: false,
    });

    try {
      await sendWelcomeEmail(email, { name, email });

      res.status(201).json({
        message: 'Usuario creado exitosamente. Se ha enviado un correo para iniciar sesión.',
        user: newUser,
      });
    } catch (emailError) {
      console.error('Error al enviar el correo:', emailError);
      res.status(201).json({
        message: 'Usuario creado, pero no se pudo enviar el correo de bienvenida.',
        user: newUser,
      });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((err) => err.message);
      return res.status(400).json({ message: 'Error de validación', errors: validationErrors });
    }

    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
};

const checkUserIsActive = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (user && user.isActive) {
      return res.status(200).json({ isActive: true });
    } else {
      return res.status(200).json({ isActive: false });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al verificar el estado de login', error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    if (user.disabled === '1') {
      return res.status(403).json({ message: 'Cuenta deshabilitada, contáctate con un administrador si consideras que se trata de un error.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    user.isActive = true;
    user.lastactivity = new Date();
    await user.save();

    const token = generateToken(user);

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ['password'] },
    });

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener la información del usuario', error });
  }
};

const exitSession = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (user) {
      user.isActive = false;
      await user.save();
      return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al cerrar sesión', error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
};

module.exports = { loginUser, createUser, checkUserIsActive, getUserInfo, exitSession, getAllUsers };