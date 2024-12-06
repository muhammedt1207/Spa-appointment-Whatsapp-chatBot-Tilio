const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');

// Booking route
router.post('/book', AppointmentController.bookAppointment);

// Modification route
router.post('/modify', AppointmentController.modifyAppointment);

// Cancellation route
router.post('/cancel', AppointmentController.cancelAppointment);

module.exports = router;