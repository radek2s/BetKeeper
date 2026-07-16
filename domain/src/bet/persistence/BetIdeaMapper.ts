import { BetIdea } from "../entities/BetIdea";
import type { BetIdeaTableRecord } from "./BetIdeaRepository";

export function domainToRecord(idea: BetIdea): BetIdeaTableRecord {
  return {
    id: idea.id,
    userId: idea.userId,
    content: idea.content,
    createdAt: idea.createdAt,
    updatedAt: idea.updatedAt,
  };
}

export function recordToDomain(record: BetIdeaTableRecord): BetIdea {
  return BetIdea.reconstitute(
    record.id,
    record.userId,
    record.content,
    record.createdAt,
    record.updatedAt,
  );
}
