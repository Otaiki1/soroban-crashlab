'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import type { FuzzingRun } from './types';

interface AddRunAnnotationsProps {
  runs: FuzzingRun[];
}

export default function AddRunAnnotations({ runs }: AddRunAnnotationsProps) {
  const [selectedRunId, setSelectedRunId] = useState<string>('');
  const [noteDraft, setNoteDraft] = useState('');
  const [customAnnotations, setCustomAnnotations] = useState<Record<string, string[]>>({});

  const selectedRun = runs.find((r) => r.id === selectedRunId) || (runs.length > 0 ? runs[0] : null);

  const handleAddAnnotation = () => {
    if (!selectedRun || !noteDraft.trim()) return;

    setCustomAnnotations((prev: Record<string, string[]>) => ({
      ...prev,
      [selectedRun.id]: [...(prev[selectedRun.id] || []), noteDraft.trim()],
    }));
    setNoteDraft('');
  };

  const handleRemoveAnnotation = (runId: string, index: number) => {
    setCustomAnnotations((prev: Record<string, string[]>) => {
      const updated = [...(prev[runId] || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        [runId]: updated,
      };
    });
  };

  const annotationsForSelected = useMemo(() => {
    const base = selectedRun?.annotations || [];
    const custom = (selectedRun && customAnnotations[selectedRun.id]) || [];
    return [...base, ...custom];
  }, [selectedRun, customAnnotations]);

  return (
    <section className="w-full rounded-[2rem] border border-black/[.08] bg-white/95 p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950/90 md:p-8 mt-12">
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-400">
          Run Annotations
        </p>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Attach context to your fuzzing results
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400 md:text-base">
          Document your findings, reproduction steps, or triage status directly on a run. Annotations help your team understand the impact of a failure.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <label htmlFor="run-selector" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Select a run to annotate
            </label>
            <select
              id="run-selector"
              value={selectedRunId || (selectedRun?.id || '')}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedRunId(e.target.value)}
              className="w-full max-w-md rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm transition hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-900"
            >
              <option value="" disabled>Choose a run...</option>
              {runs.map((run) => (
                <option key={run.id} value={run.id}>
                  {run.id} — {run.area} ({run.status})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-6 dark:border-indigo-900/30 dark:bg-indigo-950/20">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {selectedRun ? `Annotating ${selectedRun.id}` : 'No run selected'}
            </h3>
            
            <div className="space-y-4">
              <textarea
                value={noteDraft}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNoteDraft(e.target.value)}
                placeholder="Type your notes here... (e.g. 'Reproduction successful with seed X', 'False positive due to mock state')"
                className="w-full min-h-[120px] rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddAnnotation}
                  disabled={!selectedRun || !noteDraft.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Annotation
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Active Annotations ({annotationsForSelected.length})
          </h3>
          
          {annotationsForSelected.length > 0 ? (
            <ul className="space-y-3">
              {annotationsForSelected.map((note, index) => {
                const isCustom = index >= (selectedRun?.annotations?.length || 0);
                return (
                  <li 
                    key={`${selectedRun?.id}-${index}`}
                    className="group relative rounded-xl border border-white bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                      {note}
                    </p>
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAnnotation(selectedRun!.id, index - (selectedRun?.annotations?.length || 0))}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white opacity-0 transition group-hover:opacity-100 hover:bg-rose-600 shadow-sm"
                        aria-label="Remove annotation"
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <div className="mt-2 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                      {isCustom ? 'Added now' : 'Persistent annotation'}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                <svg className="h-6 w-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No annotations yet</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Add notes via the editor on the left</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
