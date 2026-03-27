'use client';

import Link from 'next/link';
import { FuzzingRun } from './types';

interface CrashDetailDrawerProps {
    run: FuzzingRun;
    onClose: () => void;
}

export default function CrashDetailDrawer({ run, onClose }: CrashDetailDrawerProps) {
    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="crash-detail-title">
            <button
                type="button"
                className="absolute inset-0 bg-black/40 dark:bg-black/60"
                onClick={onClose}
                aria-label="Close crash detail drawer"
            />
            <aside className="absolute right-0 top-0 h-full w-full max-w-xl bg-white dark:bg-zinc-950 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">Crash Details</p>
                        <h2 id="crash-detail-title" className="text-2xl font-bold">Run {run.id}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                        aria-label="Close drawer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {run.crashDetail ? (
                    <div className="space-y-5">
                        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">Failure Category</p>
                            <p className="font-medium">{run.crashDetail.failureCategory}</p>
                        </div>

                        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">Signature</p>
                            <p className="font-mono text-sm break-all">{run.crashDetail.signature}</p>
                        </div>

                        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">Payload</p>
                            <pre className="font-mono text-xs whitespace-pre-wrap break-words text-zinc-700 dark:text-zinc-300">
                                {run.crashDetail.payload}
                            </pre>
                        </div>

                        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">Replay Action</p>
                            <p className="font-mono text-xs whitespace-pre-wrap break-words">{run.crashDetail.replayAction}</p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-4 text-sm text-zinc-600 dark:text-zinc-300">
                        No crash details are available for this run.
                    </div>
                )}

                <div className="mt-8 flex items-center justify-end gap-3">
                    <Link
                        href={`/runs/${run.id}`}
                        className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
                    >
                        Open Run Page
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        Close
                    </button>
                </div>
            </aside>
        </div>
    );
}
