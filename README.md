# Spa Appointment Booking System

## Overview
A comprehensive spa appointment booking system with WhatsApp integration, built using Node.js and Express.js.

## Features
- Web-based booking interface
- WhatsApp booking and management
- File-based appointment storage
- Real-time notifications

## Prerequisites
- Node.js (v14+ recommended)
- Twilio Account (for WhatsApp integration)
- npm

## Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/spa-booking-system.git
cd spa-booking-system
```

2. Install dependencies
```bash
npm install
```

3. Configure Twilio
- Create a `.env` file
- Add your Twilio credentials:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
```

4. Start the server
```bash
npm start
```

## Endpoints
- `GET /`: Booking form
- `POST /api/appointments/book`: Book an appointment
- `POST /api/appointments/modify`: Modify an appointment
- `POST /api/appointments/cancel`: Cancel an appointment
- `POST /whatsapp/webhook`: WhatsApp message handler

## WhatsApp Commands
- BOOK: Start booking process
- CHECK: View existing appointment
- CANCEL: Cancel appointment

## Future Enhancements
- Database integration
- Advanced scheduling
- Payment processing