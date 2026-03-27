/**
 * Status variants for a fuzzing run.
 */
export type RunStatus = 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Crash details captured when a run fails.
 */
export interface CrashDetail {
    /** High-level category used to group failures */
    failureCategory: string;
    /** Stable signature for de-duplicating failures */
    signature: string;
    /** Payload associated with the failing input */
    payload: string;
    /** Command or action used to replay locally */
    replayAction: string;
}

/**
 * Interface representing a single fuzzing run.
 */
export interface FuzzingRun {
    /** Unique identifier for the run */
    id: string;
    /** Current state of the run */
    status: RunStatus;
    /** Total elapsed duration in milliseconds */
    duration: number;
    /** Number of seeds used/generated during the run */
    seedCount: number;
    /** Crash detail payload when the run has failed */
    crashDetail: CrashDetail | null;
    /** CPU instructions consumed by the run */
    cpuInstructions: number;
    /** Memory bytes consumed by the run */
    memoryBytes: number;
    /** Minimum resource fee measured for the run */
    minResourceFee: number;
}

export type LedgerChangeType = 'created' | 'updated' | 'deleted';

export interface LedgerStateChange {
    id: string;
    entryType: string;
    changeType: LedgerChangeType;
    before?: string;
    after?: string;
}
