/**
 * Session-only score.
 * The numbers are placeholders until OQ-5.
 * TAC-18 adds the rewind cost in this same object.
 * The score is not stored on the level and it is not saved.
 */
export const SESSION_SCORE = {
  safeWait: 10,
  fastCross: 4,
} as const;

if (SESSION_SCORE.safeWait <= SESSION_SCORE.fastCross) {
  throw new Error("A safe wait must score higher than a fast cross");
}
