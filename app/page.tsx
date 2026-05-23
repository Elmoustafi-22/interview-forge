"use client";

import React, { useState } from "react";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [generatedJobTitle, setGeneratedJobTitle] = useState("");
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuestions(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Request failed");
      }

      setQuestions(data.questions || []);
      setGeneratedJobTitle(jobTitle);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-10 text-slate-950 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col justify-center">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Interview Forge
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Generate thoughtful interview questions for any role.
          </h1>
          <p className="mt-4 whitespace-nowrap text-base leading-7 text-slate-600">
            Enter a job title and get three role-specific questions focused on practical signals, behavior, and judgment.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <form onSubmit={submit} className="space-y-4">
            <label
              htmlFor="job-title"
              className="block text-sm font-semibold text-slate-800"
            >
              Job title
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="job-title"
                className="min-h-12 flex-1 rounded-md border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                placeholder="Customer Success Manager"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
              <button
                className="min-h-12 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                type="submit"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Questions"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error: {error}
            </div>
          )}

          {questions && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <h2 className="text-lg font-semibold text-slate-950">
                Questions for {generatedJobTitle}
              </h2>
              <ol className="mt-4 space-y-3">
                {questions.map((q, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    <span className="mr-2 font-semibold text-teal-700">
                      {i + 1}.
                    </span>
                    {q}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
