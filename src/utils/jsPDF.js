import jsPDF from "jspdf";

export function convertPDF() {
  const doc = new jsPDF();

  const pdfBody = document.getElementById("pdf");
  doc.html(pdfBody, {
    callback: function (pdf) {
      pdf.save("presupuesto.pdf");
    },
    x: 10,
    y: 10,
    html2canvas: {
      scale: 0.25,
    },
  });
}
