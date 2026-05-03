import { createContext, useReducer, useCallback } from 'react';

export const AlertContext = createContext();

const initialState = {
  alerts: [],
};

function alertReducer(state, action) {
  switch (action.type) {
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [...state.alerts, { id: Date.now(), ...action.payload }],
      };
    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      };
    case 'CLEAR_ALERTS':
      return { ...state, alerts: [] };
    default:
      return state;
  }
}

export function AlertProvider({ children }) {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  const addAlert = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    dispatch({
      type: 'ADD_ALERT',
      payload: { message, type, id },
    });

    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_ALERT', payload: id });
      }, duration);
    }

    return id;
  }, []);

  const removeAlert = useCallback((id) => {
    dispatch({ type: 'REMOVE_ALERT', payload: id });
  }, []);

  const success = useCallback((message, duration) => {
    return addAlert(message, 'success', duration);
  }, [addAlert]);

  const error = useCallback((message, duration) => {
    return addAlert(message, 'error', duration);
  }, [addAlert]);

  const warning = useCallback((message, duration) => {
    return addAlert(message, 'warning', duration);
  }, [addAlert]);

  const info = useCallback((message, duration) => {
    return addAlert(message, 'info', duration);
  }, [addAlert]);

  const clearAlerts = useCallback(() => {
    dispatch({ type: 'CLEAR_ALERTS' });
  }, []);

  return (
    <AlertContext.Provider
      value={{
        alerts: state.alerts,
        addAlert,
        removeAlert,
        success,
        error,
        warning,
        info,
        clearAlerts,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}
