import { useEffect, useRef, useState } from 'react';
import { Device } from '@twilio/voice-sdk';

function Llamadas() {
  const APP_URL = import.meta.env.VITE_API_URL
  const [phoneNumber, setPhoneNumber] = useState("")

  const callingToken = useRef(null);

  useEffect(() => {
    // Fetch authentication token from the server
    const fetchToken = async () => {
      try {
        const response = await fetch(`${APP_URL}twilio_token`, {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          callingToken.current = data.token;
        } else {
          throw new Error('Failed to fetch token');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    }

    fetchToken();
  }, []);

  const handleCall = async () => {
    try {
       const device = new Device(callingToken.current || "")

       const params = {
        To: "+522223785532",
        aCustomParameter: "the value of your custom parameter"
      };
      
      const call = await device.connect({ params });
      
      console.log(call.customParameters);
    } catch (error) {
      console.log(error)
    }
  }
  

  return (
    <div>
      <h1>Make a Voice Call</h1>
      <input
        type="text"
        value={phoneNumber}
        onChange={e => setPhoneNumber(e.target.value)}
        placeholder="Enter phone number"
      />
      <button onClick={handleCall}>Call</button>
    </div>
  );
}

export default Llamadas;
