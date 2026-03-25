# 🔒 Multi-Conversation Coordination Log

> **Mục đích**: Giúp nhiều conversation Antigravity phối hợp, tránh conflict khi edit cùng file.
> **Quy tắc**: Mỗi conversation PHẢI đọc file này trước khi edit, và ghi lại file mình đang sửa.

---

## 📡 Active Conversations

_(Trống — chưa có conversation nào đang hoạt động)_

---

## 📜 Quy tắc phối hợp

1. **CHECK TRƯỚC**: Trước khi edit file, kiểm tra xem file đó có đang được conversation khác sửa không.
2. **GHI LẠI**: Khi bắt đầu sửa file, thêm entry vào mục Active Conversations.
3. **DỌN DẸP**: Khi xong việc, xóa hoặc đánh dấu 🔴 entry của mình.
4. **KHÔNG TRANH CHẤP**: Nếu file đã bị "khóa" bởi conversation khác → thông báo cho user và đợi.

---

## 📋 Lịch sử (Log)

| Thời gian | Conversation | Hành động | File |
|-----------|-------------|-----------|------|
| 2026-03-25 | `63e8a52e` | Khởi tạo coordination.md | — |
