/*
 * Page: /booking
 * Full-screen booking experience — reuses StandardMenu from wrb-noi-bo-dev
 * Flow: Menu (chọn dịch vụ) → Checkout (thông tin + ngày/giờ + xác nhận)
 */

import BookingPage from './BookingPage';

export const metadata = {
  title: 'Đặt Lịch | Ngân Hà Barbershop & Spa',
  description: 'Đặt lịch trực tuyến tại Ngân Hà Spa — chọn dịch vụ, thời gian và chi nhánh.',
};

const Page = () => {
  return <BookingPage />;
};

export default Page;
