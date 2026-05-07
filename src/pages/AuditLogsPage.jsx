import { useState, useEffect, useContext } from 'react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import { AlertContext } from '../contexts/AlertContext';
import api from '../services/api';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useContext(AlertContext);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/audit-logs');
      setLogs(response.data);
    } catch (err) {
      showError('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      key: 'timestamp', 
      label: 'Timestamp',
      render: (val) => new Date(val).toLocaleString()
    },
    { key: 'user_id', label: 'Admin ID' },
    { key: 'action', label: 'Action' },
    { key: 'entity_type', label: 'Entity Type' },
    { key: 'entity_id', label: 'Entity ID' },
    { 
      key: 'details', 
      label: 'Details',
      render: (val) => val ? JSON.stringify(val) : 'None'
    }
  ];

  if (loading && logs.length === 0) {
    return <div className="flex items-center justify-center h-full">Loading logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Audit Logs</h1>
        <p className="text-secondary-600">Track all sensitive actions within the system</p>
      </div>

      <Card>
        <Table columns={columns} data={logs} hover striped />
      </Card>
    </div>
  );
}
