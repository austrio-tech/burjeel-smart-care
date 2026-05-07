import { useState, useEffect, useContext } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { FiSearch, FiDownload, FiPlus } from 'react-icons/fi';
import { AlertContext } from '../contexts/AlertContext';
import * as attendanceService from '../services/attendanceService';
import * as patientService from '../services/patientService';

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { error: showError, success: showSuccess } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    patient_id: '',
    status: 'present',
    appointment_date: new Date().toISOString().split('T')[0],
  });

  const columns = [
    { key: 'patient_id', label: 'Patient ID' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === 'present' || status === 'came'
              ? 'bg-green-100 text-green-800'
              : status === 'late'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    { key: 'appointment_date', label: 'Date' },
    { key: 'timestamp', label: 'Time', render: (t) => t ? new Date(t).toLocaleTimeString() : '-' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attendances, patientsData] = await Promise.all([
        attendanceService.getAttendances(),
        patientService.getPatients(),
      ]);
      setAttendanceData(attendances);
      setPatients(patientsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      showError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patient_id) {
      showError('Please select a patient');
      return;
    }
    setSubmitting(true);
    try {
      await attendanceService.createAttendance({
        ...formData,
        patient_id: parseInt(formData.patient_id)
      });
      showSuccess('Attendance marked successfully');
      setIsModalOpen(false);
      setFormData({
        patient_id: '',
        status: 'present',
        appointment_date: new Date().toISOString().split('T')[0],
      });
      fetchData();
    } catch (err) {
      showError(err.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = attendanceData.filter((item) =>
    item.patient_id.toString().includes(searchTerm)
  );

  const presentCount = filteredData.filter(a => a.status === 'present' || a.status === 'came').length;
  const absentCount = filteredData.filter(a => a.status === 'absent' || a.status === 'not came').length;
  const lateCount = filteredData.filter(a => a.status === 'late').length;
  const totalCount = filteredData.length;
  const attendanceRate = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;

  if (loading && attendanceData.length === 0) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-2">Attendance Tracking</h1>
          <p className="text-secondary-600">Monitor patient attendance and check-in times</p>
        </div>
        <Button variant="primary" icon={FiPlus} onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          Mark Attendance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Present', value: presentCount, color: 'bg-green-100 text-green-800' },
          { label: 'Absent', value: absentCount, color: 'bg-red-100 text-red-800' },
          { label: 'Late', value: lateCount, color: 'bg-yellow-100 text-yellow-800' },
          { label: 'Attendance Rate', value: `${attendanceRate}%`, color: 'bg-blue-100 text-blue-800' },
        ].map((stat, idx) => (
          <Card key={idx}>
            <p className="text-secondary-500 text-sm font-medium mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color.split(' ')[0]} px-4 py-2 rounded inline-block`}>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap items-stretch sm:items-end">
          <Input
            placeholder="Search patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={FiSearch}
            className="flex-1 w-full sm:min-w-64"
          />
          <div className="flex gap-4 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">Filter</Button>
            <Button variant="secondary" icon={FiDownload} className="flex-1 sm:flex-none">
              Export
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-secondary-900 mb-6">Attendance Log</h2>
        <Table columns={columns} data={filteredData} hover striped />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Mark Patient Attendance"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Select Patient"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Choose a patient...' },
              ...patients.map(p => ({ value: p.patient_id, label: `${p.full_name} (ID: ${p.patient_id})` }))
            ]}
            required
          />
          <Select
            label="Attendance Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: 'present', label: 'Present' },
              { value: 'absent', label: 'Absent' },
              { value: 'late', label: 'Late' },
            ]}
            required
          />
          <Input
            label="Appointment Date"
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleInputChange}
            required
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Save Attendance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
