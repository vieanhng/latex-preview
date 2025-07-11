let lastMouseUpEvent = null;

// Lưu lại vị trí chuột cuối cùng khi người dùng nhả chuột (sau khi bôi đen)
document.addEventListener('mouseup', (event) => {
  if (window.getSelection().toString().length > 0) {
    lastMouseUpEvent = event;
  }
}, true);


// Lắng nghe tin nhắn từ background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "preview" && lastMouseUpEvent) {
    createOrUpdateTooltip(request.latex, lastMouseUpEvent.pageX, lastMouseUpEvent.pageY);
  }
});

function createOrUpdateTooltip(text, x, y) {
  // Xóa tooltip cũ nếu có
  let existingTooltip = document.getElementById('latex-preview-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }

  // Tạo container cho tooltip
  const tooltip = document.createElement('div');
  tooltip.id = 'latex-preview-tooltip';
  tooltip.style.cssText = `
    position: absolute;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    padding: 10px;
    border-radius: 5px;
    z-index: 10000;
    max-width: 60%; /* Giới hạn chiều rộng để tránh tràn màn hình */
    word-wrap: break-word;
    display: flex; /* Sử dụng flexbox để căn chỉnh nội dung và nút close */
    flex-direction: column; /* Xếp theo cột để nút close nằm dưới hoặc trên nội dung */
  `;


  const latexRegex = /(\$[^$]+\$|\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\(.+?\\\))/g;
let renderedHtml = text.replace(latexRegex, (match) => {
  let cleanLatex = match.replace(/^\$|\$$/g, '');
  cleanLatex = cleanLatex.replace(/^\\\[|\\\]$/g, '');
  cleanLatex = cleanLatex.replace(/^\\\(|\\\)$/g, '');

  // Xác định xem công thức có phải là display mode hay không.
  // Đối với các ký hiệu inline ($...$, \(...\)), chúng ta sẽ buộc displayMode = false.
  // Đối với các ký hiệu display ($$...$$, \[...\]), chúng ta vẫn giữ displayMode = true.
  const isDisplayMode = match.startsWith('$$') || match.startsWith('\\[');

  try {
    return `<span class="latex-rendered-segment">${katex.renderToString(cleanLatex, { displayMode: isDisplayMode, throwOnError: false })}</span>`;
  } catch (e) {
    return `<span class="latex-error-segment">${match} (Error: ${e.message})</span>`;
  }
});

  if (renderedHtml === text);

  tooltip.innerHTML = renderedHtml;
  document.body.appendChild(tooltip);

  const tooltipRect = tooltip.getBoundingClientRect();
  let left = x + 15;
  let top = y + 15;

  if (left + tooltipRect.width > window.innerWidth) {
    left = window.innerWidth - tooltipRect.width - 10;
  }
  if (top + tooltipRect.height > window.innerHeight) {
    top = window.innerHeight - tooltipRect.height - 10;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  tooltip.style.display = 'block';

  const closeTooltip = () => {
    if (tooltip.parentElement) {
      tooltip.remove();
    }
    document.removeEventListener('click', closeTooltip);
  };

  document.addEventListener('click', closeTooltip, { once: true });
}

function injectKaTeXCSS() {
    const link = document.createElement('link');
    link.href = chrome.runtime.getURL('lib/katex.min.css');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

injectKaTeXCSS();
