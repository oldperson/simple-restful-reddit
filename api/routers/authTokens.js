const express = require('express');

const router = express.Router();

// Methods

// get the authtoken
router.post('', (req, res) => {
  res.json({
    token: 'asdfasdg',
  });
});

// delete the authtocken
router.delete('', (req, res) => {
  res.json({
    message: 'token is deleted',
  });
});

module.exports = router;
