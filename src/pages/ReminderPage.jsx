import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { FiBell, FiPlus } from 'react-icons/fi';
import Badge from '../components/common/Badge';
import { AlertContext } from '../contexts/AlertContext';
import ExportMenu from '../components/common/ExportMenu';
import { useReportExport } from '../hooks/useReportExport';
import * as reminderService from '../services/reminderService';
import * as patientService from '../services/patientService';
import * as authService from '../services/authService';

export default function ReminderPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: showError, success } = useContext(AlertContext);
  const { exportData, isExporting } = useReportExport();

  const [formData, setFormData] = useState({
    patient_id: '',
    display_name: '',
    scheduled_date: '',
    reminder_type: 'medication',
  });

  const columns = [
    { 
      key: 'patient_id', 
      label: 'Patient',
      render: (val, row) => {
        const patient = patients.find(p => p.patient_id === val);
        return patient?.full_name || `Patient ${val}`;
      }
    },
    { 
      key: 'patient_id', 
      label: 'Phone',
      render: (val) => {
        const patient = patients.find(p => p.patient_id === val);
        return patient?.phone_number || 'N/A';
      }
    },
    { 
      key: 'reminder_type', 
      label: 'Type',
      render: (type) => (
        <Badge variant={type === 'doctor_visit' ? 'info' : 'primary'}>
          {type === 'doctor_visit' ? 'Doctor Visit' : 'Medication'}
        </Badge>
      )
    },
    { 
      key: 'display_name', 
      label: 'Details',
      render: (val, row) => {
        const suff = row.reminder_type === 'doctor_visit' ? 'Dr. ' : '';
        return suff+val;
      }
    },
    {
      key: 'success_sent',
      label: 'Success Sent',
      render: (val) => (
        <Badge variant="success">{val || 0}</Badge>
      ),
    },
    {
      key: 'failed_sent',
      label: 'Failed Sent',
      render: (val) => (
        <Badge variant="danger">{val || 0}</Badge>
      ),
    },
    { 
      key: 'scheduled_date', 
      label: 'Scheduled Date (Muscat)',
      render: (date) => new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Muscat', hour12: true })
    },
  ];

  const handleExport = (format) => {
    exportData({
      data: reminders,
      columns: [
        { 
          key: 'patient_id', 
          label: 'Patient',
          exportRender: (val) => patients.find(p => p.patient_id === val)?.full_name || `Patient ${val}`
        },
        { 
          key: 'patient_id', 
          label: 'Phone',
          exportRender: (val) => patients.find(p => p.patient_id === val)?.phone_number || 'N/A'
        },
        { 
          key: 'reminder_type', 
          label: 'Type',
          exportRender: (val) => val === 'doctor_visit' ? 'Doctor Visit' : 'Medication'
        },
        { 
          key: 'display_name', 
          label: 'Details',
          exportRender: (val, row) => row.reminder_type === 'doctor_visit' ? `Dr. ${val}` : val
        },
        { key: 'success_sent', label: 'Success Sent' },
        { key: 'failed_sent', label: 'Failed Sent' },
        { 
          key: 'scheduled_date', 
          label: 'Scheduled Date',
          exportRender: (val) => new Date(val).toLocaleString('en-US', { timeZone: 'Asia/Muscat', hour12: true })
        },
      ],
      filename: `Reminders_${new Date().toISOString().split('T')[0]}`,
      format
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [remindersData, patientsData, doctorsData] = await Promise.all([
          reminderService.getReminders(),
          patientService.getPatients(),
          user?.role === 'admin' ? authService.getUsers('doctor') : Promise.resolve([]),
        ]);
        setReminders(remindersData);
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        showError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showError]);

  const handleCreateReminder = async () => {
    try {
      // Ensure scheduled_date is in ISO format (which is UTC by default in JS if not local)
      // Since datetime-local inputs work in the browser's local timezone, 
      // we might need to convert it to a specific format.
      // For Asia/Muscat, if the user is not in Muscat, we need to handle that.
      // A robust way is to append the timezone offset if needed or send as UTC.
      
      const dataToSubmit = {
        ...formData,
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
        display_name: formData.reminder_type === 'doctor_visit' 
          ? (user?.role === 'admin' ? formData.display_name : (user?.username || 'Admin')) 
          : formData.display_name
      };
      await reminderService.createReminder(dataToSubmit);
      success('Reminder created successfully!');
      setShowModal(false);
      setFormData({ 
        patient_id: '', 
        display_name: '', 
        scheduled_date: '',
        reminder_type: 'medication',
      });
      const remindersData = await reminderService.getReminders();
      setReminders(remindersData);
    } catch (err) {
      console.error('Error creating reminder:', err);
      showError('Failed to create reminder');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-2">Reminder Management</h1>
          <p className="text-secondary-600">Schedule and send SMS/Email reminders to patients</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={FiPlus}
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto"
        >
          Create Reminder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Success', value: reminders.reduce((acc, r) => acc + (r.success_sent || 0), 0), color: 'success' },
          { label: 'Total Failed', value: reminders.reduce((acc, r) => acc + (r.failed_sent || 0), 0), color: 'danger' },
        ].map((stat, idx) => (
          <Card key={idx}>
            <p className="text-secondary-500 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-secondary-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-secondary-900">Recent Reminders</h2>
          <div className="w-full sm:w-auto [&>div]:w-full [&_button]:w-full">
            <ExportMenu onExport={handleExport} isExporting={isExporting} />
          </div>
        </div>
        <Table columns={columns} data={reminders} hover striped />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Reminder"
        size="lg"
        footer={
          <div className="flex gap-4 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateReminder}
            >
              Create Reminder
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <Select
            label="Reminder Type"
            value={formData.reminder_type}
            onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value })}
            options={[
              { value: 'medication', label: 'Medication' },
              { value: 'doctor_visit', label: 'Doctor Visit' },
            ]}
          />

          <Select
            label="Patient"
            value={formData.patient_id}
            onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
            options={patients.map(p => ({ value: p.patient_id, label: p.full_name }))}
          />

          {formData.reminder_type === 'medication' ? (
            <Input
              label="Medication Name"
              placeholder="Enter medication name..."
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            />
          ) : user?.role === 'admin' ? (
            <Select
              label="Select Doctor"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              options={[
                { value: '', label: 'Select a doctor' },
                ...doctors.map(d => ({ value: d.username, label: `Dr. ${d.username}` }))
              ]}
            />
          ) : (
            <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
              <p className="text-sm text-secondary-600">
                <strong>Doctor:</strong> Dr. {user?.username || 'Admin'}
              </p>
              <p className="text-xs text-secondary-400 mt-1">
                The doctor name is automatically set to your account name.
              </p>
            </div>
          )}

          <Input
            label="Scheduled Date & Time"
            type="datetime-local"
            value={formData.scheduled_date}
            onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
