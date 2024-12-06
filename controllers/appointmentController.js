const FileService = require('../services/fileService');
const WhatsappService = require('../services/WhatsappService');
const { v4: uuidv4 } = require('uuid');

class AppointmentController {
  async bookAppointment(req, res) {
    try {
      const { name, phone, service, date, time, notes } = req.body;

      // Validate required fields
      if (!name || !phone || !service || !date || !time) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required appointment details' 
        });
      }

      const appointmentData = {
        id: uuidv4(),
        name,
        phone,
        service,
        date,
        time,
        notes: notes || '',
        createdAt: new Date().toISOString()
      };

      const savedAppointment = await FileService.addOrUpdateAppointment(appointmentData);
      
      // Send WhatsApp confirmation
      await WhatsappService.notifyAppointmentConfirmation(savedAppointment);

      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        appointment: savedAppointment
      });
    } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error booking appointment' 
      });
    }
  }

  async modifyAppointment(req, res) {
    try {
      const { phone, ...updateData } = req.body;

      if (!phone) {
        return res.status(400).json({ 
          success: false, 
          message: 'Phone number is required' 
        });
      }

      const existingAppointment = await FileService.findAppointmentByPhone(phone);
      
      if (!existingAppointment) {
        return res.status(404).json({ 
          success: false, 
          message: 'Appointment not found' 
        });
      }

      const updatedAppointment = await FileService.addOrUpdateAppointment({
        ...existingAppointment,
        ...updateData,
        phone
      });

      // Send WhatsApp update notification
      await WhatsappService.notifyAppointmentConfirmation(updatedAppointment);

      res.status(200).json({
        success: true,
        message: 'Appointment updated successfully',
        appointment: updatedAppointment
      });
    } catch (error) {
      console.error('Modification error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error modifying appointment' 
      });
    }
  }

  async cancelAppointment(req, res) {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({ 
          success: false, 
          message: 'Phone number is required' 
        });
      }

      const existingAppointment = await FileService.findAppointmentByPhone(phone);
      
      if (!existingAppointment) {
        return res.status(404).json({ 
          success: false, 
          message: 'Appointment not found' 
        });
      }

      const cancelResult = await FileService.cancelAppointment(phone);

      // Optional: Send WhatsApp cancellation confirmation
      await WhatsappService.sendWhatsAppMessage(
        phone, 
        '❌ Your spa appointment has been successfully cancelled. We hope to see you again soon! 💆‍♀️'
      );

      res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully'
      });
    } catch (error) {
      console.error('Cancellation error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error cancelling appointment' 
      });
    }
  }
}

module.exports = new AppointmentController();