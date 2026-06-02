const fetchAnalytics = async () => {

  const token = localStorage.getItem('token');

  const response = await fetch(
    'https://samtech-library.onrender.com/api/analytics',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  console.log(data);
};

fetchAnalytics();
