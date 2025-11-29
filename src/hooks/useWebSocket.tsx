import {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";
import {BASE_URL} from "../constants/urls";

export function useWebSocket(userId: number) {
    const socketRef = useRef<any>(null);
    const [isConnected, setIsConnected] = useState(false);

    const connect = () => {
        if (!socketRef.current) {
            socketRef.current = io(BASE_URL, {
                query: { userId },
                transports: ['websocket', 'polling'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socketRef.current.on('connect', () => {
                setIsConnected(true);
                console.log('WebSocket connected for user:', userId);
            });

            socketRef.current.on('disconnect', () => {
                setIsConnected(false);
                console.log('WebSocket disconnected');
            });

            socketRef.current.on('connected', (data: any) => {
                console.log('Server confirmed connection:', data);
            });

            socketRef.current.on('connect_error', (error: any) => {
                console.error('WebSocket connection error:', error);
                setIsConnected(false);
            });
        }
    };

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    };

    useEffect(() => {
        return () => disconnect();
    }, []);

    const on = (event: string, callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    const off = (event: string) => {
        if (socketRef.current) {
            socketRef.current.off(event);
        }
    };

    return { connect, disconnect, on, off, isConnected };
}