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
        ? 'Thành công'
        : type === typeNotification.warning
        ? 'Cảnh báo'
        : 'Lỗi',
    description,
    placement: 'topRight',
  });
};
export default openNotification;
