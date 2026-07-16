import { generateId, type UUID } from "@domain/shared";

export class BetIdea {
  private _id: UUID;
  private _userId: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _content: string;

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get content() {
    return this._content;
  }
  set content(v: string) {
    this._content = v;
    this._updatedAt = new Date();
  }

  constructor(userId: string, content: string) {
    this._id = generateId();
    const now = new Date();
    this._userId = userId;
    this._content = content;
    this._createdAt = now;
    this._updatedAt = now;
  }

  static reconstitute(
    id: UUID,
    userId: string,
    content: string,
    createAt: Date,
    updatedAt: Date,
  ): BetIdea {
    const idea = new BetIdea(userId, content);
    idea._id = id;
    idea._createdAt = createAt;
    idea._updatedAt = updatedAt;
    return idea;
  }
}
