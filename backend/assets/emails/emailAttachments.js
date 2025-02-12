const path = require('path');

const getEmailAttachments = () => {
  return [
    {
      filename: 'logo.png',
      path: path.join(__dirname, '../images/logo.png'),
      cid: 'logo@DARIOALBOR' // CID único para el logo
    },
    {
      filename: 'illustrationhello.png',
      path: path.join(__dirname, '../images/illustrationhello.png'),
      cid: 'illustrationhello@DARIOALBOR' // CID único para la ilustración principal
    },
    {
      filename: 'x.png',
      path: path.join(__dirname, '../images/x.png'),
      cid: 'x@DARIOALBOR' // CID único para la imagen de X (Twitter)
    },
    {
      filename: 'instagram.png',
      path: path.join(__dirname, '../images/instagram.png'),
      cid: 'instagram@DARIOALBOR' // CID único para la imagen de Instagram
    },
    {
      filename: 'linkedin.png',
      path: path.join(__dirname, '../images/linkedin.png'),
      cid: 'linkedin@DARIOALBOR' // CID único para la imagen de LinkedIn
    },
  ];
};

module.exports = getEmailAttachments;