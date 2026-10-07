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
        setError(error.response.data.message || 'Something went wrong, please try again.');
      } else if (error.request) {
        setError('No response from the server. Please try again.');
      } else {
        setError(error.message || 'Something went wrong, please try again.');
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
