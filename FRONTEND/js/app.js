const pdfGrid =
  document.getElementById('pdfGrid');

const fetchPDFs = async () => {

  const response = await fetch(
    'http://localhost:5000/api/pdfs'
  );

  const pdfs = await response.json();

  renderPDFs(pdfs);
};

const renderPDFs = (pdfs) => {

  pdfGrid.innerHTML = '';

  pdfs.forEach(pdf => {

    pdfGrid.innerHTML += `
      <div class="pdf-card">

        <div class="pdf-thumbnail">
         <img
             src="${pdf.thumbnailUrl}"
             alt="${pdf.title}"
              />
              </div>

        <div class="pdf-content">

          <h3>${pdf.title}</h3>

          <p>${pdf.description}</p>

          <button
            class="download-btn"
            onclick="downloadPDF('${pdf._id}')"
          >
            Download PDF
          </button>

        </div>

      </div>
    `;

  });
};

fetchPDFs();