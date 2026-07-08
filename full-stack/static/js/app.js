const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const md = ref(localStorage.getItem('md') || '# Привет\n\nПишите **Markdown**...');
    const html = ref('');
    const title = 'Markdown Editor';

    function render() {
      html.value = marked.parse(md.value);
      localStorage.setItem('md', md.value);
    }

    function insert(before, after) {
      const ta = document.querySelector('textarea');
      const s = ta.selectionStart, e = ta.selectionEnd;
      const sel = md.value.substring(s, e) || 'текст';
      md.value = md.value.substring(0, s) + before + sel + after + md.value.substring(e);
      render();
    }

    function exportPDF() {
      const preview = document.querySelector('.preview');
      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Document</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #000000;
      background: #ffffff;
      line-height: 1.6;
      font-size: 14px;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #000000;
      margin: 20px 0 10px 0;
      font-weight: bold;
    }
    h1 { font-size: 28px; border-bottom: 2px solid #000; padding-bottom: 8px; }
    h2 { font-size: 24px; border-bottom: 1px solid #333; padding-bottom: 6px; }
    h3 { font-size: 20px; }
    h4 { font-size: 18px; }
    h5 { font-size: 16px; }
    h6 { font-size: 14px; }
    p {
      color: #000000;
      margin: 10px 0;
    }
    code {
      background: #f5f5f5;
      color: #000000;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
    pre {
      background: #f5f5f5;
      color: #000000;
      padding: 16px;
      border-radius: 4px;
      border: 1px solid #ddd;
      overflow-x: auto;
      margin: 16px 0;
    }
    pre code {
      background: none;
      color: #000000;
      padding: 0;
      font-size: 13px;
    }
    blockquote {
      border-left: 4px solid #333;
      color: #333;
      padding-left: 16px;
      margin: 16px 0;
      font-style: italic;
    }
    a {
      color: #000000;
      text-decoration: underline;
    }
    table {
      border-collapse: collapse;
      margin: 16px 0;
      width: 100%;
    }
    th, td {
      border: 1px solid #000000;
      padding: 10px 14px;
      text-align: left;
      color: #000000;
    }
    th {
      background: #e0e0e0;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background: #f9f9f9;
    }
    ul, ol {
      margin: 10px 0 10px 30px;
      color: #000000;
    }
    li {
      color: #000000;
      margin: 5px 0;
    }
    img {
      max-width: 100%;
      height: auto;
      margin: 16px 0;
    }
    hr {
      border: none;
      border-top: 2px solid #000;
      margin: 20px 0;
    }
    input[type="checkbox"] {
      margin-right: 8px;
    }
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      @page {
        margin: 15mm;
      }
    }
  </style>
</head>
<body>
  ${preview.innerHTML}
</body>
</html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      printWindow.onload = function() {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 250);
      };
    }

    onMounted(render);

    return { md, html, title, render, insert, exportPDF };
  }
}).mount('#app');
