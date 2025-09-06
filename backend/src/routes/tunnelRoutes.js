const express = require('express');
const tunnelController = require('../controllers/tunnelController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.authenticate);

// Tunnel routes
router.post('/tunnels/generate', tunnelController.generateTunnels);
router.get('/tunnels/:id', tunnelController.getTunnelById);
router.get('/projects/:id/tunnels', tunnelController.getProjectTunnels);
router.put('/tunnels/:id/verify', tunnelController.verifyTunnel);
router.delete('/tunnels/:id', tunnelController.deleteTunnel);

module.exports = router;