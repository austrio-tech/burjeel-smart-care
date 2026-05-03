import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiBell, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Loader from '../components/common/Loader';
import { AlertContext } from '../contexts/AlertContext';
import * as patientService from '../services/patientService';
import * as reminderService from '../services/reminderService';
import * as reportsService from '../services/reportsService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    remindersToday: 0,
    attendanceRate: 0,
    appointments: 0,
  });
  const [recentReminders, setRecentReminders] = useState([]);
  const { error } = useContext(AlertContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patients, reminders, attendanceReport] = await Promise.all([
          patientService.getPatients(),
          reminderService.getReminders(),
          reportsService.getAttendanceReport(),
        ]);

        setStats({
          totalPatients: patients.length,
          remindersToday: reminders.filter(r => r.sent_status === 'sent').length,
          attendanceRate: attendanceReport?.attendance_rate || 0,
          appointments: attendanceReport?.total_attendances || 0,
        });

        setRecentReminders(
          reminders.slice(0, 10).map(r => ({
            id: r.reminder_id,
            patientName: `Patient ${r.patient_id}`,
            phone: '',
            status: r.sent_status,
            time: new Date(r.created_at).toLocaleString(),
          }))
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
    { key: 'phone', label: 'Phone' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === 'sent'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    { key: 'time', label: 'Time' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">Dashboard</h1>
        <p className="text-secondary-600">Welcome back! Here's what's happening with your hospital.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: FiUsers, label: 'Total Patients', value: stats.totalPatients, color: 'primary' },
          { icon: FiBell, label: 'Reminders Today', value: stats.remindersToday, color: 'warning' },
          { icon: FiCheckCircle, label: 'Attendance Rate', value: `${stats.attendanceRate}%`, color: 'success' },
          { icon: FiTrendingUp, label: 'Appointments', value: stats.appointments, color: 'info' },
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Recent Reminders</h2>
            <p className="text-secondary-500 text-sm">Latest SMS reminders sent to patients</p>
          </div>
          <Button variant="outline">View All</Button>
        </div>
        <Table columns={columns} data={recentReminders} hover striped />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Send Reminder</h3>
          <Button variant="primary" fullWidth onClick={() => navigate('/admin/reminders')}>
            Create Reminder
          </Button>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">View Reports</h3>
          <Button variant="secondary" fullWidth onClick={() => navigate('/admin/reports')}>
            Generate Report
          </Button>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Patient Management</h3>
          <Button variant="outline" fullWidth onClick={() => navigate('/admin/patients')}>
            Manage Patients
          </Button>
        </Card>
      </div>
    </div>
  );
}
