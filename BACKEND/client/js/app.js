const pdfContainer = document.querySelector('.pdf-grid');

const fetchPDFs = async () => {

  try {

    const response = await fetch(
      'http://localhost:5000/api/pdfs'
    );

    const pdfs = await response.json();

    pdfContainer.innerHTML = '';

    pdfs.forEach(pdf => {

      pdfContainer.innerHTML += `
        <div class=\"pdf-card\">
          <div class=\"pdf-thumbnail\">
            <i class=\"fa-solid fa-file-pdf\"></i>
          </div>

          <div class=\"pdf-content\">
            <div class=\"pdf-meta\">
              <span>${pdf.category}</span>
              <span>${pdf.downloads} Downloads</span>
            </div>

            <h4>${pdf.title}</h4>

            <p>${pdf.description}</p>

            <div class=\"pdf-footer\">
              <span>${pdf.author}</span>

              <button
                class=\"download-btn\"
                onclick=\"downloadPDF('${pdf._id}')\"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      `;

    });

  } catch (error) {
    console.error(error);
  }

};

const downloadPDF = async (id) => {

  const response = await fetch(
    `http://localhost:5000/api/pdfs/download/${id}`
  );

  const data = await response.json();

 const link =
  document.createElement('a');

link.href =
  data.downloadUrl;

link.download =
  '';

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

};

fetchPDFs();