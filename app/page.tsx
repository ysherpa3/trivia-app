import { SetupForm } from "@/components/SetupForm";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trivia Challenge
          </h1>
          <p className="text-gray-600 text-sm">
            Set your preferences and see what you know
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-card-line">
          <SetupForm />
        </div>
        <p className="text-center text-xs text-gray-500">
          Questions from{" "}
          <a
            href="https://opentdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-gray-700"
          >
            Open Trivia DB
          </a>
        </p>
      </div>
    </main>
  );
}
