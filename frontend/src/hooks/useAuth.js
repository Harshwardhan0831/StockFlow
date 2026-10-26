import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, fetchMe, clearError } from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, initialized, loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
    return result;
  };

  const handleRegister = async (data) => {
    const result = await dispatch(register(data));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
    return result;
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const initAuth = () => dispatch(fetchMe());

  return {
    user,
    isAuthenticated,
    initialized,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    initAuth,
    clearError: () => dispatch(clearError()),
  };
}
