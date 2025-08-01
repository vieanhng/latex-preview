let lastMouseUpEvent = null;
let selectionButton = null;
let tooltipShow = null;

// Lưu lại vị trí chuột cuối cùng khi người dùng nhả chuột (sau khi bôi đen)
document.addEventListener('mouseup', (event) => {
  // Delay nhỏ để đảm bảo selection đã được cập nhật
  setTimeout(() => {
    const selection = window.getSelection();
    if (selection.toString().trim().length > 0 && !tooltipShow) {
      lastMouseUpEvent = event;
      createSelectionButton(event.pageX, event.pageY, selection.toString());
    }
  }, 10);
}, true);

// Hàm tạo nút "Preview"
function createSelectionButton(x, y, selectedText) {
  // Xóa nút cũ nếu có
  if (selectionButton) {
    selectionButton.remove();
  }

  selectionButton = document.createElement('div');
  selectionButton.innerHTML = `✨`;
  selectionButton.style.cssText = `
    position: absolute;
    background-color: #ffffff;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    z-index: 10001;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    user-select: none;
    pointer-events: auto;
  `;

  selectionButton.style.left = `${x + 10}px`;
  selectionButton.style.top = `${y + 10}px`;

  // Thử nhiều loại event khác nhau
  selectionButton.addEventListener('click', handleClick, true);
  
  selectionButton.addEventListener('mouseup', (e) => {
    console.log('Button mouseup!');
    e.preventDefault();
    e.stopPropagation();
  }, true);

  function handleClick(e) {
    console.log('Button clicked!', selectedText);
    e.preventDefault();
    e.stopPropagation();
    selectionButton.remove();
    selectionButton = null;    
    createOrUpdateTooltip(selectedText, x, y);
        
  }

  document.body.appendChild(selectionButton);
  
  // Đảm bảo nút không bị xóa ngay lập tức
  setTimeout(() => {
    document.addEventListener('mouseup', function clearButton() {
      if (selectionButton) {
        selectionButton.remove();
        selectionButton = null;
      }
      document.removeEventListener('mouseup', clearButton, true);
    }, { once: true });
  }, 100);
}

function createOrUpdateTooltip(text, x, y) {
  console.log('Creating tooltip with text:', text);

  if (selectionButton) {
        selectionButton.remove();
        selectionButton = null;
  }
  
  let existingTooltip = document.getElementById('latex-preview-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }

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
    max-width: 60%;
    word-wrap: break-word;
    display: flex;
    flex-direction: column;
  `;

  const latexRegex = /(\$[^$]+\$|\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\(.+?\\\))/g;
  let renderedHtml = text.replace(latexRegex, (match) => {
    let cleanLatex = match.replace(/^\$|\$$/g, '');
    cleanLatex = cleanLatex.replace(/^\\\$|\\\]$/g, '');
    cleanLatex = cleanLatex.replace(/^\\\(|\\\)$/g, '');

    const isDisplayMode = match.startsWith('$$') || match.startsWith('\\[');

    try {
      return `<span class="latex-rendered-segment">${katex.renderToString(cleanLatex, { displayMode: isDisplayMode, throwOnError: false })}</span>`;
    } catch (e) {
      return `<span class="latex-error-segment">${match} (Error: ${e.message})</span>`;
    }
  });

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
  tooltipShow = true;

  const closeTooltip = () => {
    if (tooltip.parentElement) {
      tooltip.remove();
      tooltipShow = false;
    }
  };

  // Đóng tooltip khi click ra ngoài
  document.addEventListener('click', closeTooltip, { once: true });
}

// Inject KaTeX CSS
function injectKaTeXCSS() {
  const link = document.createElement('link');
  link.href = chrome.runtime.getURL('lib/katex.min.css');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

injectKaTeXCSS();
