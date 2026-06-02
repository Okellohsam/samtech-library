const downloadPDF = async (id) => {

  const response = await fetch(
    `http://localhost:5000/api/pdfs/download/${id}`
  );

  const data = await response.json();

  window.open(data.downloadUrl);
};