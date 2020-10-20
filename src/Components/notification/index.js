import { notification } from 'antd';

export const typeNotification = {
  success: 'success',
  warning: 'warning',
  error: 'error',
};

const openNotification = (type, description) => {
  notification[type]({
    message:
      type === typeNotification.success
        ? 'Success'
        : type === typeNotification.warning
        ? 'Warning'
        : 'Error',
    description,
    placement: 'topRight',
  });
};
export default openNotification;
