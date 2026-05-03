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
import * as reminderService from '../services/reminderService';
import * as patientService from '../services/patientService';

export default function ReminderPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: showError, success } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    patient_id: '',
    medication_name: '',
    scheduled_date: '',
    reminder_type: 'medication',
    doctor_name: '',
  });

  const columns = [
    { key: 'patient_id', label: 'Patient ID' },
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
      key: 'medication_name', 
      label: 'Details',
      render: (val, row) => row.reminder_type === 'doctor_visit' ? `Dr. ${row.doctor_name}` : val
    },
    {
      key: 'sent_status',
      label: 'Status',
      render: (status) => (
        <Badge variant={status === 'sent' ? 'success' : 'warning'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      ),
    },
    { key: 'scheduled_date', label: 'Scheduled Date' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [remindersData, patientsData] = await Promise.all([
          reminderService.getReminders(),
          patientService.getPatients(),
        ]);
        setReminders(remindersData);
        setPatients(patientsData);
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
      const dataToSubmit = {
        ...formData,
        doctor_name: formData.reminder_type === 'doctor_visit' ? (user?.username || 'Admin') : null
      };
      await reminderService.createReminder(dataToSubmit);
      success('Reminder created successfully!');
      setShowModal(false);
      setFormData({ 
        patient_id: '', 
        medication_name: '', 
        scheduled_date: '',
        reminder_type: 'medication',
        doctor_name: '',
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">Reminder Management</h1>
          <p className="text-secondary-600">Schedule and send SMS/Email reminders to patients</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={FiPlus}
          onClick={() => setShowModal(true)}
        >
          Create Reminder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Sent', value: reminders.filter(r => r.sent_status === 'sent').length, color: 'primary' },
          { label: 'Pending', value: reminders.filter(r => r.sent_status === 'pending').length, color: 'warning' },
          { label: 'Failed', value: reminders.filter(r => r.sent_status === 'failed').length, color: 'danger' },
        ].map((stat, idx) => (
          <Card key={idx}>
            <p className="text-secondary-500 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-secondary-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-xl font-bold text-secondary-900 mb-6">Recent Reminders</h2>
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
              value={formData.medication_name}
              onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
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
            label="Scheduled Date"
            type="date"
            value={formData.scheduled_date}
            onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
