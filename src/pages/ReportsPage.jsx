import { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { FiDownload, FiFilter } from 'react-icons/fi';
import { AlertContext } from '../contexts/AlertContext';
import * as reportsService from '../services/reportsService';
import * as patientService from '../services/patientService';
import * as reminderService from '../services/reminderService';
import * as attendanceService from '../services/attendanceService';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    avgAttendance: 0,
    remindersSent: 0,
    appointments: 0,
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [reminderData, setReminderData] = useState([]);
  const { error: showError } = useContext(AlertContext);

  const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patients, reminders, attendances, attendanceReport] = await Promise.all([
          patientService.getPatients(),
          reminderService.getReminders(),
          attendanceService.getAttendances(),
          reportsService.getAttendanceReport(),
        ]);

        setStats({
          totalPatients: patients.length,
          avgAttendance: attendanceReport?.attendance_rate || 0,
          remindersSent: reminders.filter(r => r.sent_status === 'sent').length,
          appointments: attendances.length,
        });

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyData = days.map(day => ({
          date: day,
          present: 0,
          absent: 0,
          late: 0,
        }));

        attendances.forEach(att => {
          const date = new Date(att.appointment_date);
          const dayName = days[date.getDay()];
          const dayData = weeklyData.find(d => d.date === dayName);
          if (dayData) {
            if (att.status === 'present' || att.status === 'came') dayData.present++;
            else if (att.status === 'absent' || att.status === 'not came') dayData.absent++;
            else if (att.status === 'late') dayData.late++;
          }
        });
        setAttendanceData(weeklyData);

        setReminderData([
          { name: 'Sent', value: reminders.filter(r => r.sent_status === 'sent').length },
          { name: 'Delivered', value: reminders.filter(r => r.delivery_confirmation === 'delivered').length },
          { name: 'Failed', value: reminders.filter(r => r.sent_status === 'failed').length },
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
        showError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showError]);

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">Reports & Analytics</h1>
        <p className="text-secondary-600">View comprehensive hospital statistics and reports</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={[
              { value: 'attendance', label: 'Attendance' },
              { value: 'reminders', label: 'Reminders' },
              { value: 'appointments', label: 'Appointments' },
            ]}
          />

          <Select
            label="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'year', label: 'This Year' },
            ]}
          />

          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="primary" icon={FiFilter}>
            Apply Filters
          </Button>
          <Button variant="outline" icon={FiDownload}>
            Export Report
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Patients', value: stats.totalPatients, change: '+12%' },
          { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, change: '+2.1%' },
          { label: 'Reminders Sent', value: stats.remindersSent, change: '+5.3%' },
          { label: 'Appointments', value: stats.appointments, change: '-3.2%' },
        ].map((metric, idx) => (
          <Card key={idx}>
            <p className="text-secondary-500 text-sm font-medium mb-1">{metric.label}</p>
            <p className="text-3xl font-bold text-secondary-900 mb-2">{metric.value}</p>
            <p className={`text-sm font-semibold ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-secondary-900 mb-6">Weekly Attendance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#10b981" />
              <Bar dataKey="absent" fill="#ef4444" />
              <Bar dataKey="late" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-secondary-900 mb-6">Reminder Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={reminderData} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
                {reminderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
