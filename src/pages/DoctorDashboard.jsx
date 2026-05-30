import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCalendar, FiClock } from 'react-icons/fi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Loader from '../components/common/Loader';
import ExportMenu from '../components/common/ExportMenu';
import { useReportExport } from '../hooks/useReportExport';
import { AlertContext } from '../contexts/AlertContext';
import * as patientService from '../services/patientService';
import * as reminderService from '../services/reminderService';
import { useAuth } from '../hooks/useAuth';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    myReminders: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const { error } = useContext(AlertContext);
  const { exportData, isExporting } = useReportExport();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patients, reminders] = await Promise.all([
          patientService.getPatients(),
          reminderService.getReminders(),
        ]);

        const today = new Date().toISOString().split('T')[0];
        const upcoming = reminders.filter(r => r.reminder_type === 'doctor_visit' && r.scheduled_date && r.scheduled_date >= today);

        setStats({
          totalPatients: patients.length,
          upcomingAppointments: upcoming.length,
          myReminders: reminders.length, // Already filtered by backend
        });

        setRecentAppointments(
          upcoming
            .slice()
            .sort((a, b) => new Date(b.scheduled_date) - new Date(a.scheduled_date))
            .slice(0, 10)
            .map(r => {
            const patient = patients.find(p => p.patient_id === r.patient_id);
            return {
              id: r.reminder_id,
              patientName: patient?.full_name || `Patient ${r.patient_id}`,
              status: r.success_sent > 0 ? 'Notified' : 'Pending',
              time: new Date(r.scheduled_date).toLocaleString('en-US', { timeZone: 'Asia/Muscat', hour12: true }),
            };
          })
        );
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [error]);

  const columns = [
    { key: 'patientName', label: 'Patient Name' },
    { key: 'time', label: 'Time' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === 'Notified'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  const handleExport = (format) => {
    exportData({
      data: recentAppointments,
      columns: [
        { key: 'patientName', label: 'Patient Name' },
        { key: 'status', label: 'Status' },
        { key: 'time', label: 'Time' },
      ],
      filename: `DoctorDashboard_Appointments_${new Date().toISOString().split('T')[0]}`,
      format
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">Doctor Dashboard</h1>
        <p className="text-secondary-600">Welcome, Dr. {user?.username}! Here is your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: FiUsers, label: 'Total Patients', value: stats.totalPatients, color: 'primary' },
          { icon: FiCalendar, label: 'Upcoming Appointments', value: stats.upcomingAppointments, color: 'info' },
          { icon: FiClock, label: 'Active Reminders', value: stats.myReminders, color: 'warning' },
        ].map((stat, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-secondary-500 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-secondary-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Upcoming Appointments</h2>
            <p className="text-secondary-500 text-sm">Your scheduled patient visits</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto [&>div]:w-full sm:[&>div]:w-auto">
            <ExportMenu onExport={handleExport} isExporting={isExporting} />
            <Button variant="outline" onClick={() => navigate('/admin/reminders')} className="flex-1 sm:flex-none">View All</Button>
          </div>
        </div>
        <Table columns={columns} data={recentAppointments} hover striped />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Patient Management</h3>
          <Button variant="primary" fullWidth onClick={() => navigate('/admin/patients')}>
            View Patients
          </Button>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Messages</h3>
          <Button variant="secondary" fullWidth onClick={() => navigate('/admin/chat')}>
            Open Chat
          </Button>
        </Card>
      </div>
    </div>
  );
}
