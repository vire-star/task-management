import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Manual connection control
  withCredentials: true
});

export default socket;
