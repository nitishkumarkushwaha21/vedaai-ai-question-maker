import type { CreateAssignmentFormValues } from "@/modules/assignments/schema";
import type { GenerationRequestPayload } from "@/types/generation-request";

export function buildGenerationRequestPayload(
	assignmentId: string,
	values: CreateAssignmentFormValues,
): GenerationRequestPayload {
	const questionTypes = values.questionRows.map((row) => ({
		type: row.type,
		numberOfQuestions: row.numberOfQuestions,
		marksPerQuestion: row.marksPerQuestion,
		totalMarks: row.numberOfQuestions * row.marksPerQuestion,
	}));

	const totalQuestions = questionTypes.reduce((sum, item) => sum + item.numberOfQuestions, 0);
	const totalMarks = questionTypes.reduce((sum, item) => sum + item.totalMarks, 0);

	return {
		assignmentId,
		dueDate: values.dueDate,
		questionTypes,
		totalQuestions,
		totalMarks,
		additionalInstructions: values.additionalInstructions?.trim() || undefined,
		sourceFileAttached: Boolean(values.file),
		expectedOutput: {
			sections: ["Section A", "Section B"],
			includeDifficulty: true,
			includeMarks: true,
		},
	};
}