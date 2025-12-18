declare const jspdf: any;
declare const QRCode: any;

export const PDFService = {
  generateStudentCard: async (student: any) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 55] // ID-1 Card Size
    });

    // Design Background
    doc.setFillColor(2, 6, 23); // bg-slate-950
    doc.rect(0, 0, 85, 55, 'F');
    
    // Header Gradient Area
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 0, 85, 12, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("DarsPay Elite Card", 42.5, 7, { align: 'center' });

    // Student Info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    // Note: Standard jsPDF fonts don't support Arabic without plugins, 
    // for this demo we'll use English keys or assume plugin is loaded if needed.
    // In a real scenario, we'd add an Arabic font base64.
    doc.text(student.name, 42.5, 22, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Grade: ${student.grade}`, 42.5, 28, { align: 'center' });
    doc.text(`Group: ${student.group}`, 42.5, 33, { align: 'center' });

    // QR Code Generation
    const qrCanvas = document.createElement('canvas');
    await QRCode.toCanvas(qrCanvas, student.studentCode, { margin: 1, width: 60 });
    const qrData = qrCanvas.toDataURL('image/png');
    doc.addImage(qrData, 'PNG', 32.5, 36, 20, 20);

    // Border
    doc.setDrawColor(51, 65, 85);
    doc.setLineWidth(0.5);
    doc.rect(1, 1, 83, 53);

    doc.save(`Card-${student.name}.pdf`);
  }
};