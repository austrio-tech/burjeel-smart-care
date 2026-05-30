/*
 * ReportsPage.jsx
 * This analytics page is visible to admins. It displays hospital-wide statistics
 * through summary cards and two charts: a weekly attendance bar chart and a reminder
 * delivery pie chart. Staff can also filter and export the raw data as a file.
 */

import { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { FiFilter } from 'react-icons/fi';
import ExportMenu from '../components/common/ExportMenu';
import { useReportExport } from '../hooks/useReportExport';
import { AlertContext } from '../contexts/AlertContext';
import * as reportsService from '../services/reportsService';
import * as patientService from '../services/patientService';
import * as reminderService from '../services/reminderService';
import * as attendanceService from '../services/attendanceService';

export default function ReportsPage() {
  // reportType determines which dataset is used when exporting (attendance, reminders, appointments).
  const [reportType, setReportType] = useState('attendance');
  // dateRange is selected in a dropdown but currently used for UI only (export uses startDate/endDate).
  const [dateRange, setDateRange] = useState('month');
  // startDate and endDate are optional filters applied when exporting data.
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  // stats holds the four headline numbers shown in the summary cards.
  const [stats, setStats] = useState({
    totalPatients: 0,
    avgAttendance: 0,
    remindersSent: 0,
    appointments: 0,
  });
  // attendanceData is shaped for the bar chart: one entry per day of the week.
  const [attendanceData, setAttendanceData] = useState([]);
  // reminderData is shaped for the pie chart: sent vs. failed counts.
  const [reminderData, setReminderData] = useState([]);
  // rawData keeps the original API responses so the export handler can apply date filters.
  const [rawData, setRawData] = useState({ patients: [], reminders: [], attendances: [] });
  const { error: showError } = useContext(AlertContext);
  const { exportData, isExporting } = useReportExport();

  // Colour palette used for pie chart slices.
  const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

  /*
   * Runs once on mount. Fetches all four data sources in parallel, then processes
   * the attendance records into a day-of-week breakdown for the bar chart.
   */
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

        // Store the raw arrays so handleExport can filter them later.
        setRawData({ patients, reminders, attendances });

        setStats({
          totalPatients: patients.length,
          avgAttendance: attendanceReport?.attendance_rate || 0,
          // reduce sums up the success_sent field across all reminders.
          remindersSent: reminders.reduce((acc, r) => acc + (r.success_sent || 0), 0),
          appointments: attendances.length,
        });

        // Build an array of seven day buckets. Each attendance record is sorted into the
        // bucket for its day of the week using JavaScript's getDay() (0 = Sunday).
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
            // Increment the correct counter based on the attendance status value.
            if (att.status === 'present' || att.status === 'came') dayData.present++;
            else if (att.status === 'absent' || att.status === 'not came') dayData.absent++;
            else if (att.status === 'late') dayData.late++;
          }
        });
        setAttendanceData(weeklyData);

        // Aggregate total sent and failed counts across all reminders for the pie chart.
        setReminderData([
          { name: 'Sent', value: reminders.reduce((acc, r) => acc + (r.success_sent || 0), 0) },
          { name: 'Failed', value: reminders.reduce((acc, r) => acc + (r.failed_sent || 0), 0) },
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

  // Builds the correct dataset for the selected report type, applies optional date filters,
  // then triggers a file download in the chosen format.
  const handleExport = (format) => {
    let dataToExport = [];
    let columns = [];

    // Choose which raw dataset to export based on the reportType dropdown selection.
    if (reportType === 'attendance' || reportType === 'appointments') {
      dataToExport = rawData.attendances;
      columns = [
        { key: 'appointment_date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
        { key: 'status', label: 'Status' },
        { key: 'notes', label: 'Notes' },
      ];
    } else if (reportType === 'reminders') {
      dataToExport = rawData.reminders;
      columns = [
        { key: 'scheduled_date', label: 'Scheduled Date', render: (val) => new Date(val).toLocaleString() },
        { key: 'reminder_type', label: 'Type' },
        { key: 'display_name', label: 'Detail' },
        { key: 'success_sent', label: 'Success Sent' },
        { key: 'failed_sent', label: 'Failed Sent' },
      ];
    }

    // If the user typed a start date, remove all records earlier than that date.
    if (startDate) {
      dataToExport = dataToExport.filter(item => {
        const d = new Date(item.appointment_date || item.scheduled_date);
        return d >= new Date(startDate);
      });
    }
    // If the user typed an end date, remove all records after the end of that day.
    if (endDate) {
      dataToExport = dataToExport.filter(item => {
        const d = new Date(item.appointment_date || item.scheduled_date);
        const end = new Date(endDate);
        // setHours(23,59,59,999) sets the end time to the very last millisecond of the day.
        end.setHours(23, 59, 59, 999);
        return d <= end;
      });
    }

    exportData({
      data: dataToExport,
      columns,
      filename: `${reportType}_report_${new Date().toISOString().split('T')[0]}`,
      format
    });
  };

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

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" icon={FiFilter} className="w-full sm:w-auto">
            Apply Filters
          </Button>
          <div className="w-full sm:w-auto [&>div]:w-full sm:[&>div]:w-auto [&_button]:w-full sm:[&_button]:w-auto">
            <ExportMenu onExport={handleExport} isExporting={isExporting} />
          </div>
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
            {/* Show the trend value in green if it starts with '+', red if it starts with '-'. */}
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
