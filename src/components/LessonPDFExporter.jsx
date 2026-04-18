// PDF Exporter for lessons using html2canvas and jsPDF
// Install: npm install html2canvas jspdf
import React, { useRef } from 'react';

const LessonPDFExporter = ({ children, fileName = 'lesson.pdf' }) => {
  const printRef = useRef();

  const handleDownload = async () => {
    const element = printRef.current;
    if (!element) return;
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) return;

    const styles = `
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5; color: #111; }
        h1, h2, h3 { page-break-after: avoid; }
        p, li { page-break-inside: avoid; }
        pre, code { white-space: pre-wrap; }
        img, video, iframe { max-width: 100%; }
        .page-break { page-break-before: always; }
      </style>
    `;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>${fileName}</title>
          ${styles}
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div>
      <button onClick={handleDownload}>Download as PDF</button>
      <div
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          width: '800px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div ref={printRef}>{children}</div>
      </div>
    </div>
  );
};

export default LessonPDFExporter;
