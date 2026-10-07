import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [liveCrowd, setLiveCrowd] = useState({
    rides: { percentage: 92, level: 'HIGH', trend: 'INCREASING', color: '#EF4444' },
    food: { percentage: 87, level: 'HIGH', trend: 'STABLE', color: '#EF4444' },
    games: { percentage: 34, level: 'LOW', trend: 'DECREASING', color: '#22C55E' },
    stage: { percentage: 60, level: 'MEDIUM', trend: 'INCREASING', color: '#FACC15' }
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socketHost = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || window.location.origin;
    const newSocket = io(socketHost, {
      reconnectionAttempts: 5,
      timeout: 5000
    });

    setSocket(newSocket);

    newSocket.on('crowd:pulse', (data) => {
      setLiveCrowd(data);
    });

    newSocket.on('notification:all', (notif) => {
      setNotifications(prev => [notif, ...prev.slice(0, 9)]);
    });

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, liveCrowd, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
