const searchInput =
  document.getElementById('searchInput');

searchInput?.addEventListener(
  'keyup',
  async (e) => {

    const query = e.target.value;

    const response = await fetch(
      `http://localhost:5000/api/pdfs?search=${query}`
    );

    const pdfs = await response.json();

    renderPDFs(pdfs);

  }
);