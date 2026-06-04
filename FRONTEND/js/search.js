const searchInput =
  document.getElementById('searchInput');

searchInput?.addEventListener(
  'keyup',
  async (e) => {

    const query = e.target.value;

    const response = await fetch(
      `https://samtech-library.onrender.com/api/pdfs?search=${query}`
    );

    const pdfs = await response.json();

    renderPDFs(pdfs);

  }
);