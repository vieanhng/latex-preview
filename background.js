// background.js

// Tạo context menu khi tiện ích được cài đặt
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "preview-latex",
    title: "Preview LaTeX",
    contexts: ["selection"] // Chỉ hiển thị khi có văn bản được chọn
  });
});

// Lắng nghe sự kiện click vào context menu
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "preview-latex" && info.selectionText) {
    await chrome.tabs.sendMessage(tab.id, {
      action: "preview",
      latex: info.selectionText
    });
  }
})
