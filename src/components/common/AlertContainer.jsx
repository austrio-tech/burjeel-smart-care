import { useContext } from 'react';
import { AlertContext } from '../../contexts/AlertContext';
import Alert from './Alert';

export default function AlertContainer() {
  const { alerts, removeAlert } = useContext(AlertContext);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-3 pointer-events-none">
      {alerts.map((alert) => (
        <div key={alert.id} className="pointer-events-auto">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
            autoClose={true}
          />
        </div>
      ))}
    </div>
  );
}
