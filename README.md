# 🧮 LaTeX Previewer

> *Chrome Extension giúp xem trước các công thức toán học viết bằng LaTeX chỉ với vài thao tác đơn giản.*

---

## 📌 Mô tả

**LaTeX Previewer** là tiện ích mở rộng cho trình duyệt Chrome, hỗ trợ người dùng học tập, nghiên cứu hoặc làm việc với các công thức toán học. Khi bạn **bôi đen (chọn) văn bản chứa mã LaTeX**, nhấn chuột phải → chọn **"Preview LaTeX"**, tiện ích sẽ hiển thị công thức dưới dạng đẹp mắt trong một tooltip nhỏ ngay tại vị trí con trỏ chuột.

---

## ✨ Tính năng chính

- ✅ Chọn văn bản chứa LaTeX → Chuột phải → Chọn "Preview"
- ✅ Hỗ trợ các định dạng phổ biến: `$...$`, `$$...$$`, `\(...\`, `$$...$$`
- ✅ Render công thức bằng thư viện **KaTeX** (nhanh và nhẹ)
- ✅ Tooltip hiển thị đẹp mắt
---

## 🛠 Cấu trúc dự án

```
latex-previewer-extension/
│
├── manifest.json       ← Cấu hình chính của extension
├── background.js       ← Xử lý context menu
├── content.js          ← Xử lý logic preview
├── popup.html          ← Giao diện popup khi click vào icon
├── style.css           ← CSS cho tooltip
├── icon/               ← Các file icon
└── katex/              ← Thư viện KaTeX
```

---

## 🚀 Hướng dẫn cài đặt

### 1. Tải về dự án
Clone repo này hoặc tải file `.zip` đã đóng gói.

```bash
git clone git@github.com:vieanhng/latex-preview.git
```

### 2. Mở Chrome Extensions
Truy cập: [chrome://extensions](chrome://extensions/)

### 3. Bật chế độ "Developer mode"

### 4. Chọn "Tải tiện ích đã giải nén"
Chọn thư mục chứa extension bạn vừa tải/xuất.

---

## 📝 Tác giả

👤 **vieanhng**

- Email: nva4work@gmail.com
- GitHub: [@vieanhng](https://github.com/vieanhng )

---

## 💬 Phản hồi & Hỗ trợ

Bạn có thể liên hệ qua email: **nva4work@gmail.com** nếu gặp vấn đề hoặc cần hỗ trợ mở rộng tiện ích.

---

## 📜 Giấy phép

MIT © VieAnhNg

---

# 🎉 Cảm ơn bạn đã sử dụng LaTeX Previewer!
