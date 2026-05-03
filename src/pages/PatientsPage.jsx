import { useState, useEffect, useContext } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { FiSearch, FiPlus, FiUser, FiMail, FiLock, FiPhone, FiFileText, FiCalendar } from 'react-icons/fi';
import { AlertContext } from '../contexts/AlertContext';
import * as patientService from '../services/patientService';

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { error: showError, success: showSuccess } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    medical_record_ref: '',
    registered_date: new Date().toISOString().split('T')[0],
  });

  const columns = [
    { key: 'patient_id', label: 'ID' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'phone_number', label: 'Phone' },
    { key: 'medical_record_ref', label: 'MRN' },
    { key: 'registered_date', label: 'Registered' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      showError('Failed to load patients');
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
    setSubmitting(true);
    try {
      await patientService.createPatient(formData);
      showSuccess('Patient added successfully');
      setIsModalOpen(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        full_name: '',
        phone_number: '',
        medical_record_ref: '',
        registered_date: new Date().toISOString().split('T')[0],
      });
      fetchData();
    } catch (err) {
      showError(err.message || 'Failed to add patient');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patient_id.toString().includes(searchTerm) ||
    p.medical_record_ref?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && patients.length === 0) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">Patient Management</h1>
          <p className="text-secondary-600">View and manage hospital patients</p>
        </div>
        <Button variant="primary" icon={FiPlus} onClick={() => setIsModalOpen(true)}>
          Add Patient
        </Button>
      </div>

      <Card>
        <div className="flex gap-4">
          <Input
            placeholder="Search by name, ID or MRN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={FiSearch}
            className="flex-1"
          />
        </div>
      </Card>

      <Card>
        <Table columns={columns} data={filteredPatients} hover striped />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Patient"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              icon={FiUser}
              required
            />
            <Input
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              icon={FiPhone}
              required
            />
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              icon={FiUser}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              icon={FiMail}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              icon={FiLock}
              required
            />
            <Input
              label="Medical Record Ref (MRN)"
              name="medical_record_ref"
              value={formData.medical_record_ref}
              onChange={handleInputChange}
              icon={FiFileText}
            />
            <Input
              label="Registration Date"
              type="date"
              name="registered_date"
              value={formData.registered_date}
              onChange={handleInputChange}
              icon={FiCalendar}
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Create Patient
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
