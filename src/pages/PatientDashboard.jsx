import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { FiCalendar, FiClock, FiUser, FiPhone } from 'react-icons/fi';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Ahmed Al Mazrouei',
      speciality: 'Cardiology',
      date: '2024-04-28',
      time: '10:00 AM',
      status: 'upcoming',
    },
    {
      id: 2,
      doctor: 'Dr. Layla Hassan',
      speciality: 'General Checkup',
      date: '2024-05-05',
      time: '2:30 PM',
      status: 'scheduled',
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">My Health Portal</h1>
        <p className="text-secondary-600">Manage your appointments and health information</p>
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p>You have 2 upcoming appointments. Stay healthy!</p>
      </Card>

      {/* Upcoming Appointments */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-secondary-900">Upcoming Appointments</h2>
          <Button variant="primary">Book Appointment</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((apt) => (
            <Card key={apt.id} hoverable>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-primary-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-secondary-900">{apt.doctor}</h3>
                  <p className="text-sm text-secondary-500 mb-3">{apt.speciality}</p>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2 text-secondary-700">
                      <FiCalendar size={16} /> {apt.date}
                    </p>
                    <p className="flex items-center gap-2 text-secondary-700">
                      <FiClock size={16} /> {apt.time}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  {apt.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-secondary-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" fullWidth>
            View Medical History
          </Button>
          <Button variant="outline" fullWidth>
            Download Reports
          </Button>
          <Button variant="outline" fullWidth>
            Contact Doctor
          </Button>
        </div>
      </Card>
    </div>
  );
}
