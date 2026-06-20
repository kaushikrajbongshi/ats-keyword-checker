"use client";

import { useState, type ChangeEvent } from "react";
import { matchKeywords, type MatchResult } from "@/lib/matchKeywords";
import { extractTextFromFile } from "@/lib/parseResumeFile";


const AUTHOR_NAME = "Kaushik Rajbongshi";
const AUTHOR_EMAIL = "kaushikraj0241@gmail.com";
// ------------------------------------------------

const SAMPLE_JD = `We're hiring a Full Stack Developer with strong experience in React, Next.js, Node.js, and SQL. You'll build and maintain REST APIs, work with MySQL and Prisma, collaborate with our team using Git and Agile workflows, and care about clean, testable code. Experience with TypeScript and AWS is a plus. Strong communication and problem solving skills required.`;

function verdict(score: number): { label: string; tone: string } {
  if (score >= 75) return { label: "Strong match", tone: "text-moss" };
  if (score >= 45) return { label: "Moderate match", tone: "text-stamp-dark" };
  return { label: "Needs work", tone: "text-stamp-dark" };
}

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [resultKey, setResultKey] = useState(0);
  const [fileStatus, setFileStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const canCheck = jobDescription.trim().length > 20 && resumeText.trim().length > 20;

  async function handleResumeFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileStatus({ type: "loading", message: `Parsing ${file.name}...` });
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      setFileStatus({ type: "success", message: `Parsed ${file.name}` });
    } catch (err) {
      setFileStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Couldn't read that file.",
      });
    } finally {
      e.target.value = "";
    }
  }

  function handleCheck() {
    if (!canCheck) return;
    const r = matchKeywords(jobDescription, resumeText);
    setResult(r);
    setResultKey((k) => k + 1);
  }

  function loadSample() {
    setJobDescription(SAMPLE_JD);
  }

  const v = result ? verdict(result.score) : null;

  return (
    <main className="min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Top bar */}
        <header className="mb-10 flex flex-col gap-4 border-b border-paper-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-stamp">
              Pre-flight check
            </p>
            <h1 className="mt-1 font-mono text-3xl font-bold leading-tight text-ink sm:text-4xl">
              ATS Keyword Match Checker
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink-soft">
              Paste the job description and your resume. See exactly which keywords an
              applicant-tracking system would look for - and which ones you&apos;re missing -
              before you hit submit.
            </p>
          </div>
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-ink bg-ink px-4 font-mono text-xs font-semibold uppercase tracking-wide text-paper transition hover:bg-ink-soft"
          >
            Built for Digital Heroes
          </a>
        </header>

        {/* Input panes */}
        <section className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-lg border border-paper-line bg-[#F6F4EA] shadow-card">
            <div className="flex items-center justify-between border-b border-paper-line px-4 py-2.5">
              <span className="font-mono text-xs font-semibold uppercase tracking-wide text-ink-soft">
                01 — Job description
              </span>
              <button
                onClick={loadSample}
                className="font-mono text-xs text-stamp underline-offset-2 hover:underline"
              >
                Load sample
              </button>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job posting here..."
              className="h-64 w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-ink outline-none"
            />
          </div>

          <div className="rounded-lg border border-paper-line bg-[#F6F4EA] shadow-card">
            <div className="flex items-center justify-between border-b border-paper-line px-4 py-2.5">
              <span className="font-mono text-xs font-semibold uppercase tracking-wide text-ink-soft">
                02 — Your resume
              </span>
              <label className="cursor-pointer font-mono text-xs text-stamp underline-offset-2 hover:underline">
                Upload file
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={handleResumeFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {fileStatus.type !== "idle" && (
              <p
                className={`px-4 pt-2 font-mono text-xs ${
                  fileStatus.type === "error"
                    ? "text-stamp-dark"
                    : fileStatus.type === "loading"
                    ? "text-ink-soft"
                    : "text-moss"
                }`}
              >
                {fileStatus.type === "success" ? "✓ " : ""}
                {fileStatus.message}
              </p>
            )}
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here, or upload a .pdf / .docx / .txt file above..."
              className="h-64 w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-ink outline-none"
            />
          </div>
        </section>

        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            onClick={handleCheck}
            disabled={!canCheck}
            className="font-mono text-sm font-bold uppercase tracking-wide text-paper transition disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-stamp-dark inline-flex h-12 items-center justify-center rounded-md bg-stamp px-8"
          >
            Check match
          </button>
          {!canCheck && (
            <p className="font-mono text-xs text-ink-soft">
              Paste both fields (at least a couple of sentences each) to run the check.
            </p>
          )}
        </div>

        {/* Results */}
        {result && v && (
          <section key={resultKey} className="mt-10 border-t border-paper-line pt-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div
                className="stamp-pop flex h-28 w-28 items-center justify-center rounded-full border-4 border-stamp font-mono text-3xl font-bold text-stamp"
                style={{ transform: "rotate(-6deg)" }}
              >
                {result.score}%
              </div>
              <p className={`font-mono text-lg font-bold ${v.tone}`}>{v.label}</p>
              <p className="max-w-md text-sm text-ink-soft">
                {result.matched.length} of {result.totalKeywords} keywords from this job
                description show up in your resume.
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-moss">
                  Found in your resume ({result.matched.length})
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.matched.length === 0 && (
                    <p className="text-sm text-ink-soft">None yet — try the missing list →</p>
                  )}
                  {result.matched.map((kw) => (
                    <span
                      key={kw}
                      className="chip-highlight rounded px-2.5 py-1 font-mono text-xs font-medium text-ink"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-stamp">
                  Missing from your resume ({result.missing.length})
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.missing.length === 0 && (
                    <p className="text-sm text-ink-soft">Nothing missing — great coverage.</p>
                  )}
                  {result.missing.map((kw) => (
                    <span
                      key={kw}
                      className="rounded border-2 border-stamp px-2.5 py-1 font-mono text-xs font-medium text-stamp-dark"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-8 text-sm text-ink-soft">
              Tip: only add a missing keyword if it&apos;s actually true of your experience.
              Work it into a real sentence — a bullet point, not a buried list — so it reads
              naturally to a human reviewer too.
            </p>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 flex flex-col items-center gap-3 border-t border-paper-line pt-6 text-center">
          <p className="font-mono text-xs text-ink-soft">
            Runs entirely in your browser. Nothing you paste is stored or sent anywhere.
          </p>
          <p className="text-sm text-ink">
            Built by <span className="font-semibold">{AUTHOR_NAME}</span> ·{" "}
            <a href={`mailto:${AUTHOR_EMAIL}`} className="underline">
              {AUTHOR_EMAIL}
            </a>
          </p>
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md border border-ink px-4 font-mono text-xs font-semibold uppercase tracking-wide text-ink transition hover:bg-ink hover:text-paper"
          >
            Built for Digital Heroes
          </a>
        </footer>
      </div>
    </main>
  );
}
