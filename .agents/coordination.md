# 🔒 Multi-Conversation Coordination Log

> **Mục đích**: Giúp nhiều conversation Antigravity phối hợp, tránh conflict khi edit cùng file.
> **Quy tắc**: Mỗi conversation PHẢI đọc file này trước khi edit, và ghi lại file mình đang sửa.

---

## 📡 Active Conversations

- **`f56089fc`**: 🔴 Xong: Custom for You + Pulse Animation + Fix crash FloatingBasket.
    - Files: `BookingForm.tsx`, `BookingForm.logic.ts`, `BookingForm.i18n.ts`, `Customization/*` (NEW)


---

## 📜 Quy tắc phối hợp

1. **CHECK TRƯỚC**: Trước khi edit file, kiểm tra xem file đó có đang được conversation khác sửa không.
2. **GHI LẠI**: Khi bắt đầu sửa file, thêm entry vào mục Active Conversations.
3. **DỌN DẸP**: Khi xong việc, xóa hoặc đánh dấu 🔴 entry của mình.
4. **KHÔNG TRANH CHẤP**: Nếu file đã bị "khóa" bởi conversation khác → thông báo cho user và đợi.

---

## 📐 UI/UX Design Rules (Bổ sung mới)
- **Nút bấm chính (Call to Action/Footer Action)**: Kích thước bắt buộc phải dùng **chiều cao cố định** (ví dụ: `h-[72px]`, `h-20`), KHÔNG DÙNG padding dọc (`py-4`, `py-6`) để tránh nút bị co giãn sai lệch khi text/phiên dịch thay đổi kích thước. Kích thước này phải móc vào `CONFIG.BUTTON_HEIGHT`.

---

## 📋 Lịch sử (Log)

| Thời gian | Conversation | Hành động | File |
|-----------|-------------|-----------|------|
| 2026-03-25 | `63e8a52e` | Khởi tạo coordination.md | — |
| 2026-03-28 | `89e21468` | ✅ Fix P0→P3 BookingForm UI/UX (responsive, step indicator, validation, empty state, micro-animation) | `BookingForm.tsx` |
| 2026-03-31 | `891abe64` | ✅ Full BookingForm Redesign (Hybrid A+B Curator) — Intent Quiz, Visual Category Cards, Accordion, Floating Basket | `BookingForm.tsx`, `BookingForm.logic.ts`, `BookingForm.animation.ts`, `BookingForm.i18n.ts`, `categoryImages.ts` |
| 2026-04-01 | `f56089fc` | ✅ Redesign ServiceRow & ServiceDetailSheet (2-column Grid, USD Red Price, Font Sync) | `BookingForm.tsx`, `BookingForm.logic.ts` |
