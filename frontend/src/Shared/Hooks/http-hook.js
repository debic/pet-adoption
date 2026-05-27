import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';

export default function useHttpClient() {
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setIsloading(true);
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
  
    try {
      let response;
  
      if (method === 'GET' || method === 'DELETE') {
        response = await axios({
          method,
          url,
          headers,
          signal: httpAbortCtrl.signal
        });
      } else {
        // POST, PUT, PATCH
        response = await axios({
          method,
          url,
          data: body,
          headers,
          signal: httpAbortCtrl.signal
        });
      }


      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrl => reqCtrl !== httpAbortCtrl
      );
  
      setIsloading(false);

      return response;
    } catch (error) {
      setIsloading(false);
  
      if (error.response) {
        setError(error.response.data.message || 'Algo salió mal, por favor intente de nuevo');
      } else if (error.request) {
        setError('No hay respuesta del servidor. Por favor, inténtalo nuevamente.');
      } else {
        setError(error.message || 'Algo salió mal, por favor intente de nuevo');
      }
  
      throw error;
    }
  }, []);
  

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
}
