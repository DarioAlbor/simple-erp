const sendEmail = require('../../config/emailConfig');

const sendWelcomeEmail = async (to, user) => {
  await sendEmail({
    to,
    subject: 'Bienvenido al software de gestión gratuito',
    template: 'welcome',
    context: {
      name: user.name,
      email: user.email,
      defaultPassword: 'OPENSOURCE',
    },
  });
};

module.exports = {
  sendWelcomeEmail,
};