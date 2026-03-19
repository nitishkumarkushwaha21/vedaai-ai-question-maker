import type { GenerationSocketEvent, GenerationStatus } from "@/types/generation-status";

const EVENT_TO_STATUS: Record<GenerationSocketEvent, GenerationStatus> = {
	"generation:queued": "queued",
	"generation:processing": "processing",
	"generation:completed": "completed",
	"generation:failed": "failed",
};

export function toGenerationStatus(event: GenerationSocketEvent): GenerationStatus {
	return EVENT_TO_STATUS[event];
}