---
description: Quy tắc tổ chức CSS theo component — KHÔNG viết trực tiếp vào globals.css
---

# 🎨 CSS Organization

> **Trigger**: Mỗi khi cần viết hoặc chỉnh sửa CSS.

## Quy tắc bắt buộc

1. **KHÔNG viết CSS trực tiếp vào `globals.css`**
   - `globals.css` chỉ chứa `@import` statements
   - Mọi CSS phải nằm trong `src/styles/` theo component tương ứng

2. **Cấu trúc thư mục `src/styles/`**:
   ```
   src/styles/
   ├── base.css               # :root variables, reset, body
   ├── header.css             # Header, nav, logo, mobile menu, responsive
   ├── hero.css               # Hero section, cinematic, particles, countdown
   ├── about.css              # About/OurStory section
   ├── services.css           # Section Services
   ├── floating-widgets.css   # Floating contact buttons
   ├── voice-search.css       # Voice search & suggestion popup
   ├── ai-chatbot.css         # AI chatbot widget
   ├── service-book.css       # Service book/catalog pages
   └── showcase.css           # Showcase landing page
   ```

3. **Khi tạo component mới cần CSS**:
   - Tạo file CSS mới trong `src/styles/` (ví dụ: `booking.css`)
   - Thêm `@import "../styles/booking.css";` vào `globals.css`
   - Hoặc import trực tiếp trong component file

4. **CSS Variables**:
   - Đặt tất cả CSS variables (custom properties) trong `base.css` > `:root`
   - Sử dụng comment tiếng Việt để giải thích

5. **Responsive styles**:
   - Đặt responsive (`@media`) trong cùng file CSS của component đó
   - KHÔNG tách responsive ra file riêng

## Checklist
- [ ] CSS mới nằm đúng file trong `src/styles/`
- [ ] `globals.css` chỉ chứa imports
- [ ] CSS variables mới được thêm vào `base.css` > `:root`
- [ ] Responsive nằm cùng file component
