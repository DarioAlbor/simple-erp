const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const getEmailAttachments = require('../assets/emails/emailAttachments');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, //       false587, true 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//    Handlebars como plantillas para Nodemailer
transporter.use('compile', hbs({
  viewEngine: {
    extname: '.hbs',
    partialsDir: path.resolve(__dirname, '../assets/emails/templates'), 
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, '../assets/emails/templates'),
  extName: '.hbs',
}));

// FUNCIÓN GENERICA PARA ENVIAR MAILS
const sendEmail = async ({ to, subject, template, context, attachments = [] }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      template,
      context, 
      attachments: [...getEmailAttachments(), ...attachments],
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = sendEmail;