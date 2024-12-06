const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const FileService = require('../services/fileService');
const WhatsappService = require('../services/WhatsappService');

// Twilio webhook for incoming WhatsApp messages
router.post('/webhook', async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const incomingMessage = req.body.Body.toLowerCase().trim();
  const fromNumber = req.body.From.replace('whatsapp:', '');

  try {
    // Basic command parsing
    if (incomingMessage.includes('book')) {
      // Guide user to booking process
      await WhatsappService.sendWhatsAppMessage(
        fromNumber, 
        'To book an appointment, please provide:\nName\nService\nDate (DD-MM-YYYY)\nTime\nAny additional notes'
      );
    } else if (incomingMessage.includes('check')) {
      // Check existing appointment
      const appointment = await FileService.findAppointmentByPhone(fromNumber);
      
      if (appointment) {
        const confirmationMessage = WhatsappService.formatAppointmentMessage(appointment);
        await WhatsappService.sendWhatsAppMessage(fromNumber, confirmationMessage);
      } else {
        await WhatsappService.sendWhatsAppMessage(
          fromNumber, 
          'No existing appointment found for this number.'
        );
      }
    } else if (incomingMessage.includes('cancel')) {
      // Cancel appointment
      const cancelResult = await FileService.cancelAppointment(fromNumber);
      
      if (cancelResult) {
        await WhatsappService.sendWhatsAppMessage(
          fromNumber, 
          '❌ Your appointment has been cancelled successfully.'
        );
      } else {
        await WhatsappService.sendWhatsAppMessage(
          fromNumber, 
          'No appointment found to cancel.'
        );
      }
    } else {
      // Default help message
      await WhatsappService.sendWhatsAppMessage(
        fromNumber, 
        'Welcome to Spa Booking! Available commands:\n- BOOK: Start booking\n- CHECK: View appointment\n- CANCEL: Cancel appointment'
      );
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    res.status(500).send('Error processing request');
  }
});

module.exports = router;