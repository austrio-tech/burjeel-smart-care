import { createContext, useReducer, useCallback, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return initialState;
    case 'RESTORE_TOKEN':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: !!action.payload.token,
        loading: false,
      };
    case 'RESTORE_TOKEN_ERROR':
      return { ...state, loading: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Bootstrap the app by restoring token from storage
  useEffect(() => {
    const bootstrapAsync = async () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { token, user: JSON.parse(user) },
          });
        } catch (e) {
          dispatch({ type: 'RESTORE_TOKEN_ERROR' });
        }
      } else {
        dispatch({ type: 'RESTORE_TOKEN_ERROR' });
      }
    };

    bootstrapAsync();
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(email, password);
      const { user, access_token } = response;

      localStorage.setItem('authToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token: access_token },
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.message || 'Login failed',
      });
      return { success: false, error: error.message || 'Login failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      await authService.register(userData);
      dispatch({ type: 'LOGIN_ERROR', payload: null });
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.message || 'Registration failed',
      });
      return { success: false, error: error.message || 'Registration failed' };
    }
  }, []);

  const updateUser = useCallback((userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_USER', payload: userData });
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
