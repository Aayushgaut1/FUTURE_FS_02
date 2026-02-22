import { StickyNote } from "lucide-react";

export function Notes() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Notes / Follow-ups</h1>
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <StickyNote className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Coming soon</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          Notes and follow-up reminders will be available here. This feature is under development.
        </p>
      </div>
    </div>
  );
}
