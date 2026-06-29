export const formatPrice = (price: number, currency = 'VND') =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(price);

export const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateStr));

export const clsx = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');
