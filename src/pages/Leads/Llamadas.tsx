import { useEffect, useState } from 'react';

const states = {
  CONNECTING: "Connecting",
  READY: "Ready",
  INCOMING: "Incoming",
  ON_CALL: "On Call",
  OFFLINE: "Offline"
}

function Llamadas({phone}: {phone? : string}) {
  const APP_URL = "https://5zvg4txf-9000.usw3.devtunnels.ms/"

  const [token, setToken] = useState("")

  useEffect(() => {
    if (token && window.process !== undefined) {
    }
  }, [token])
  

  useEffect(() => {
    // Fetch authentication token from the server
    const fetchToken = async () => {
      try {
        const response = await fetch(`${APP_URL}token`);

        if (response.ok) {
          const data = await response.json();
          setToken(data.token);
        } else {
          throw new Error('Failed to fetch token');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    }

    fetchToken();
  }, []);
  
  return (
    <div className='flex flex-col'>
      <button className='bg-gray-300 p-3 rounded-md hover:bg-gray-400'>Llamar</button>
      <div>Llamada:</div>
      <div>{phone}</div>
    </div>
  );
}

export default Llamadas;
