type NotificationFn = (message: string) => void;

interface NotificationService {
  success: NotificationFn;
  error: NotificationFn;
  warning: NotificationFn;
  info: NotificationFn;
}

const noop: NotificationFn = () => {};

export const notificationService: NotificationService = {
  success: noop,
  error: noop,
  warning: noop,
  info: noop,
};

export function setNotificationService(service: Partial<NotificationService>) {
  Object.assign(notificationService, service);
}
