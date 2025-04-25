import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = {
  // Success Toast
  notifySuccess: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Error Toast
  notifyError: (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Warning Toast
  notifyWarning: (message, { onConfirm }) => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p className="mb-2 font-semibold">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              No
            </button>
            <button
              onClick={() => { onConfirm(); closeToast(); }} 
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Yes
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  },
};

export default ToastNotification;
