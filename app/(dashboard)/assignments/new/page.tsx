import { CreateAssignmentForm } from "@/components/create-assignment/create-assignment-form";

export default function CreateAssignmentPage() {
  return (
    <section className="space-y-4 pb-20 md:pb-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Create Assignment</h1>
        <p className="text-sm text-gray-500">Set up a new assignment for your students.</p>
      </header>

      <div className="h-1 w-full rounded-full bg-gray-200">
        <div className="h-1 w-1/2 rounded-full bg-gray-700" />
      </div>

      <CreateAssignmentForm />
    </section>
  );
}