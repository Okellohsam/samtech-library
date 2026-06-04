/*
====================================
AUTH CHECK
====================================
*/

const token =
  localStorage.getItem('token');

if (!token) {

  window.location.href =
    '../pages/admin-login.html';

}

/*
====================================
API URL
====================================
*/

const API_URL =
  'https://samtech-library.onrender.com/api';

/*
====================================
FETCH ANALYTICS
====================================
*/

const fetchAnalytics = async () => {

  try {

    const response = await fetch(
      `${API_URL}/analytics`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    const data =
      await response.json();

    document.getElementById(
      'totalPDFs'
    ).innerText =
      data.totalPDFs || 0;

    document.getElementById(
      'totalDownloads'
    ).innerText =
      data.totalDownloads || 0;

    document.getElementById(
      'totalVisitors'
    ).innerText =
      data.totalVisitors || 0;

    document.getElementById(
      'trendingPDFs'
    ).innerText =
      data.topPDFs?.length || 0;

  } catch (error) {

    console.error(
      'Analytics Error:',
      error
    );

  }

};

/*
====================================
FETCH PDFs
====================================
*/

const fetchPDFs = async () => {

  try {

    const response = await fetch(
      `${API_URL}/pdfs`
    );

    const pdfs =
      await response.json();

    const recentPDFs =
      document.getElementById(
        'recentPDFs'
      );

    recentPDFs.innerHTML = '';

    pdfs.forEach(pdf => {

      recentPDFs.innerHTML += `

        <div class="pdf-card">

          <img
            src="${pdf.thumbnailUrl}"
            alt="${pdf.title}"
          >

          <div class="pdf-info">

            <h3>${pdf.title}</h3>

            <p>
              ${pdf.description}
            </p>

            <div class="stats">

              <span>
                ${pdf.downloads}
                Downloads
              </span>

              <span>
                ${pdf.category}
              </span>

            </div>

          </div>

        </div>

      `;

    });

  } catch (error) {

    console.error(
      'PDF Fetch Error:',
      error
    );

  }

};

/*
====================================
UPLOAD PDF
====================================
*/

const uploadForm =
  document.getElementById(
    'uploadForm'
  );

uploadForm?.addEventListener(
  'submit',
  async (e) => {

    e.preventDefault();

    const uploadBtn =
      document.querySelector(
        '.upload-btn'
      );

    uploadBtn.innerHTML =
      'Uploading...';

    const formData =
      new FormData();

    formData.append(
      'title',
      document.getElementById(
        'title'
      ).value
    );

    formData.append(
      'author',
      document.getElementById(
        'author'
      ).value
    );

    formData.append(
      'category',
      document.getElementById(
        'category'
      ).value
    );

    formData.append(
      'subcategory',
      document.getElementById(
        'subcategory'
      ).value
    );

    formData.append(
      'description',
      document.getElementById(
        'description'
      ).value
    );

    formData.append(
      'pdf',
      document.getElementById(
        'pdfFile'
      ).files[0]
    );

    try {

      const response = await fetch(
        `${API_URL}/pdfs`,
        {

          method: 'POST',

          headers: {
            Authorization:
              `Bearer ${token}`
          },

          body: formData

        }
      );

      const data =
        await response.json();

      if (response.ok) {

        alert(
          'PDF uploaded successfully'
        );

        uploadForm.reset();

        fetchPDFs();

        fetchAnalytics();

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.error(
        'Upload Error:',
        error
      );

    }

    uploadBtn.innerHTML =
      'Upload PDF';

  }
);

/*
====================================
LOGOUT
====================================
*/

const logoutBtn =
  document.getElementById(
    'logoutBtn'
  );

logoutBtn?.addEventListener(
  'click',
  () => {

    localStorage.removeItem(
      'token'
    );

    window.location.href =
      '../pages/admin-login.html';

  }
);

/*
====================================
INITIALIZE
====================================
*/

fetchAnalytics();

fetchPDFs();


/*
========================================
UPLOAD AREA
========================================
*/

const uploadArea =
document.getElementById('uploadArea');

const pdfFile =
document.getElementById('pdfFile');

const browseBtn =
document.getElementById('browseBtn');

const filePreview =
document.getElementById('filePreview');

const fileName =
document.getElementById('fileName');

const fileSize =
document.getElementById('fileSize');

/*
========================================
OPEN FILE BROWSER
========================================
*/

browseBtn.addEventListener(
  'click',
  () => {

    pdfFile.click();

  }
);

/*
========================================
CLICK AREA TO BROWSE
========================================
*/

uploadArea.addEventListener(
  'click',
  (e) => {

    // Prevent double trigger

    if (
      e.target !== browseBtn
    ) {

      pdfFile.click();

    }

  }
);

/*
========================================
WHEN FILE SELECTED
========================================
*/

pdfFile.addEventListener(
  'change',
  handleFile
);

/*
========================================
DRAG EVENTS
========================================
*/

uploadArea.addEventListener(
  'dragover',
  (e) => {

    e.preventDefault();

    uploadArea.classList.add(
      'dragging'
    );

  }
);

uploadArea.addEventListener(
  'dragleave',
  () => {

    uploadArea.classList.remove(
      'dragging'
    );

  }
);

uploadArea.addEventListener(
  'drop',
  (e) => {

    e.preventDefault();

    uploadArea.classList.remove(
      'dragging'
    );

    const files =
    e.dataTransfer.files;

    if (files.length > 0) {

      pdfFile.files = files;

      handleFile();

    }

  }
);

/*
========================================
HANDLE FILE
========================================
*/

function handleFile() {

  const file =
  pdfFile.files[0];

  if (!file) return;

  /*
  ========================================
  VALIDATE PDF
  ========================================
  */

  if (
    file.type !==
    'application/pdf'
  ) {

    alert(
      'Please upload a PDF file only.'
    );

    pdfFile.value = '';

    return;

  }

  /*
  ========================================
  FORMAT FILE SIZE
  ========================================
  */

  const size =
  formatFileSize(file.size);

  /*
  ========================================
  UPDATE UI
  ========================================
  */

  fileName.textContent =
  file.name;

  fileSize.textContent =
  size;

  filePreview.classList.add(
    'active'
  );

  uploadArea.classList.add(
    'uploaded'
  );

  /*
  ========================================
  CHANGE UPLOAD AREA CONTENT
  ========================================
  */

  const uploadContent =
  uploadArea.querySelector(
    '.upload-content'
  );

  uploadContent.innerHTML = `

    <i class="fa-solid fa-circle-check"></i>

    <h3>
      PDF Loaded Successfully
    </h3>

    <p>
      ${file.name}
    </p>

  `;

}

/*
========================================
FORMAT SIZE
========================================
*/

function formatFileSize(bytes) {

  if (bytes < 1024) {

    return bytes + ' Bytes';

  } else if (
    bytes < 1048576
  ) {

    return (
      (bytes / 1024)
      .toFixed(2) +
      ' KB'
    );

  } else {

    return (
      (bytes / 1048576)
      .toFixed(2) +
      ' MB'
    );

  }

}

async function fetchDownloads() {

  try {

    const response =
  await fetch(
    `${API_URL}/analytics/downloads`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

    const downloads =
      await response.json();

    const table =
      document.getElementById(
        "downloadsTable"
      );

    table.innerHTML = "";

    if (!Array.isArray(downloads)) {

  console.error(
    'Invalid downloads data:',
    downloads
  );

  return;
}

downloads.forEach(item => {

      table.innerHTML += `

        <tr>

          <td>
            ${item.pdfTitle}
          </td>

          <td>
            ${item.ipAddress}
          </td>

          <td>
            ${new Date(
              item.createdAt
            ).toLocaleString()}
          </td>

          <td>

            <span
              style="
              color:#00ff9d"
            >

              Downloaded

            </span>

          </td>

        </tr>

      `;

    });

  } catch (error) {

    console.error(
      "Downloads Error",
      error
    );

  }

}

fetchDownloads();
fetchAnalytics();
fetchPDFs();
fetchDownloads();
