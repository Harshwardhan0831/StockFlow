import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateQuotes } from '../store/slices/marketSlice';

export function useMarketSocket() {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    let reconnectTimeout = null;
    let isUnmounted = false;

    function connect() {
      try {
        let wsUrl = import.meta.env.VITE_WS_URL;
        if (!wsUrl) {
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const host = window.location.host;
          wsUrl = `${protocol}//${host}/ws`;
        }

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'quotes' && Array.isArray(data.data)) {
              dispatch(updateQuotes(data.data));
            }
          } catch (e) {
            console.error('Error parsing WebSocket data:', e);
          }
        };

        ws.onclose = () => {
          if (!isUnmounted) {
            reconnectTimeout = setTimeout(connect, 3000);
          }
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch (err) {
        console.error('WebSocket connection error:', err);
      }
    }

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socketRef.current) socketRef.current.close();
    };
  }, [dispatch]);
}

export default useMarketSocket;
