"use client";

import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { toGenerationStatus } from "@/modules/assignments/generation-events";
import type { GenerationJob, GenerationSocketEvent, GenerationSocketPayload } from "@/types/generation-job";

type UseGenerationJobSocketArgs = {
	assignmentId: string;
	initialJob: GenerationJob;
};

const GENERATION_EVENTS: GenerationSocketEvent[] = [
	"generation:queued",
	"generation:processing",
	"generation:completed",
	"generation:failed",
];

export function useGenerationJobSocket({ assignmentId, initialJob }: UseGenerationJobSocketArgs) {
	const [job, setJob] = useState<GenerationJob>(initialJob);
	const [socketConnected, setSocketConnected] = useState(false);

	useEffect(() => {
		const socket = connectSocket();

		const onConnect = () => setSocketConnected(true);
		const onDisconnect = () => setSocketConnected(false);

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		socket.emit("generation:subscribe", { assignmentId });

		GENERATION_EVENTS.forEach((eventName) => {
			socket.on(eventName, (incoming: GenerationSocketPayload) => {
				const incomingJob = incoming.payload.job;

				if (incomingJob.assignmentId !== assignmentId) {
					return;
				}

				setJob((prev) => ({
					...prev,
					...incomingJob,
					status: toGenerationStatus(incoming.event),
					message: incomingJob.message ?? prev.message,
					error: incomingJob.error ?? prev.error,
				}));
			});
		});

		return () => {
			socket.emit("generation:unsubscribe", { assignmentId });
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			GENERATION_EVENTS.forEach((eventName) => socket.off(eventName));
			disconnectSocket();
		};
	}, [assignmentId]);

	return { job, socketConnected };
}