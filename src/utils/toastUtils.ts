import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showSuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    style: {
      background: 'linear-gradient(135deg, #11998e, #38ef7d)',
      color: 'white',
      fontWeight: 500,
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
    }
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    style: {
      background: 'linear-gradient(135deg, #f093fb, #f5576c)',
      color: 'white',
      fontWeight: 500,
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
    }
  });
};

export const showWarning = (message: string) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    style: {
      background: 'linear-gradient(135deg, #FF6B6B, #FF9F43)',
      color: 'white',
      fontWeight: 500,
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
    }
  });
};

export const showInfo = (message: string) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    style: {
      background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      color: 'white',
      fontWeight: 500,
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
    }
  });
};