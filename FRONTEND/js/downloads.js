const downloadPDF = async (id) => {

  const response = await fetch(
    `https://samtech-library.onrender.com/api/pdfs/download/${id}`
  );

  const data = await response.json();

  window.open(data.downloadUrl);
};