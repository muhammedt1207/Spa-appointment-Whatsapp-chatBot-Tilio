const twilio = require('twilio');
const moment = require('moment');
const { config } = require('dotenv');
config
class WhatsappService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioWhatsAppNumber = 'whatsapp:+14155238886'; 
    
    this.client = twilio(this.accountSid, this.authToken);

    this.services = [
      'Massage', 
      'Facial', 
      'Manicure', 
      'Pedicure', 
      'Hair Styling', 
      'Body Treatment'
    ];

    this.timeSlots = [
      '9:00 AM', '10:00 AM', '11:00 AM', 
      '1:00 PM', '2:00 PM', '3:00 PM', 
      '4:00 PM', '5:00 PM'
    ];
  }

  async sendWhatsAppMessage(to, message, mediaUrl = null, buttons = []) {
    try {
      const messageOptions = {
        from: this.twilioWhatsAppNumber,
        body: message,
        to: `whatsapp:${to}`
      };

      // Add media if provided
      if (mediaUrl) {
        messageOptions.mediaUrl = [mediaUrl];
      }

      // Send message with Twilio
      await this.client.messages.create(messageOptions);

      // If buttons are provided, send them separately
      if (buttons.length > 0) {
        const buttonMessage = buttons.map((btn, index) => 
          `${index + 1}. ${btn}`
        ).join('\n');

        await this.client.messages.create({
          from: this.twilioWhatsAppNumber,
          body: buttonMessage,
          to: `whatsapp:${to}`
        });
      }

      console.log('WhatsApp message sent successfully');
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  }

  async handleIncomingMessage(fromNumber, incomingMessage) {
    const message = incomingMessage.toLowerCase().trim();

    // Initial welcome flow
    if (message === 'hi' || message === 'hello' || message === 'start') {
      await this.sendWhatsAppMessage(
        fromNumber, 
        'Welcome to Oasis Spa and Salon!', 
        'https://example.com/spa-welcome-image.jpg', // Replace with actual image URL
        ['Book Appointment', 'Quick Appointment', 'More Services']
      );
      return;
    }

    // Handle button selections
    if (message.includes('book appointment')) {
      await this.sendWhatsAppMessage(
        fromNumber, 
        'To book an appointment, please select a time slot below, or tap "cancel" to cancel the booking',
        null,
        ['Select Your Time', 'Cancel']
      );
      return;
    }

    if (message.includes('select your time')) {
      const timeSlotsMessage = 'Available Time Slots:\n' + 
        this.timeSlots.map((slot, index) => 
          `${index + 1}. ${slot}`
        ).join('\n');
      
      await this.sendWhatsAppMessage(
        fromNumber, 
        timeSlotsMessage + '\n\nSelect a time slot for your appointment'
      );
      return;
    }

    // Time slot selection
    const selectedTimeIndex = this.timeSlots.findIndex((_, index) => 
      message.includes(`${index + 1}`)
    );

    if (selectedTimeIndex !== -1) {
      const selectedTime = this.timeSlots[selectedTimeIndex];
      await this.sendWhatsAppMessage(
        fromNumber, 
        `Your booking is confirmed for ${selectedTime}!\n\n` +
        'Spa Location:\n' +
        'Oasis Spa and Salon\n' +
        '123 Wellness Street\n' +
        'Cityville, State 12345\n\n' +
        `We look forward to welcoming you at ${selectedTime}!`
      );
      return;
    }

    // Quick appointment
    if (message.includes('quick appointment')) {
      await this.sendWhatsAppMessage(
        fromNumber, 
        'Click the link to book a quick appointment:',
        null,
        ['Book Now: http://localhost:3000']
      );
      return;
    }

    // More services
    if (message.includes('more services')) {
      const servicesMessage = 'Our Services:\n' + 
        this.services.map((service, index) => 
          `${index + 1}. ${service}`
        ).join('\n');
      
      await this.sendWhatsAppMessage(
        fromNumber, 
        'Here are the services we offer:\n\n' + 
        servicesMessage + 
        '\n\nContact Details:\n' +
        'Phone: +1 (555) 123-4567\n' +
        'Email: info@oasisspa.com',
        null,
        ['View Services', 'Contact Us']
      );
      return;
    }

    // Service selection
    const selectedServiceIndex = this.services.findIndex((_, index) => 
      message.includes(`${index + 1}`)
    );

    if (selectedServiceIndex !== -1) {
      const selectedService = this.services[selectedServiceIndex];
      await this.sendWhatsAppMessage(
        fromNumber, 
        `You selected ${selectedService}. Would you like to book an appointment for this service?`,
        null,
        ['Yes, Book Now', 'No, Go Back']
      );
      return;
    }

    // Default fallback
    await this.sendWhatsAppMessage(
      fromNumber, 
      'Sorry, I didn\'t understand that. Please choose an option from the menu.',
      null,
      ['Book Appointment', 'Quick Appointment', 'More Services']
    );
  }
}

module.exports = new WhatsappService();