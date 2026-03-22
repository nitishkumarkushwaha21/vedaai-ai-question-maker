import type { CreateAssignmentFormValues } from "@/modules/assignments/schema";
import type { GenerationRequestPayload } from "@/types/generation-request";

function buildSectionsByTag(values: CreateAssignmentFormValues) {
	const tag = values.sectionGroupingTag;

	const toSectionTitles = (count: number) =>
		Array.from({ length: Math.max(1, count) }, (_, index) => `Section ${String.fromCharCode(65 + index)}`);

	if (tag === "question-type") {
		const count = Array.from(new Set(values.questionRows.map((row) => row.type))).length;
		return toSectionTitles(count);
	}

	if (tag === "difficulty") {
		return toSectionTitles(3);
	}

	if (tag === "marks") {
		const count = Array.from(new Set(values.questionRows.map((row) => row.marksPerQuestion))).length;
		return toSectionTitles(count);
	}

	return toSectionTitles(2);
}

function buildAdditionalInstructions(values: CreateAssignmentFormValues) {
	const original = values.additionalInstructions?.trim();

	if (!values.sectionGroupingTag) {
		return original || undefined;
	}

	const tagInstruction = `Structure sections by ${values.sectionGroupingTag}.`;
	return original ? `${original}\n${tagInstruction}` : tagInstruction;
}

export function buildGenerationRequestPayload(
	assignmentId: string,
	values: CreateAssignmentFormValues,
	userId: string,
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
		userId,
		assignmentId,
		dueDate: values.dueDate,
		questionTypes,
		totalQuestions,
		totalMarks,
		additionalInstructions: buildAdditionalInstructions(values),
		specialInstruction: {
			enabled: false,
		},
		sourceFileAttached: Boolean(values.file),
		expectedOutput: {
			sections: buildSectionsByTag(values),
			includeDifficulty: true,
			includeMarks: true,
			sectionGroupingTag: values.sectionGroupingTag,
		},
	};
}