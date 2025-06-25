import { toast, ToastPosition, Zoom } from "react-toastify";

const showToast = (type: string, message: string) => {
  const options = {
    position: "top-right" as ToastPosition,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Zoom,
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    default:
      toast(message, options);
      break;
  }
};

export default showToast;