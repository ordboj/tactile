import { GameEvents, type GameEvent } from "../contracts";

export interface FailureRecord {
  readonly predictedContactMs: number;
  readonly missedCueId: string;
}

/**
 * Later tickets draw the failure flow.
 * This stub records the failure event and does not describe contact.
 */
export function createFailureStub(): {
  records: FailureRecord[];
  handle(event: GameEvent): void;
} {
  const records: FailureRecord[] = [];
  return {
    records,
    handle(event) {
      if (event.type !== GameEvents.failure) {
        return;
      }
      records.push({
        predictedContactMs: event.predictedContactMs,
        missedCueId: event.missedCueId,
      });
    },
  };
}
