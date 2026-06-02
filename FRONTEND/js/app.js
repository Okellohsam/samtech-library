const API_URL =
  "http://localhost:5000/api/pdfs";

const pdfGrid =
  document.getElementById("pdfGrid");

/*
===================================
GET CURRENT PAGE CATEGORY
===================================
*/

function getCategory() {

  const page =
    window.location.pathname
      .split("/")
      .pop();

  if (
    page === "ethical-hacking.html"
  ) {
    return "Ethical Hacking";
  }

  if (
    page === "programming.html"
  ) {
    return "Programming";
  }

  return null;
}

/*
===================================
FETCH PDFs
===================================
*/

async function fetchPDFs() {

  try {

    const response =
      await fetch(API_URL);

    const pdfs =
      await response.json();

    const category =
      getCategory();

    let filteredPDFs = pdfs;

    if (category) {

      filteredPDFs =
        pdfs.filter(
          pdf =>
            pdf.category === category
        );

    }

    renderPDFs(filteredPDFs);

  } catch (error) {

    console.error(error);

  }

}

/*
===================================
RENDER PDFs
===================================
*/

function renderPDFs(pdfs) {

  pdfGrid.innerHTML = "";

  if (!pdfs.length) {

    pdfGrid.innerHTML = `

      <div
        style="
        text-align:center;
        padding:40px;
        color:#aaa;"
      >

        No PDFs Found

      </div>

    `;

    return;

  }

  pdfs.forEach(pdf => {

    pdfGrid.innerHTML += `

      <div class="pdf-card">

        <div class="pdf-thumbnail">

          <img
            src="${pdf.thumbnail}"
            alt="${pdf.title}"
            loading="lazy"
            onerror="this.src='../images/pdf-placeholder.png'"
          >

        </div>

        <div class="pdf-content">

          <h3>${pdf.title}</h3>

          <p>${pdf.author}</p>

          <div class="pdf-meta">

            <span>
              ${pdf.category}
            </span>

            <span>
              ${pdf.downloads}
              Downloads
            </span>

          </div>

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

}

/*
===================================
DOWNLOAD PDF
===================================
*/

async function downloadPDF(id) {

  try {

    const response =
      await fetch(
        `http://localhost:5000/api/pdfs/download/${id}`
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.message
      );

    }

    window.open(
      data.downloadUrl,
      "_blank"
    );

  } catch (error) {

    alert(error.message);

  }

}

window.downloadPDF =
  downloadPDF;

fetchPDFs();