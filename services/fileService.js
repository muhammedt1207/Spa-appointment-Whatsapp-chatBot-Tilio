const fs = require('fs').promises;
const path = require('path');

class FileService {
  constructor(filePath = path.join(__dirname, '../appointments.txt')) {
    this.filePath = filePath;
  }

  async saveAppointmentsToFile(appointments) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(appointments, null, 2), 'utf8');
      console.log('Appointments saved successfully');
    } catch (error) {
      console.error('Error saving appointments:', error);
      throw error;
    }
  }

  async loadAppointmentsFromFile() {
    try {
      try {
        await fs.access(this.filePath);
      } catch {
        return [];
      }

      const data = await fs.readFile(this.filePath, 'utf8');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading appointments:', error);
      return [];
    }
  }

  async findAppointmentByPhone(phone) {
    const appointments = await this.loadAppointmentsFromFile();
    return appointments.find(appt => appt.phone === phone);
  }

  async addOrUpdateAppointment(appointmentData) {
    let appointments = await this.loadAppointmentsFromFile();
    
    const existingIndex = appointments.findIndex(appt => appt.phone === appointmentData.phone);
    
    if (existingIndex !== -1) {
      appointments[existingIndex] = { ...appointments[existingIndex], ...appointmentData };
    } else {
      appointments.push(appointmentData);
    }

    await this.saveAppointmentsToFile(appointments);
    return appointmentData;
  }

  async cancelAppointment(phone) {
    let appointments = await this.loadAppointmentsFromFile();
    
    const filteredAppointments = appointments.filter(appt => appt.phone !== phone);
    
    await this.saveAppointmentsToFile(filteredAppointments);
    return filteredAppointments.length < appointments.length;
  }
}

module.exports = new FileService();