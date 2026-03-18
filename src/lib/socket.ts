import { io, type Socket } from "socket.io-client";
import { ENV } from "@/lib/env";

let socketRef: Socket | null = null;

export function getSocketClient() {
	if (socketRef) {
		return socketRef;
	}

	socketRef = io(ENV.SOCKET_URL, {
		autoConnect: false,
		transports: ["websocket"],
	});

	return socketRef;
}

export function connectSocket() {
	const socket = getSocketClient();
	if (!socket.connected) {
		socket.connect();
	}
	return socket;
}

export function disconnectSocket() {
	if (socketRef?.connected) {
		socketRef.disconnect();
	}
}