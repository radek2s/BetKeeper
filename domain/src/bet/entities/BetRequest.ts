import { Entity, generateId, UUID } from "@domain/shared";

type BetRequestStatus = "pending" | "rejected" | "approved";

export class BetRequest extends Entity {
  private readonly _id: UUID;
  private _status: BetRequestStatus;

  constructor(id?: UUID) {
    super();
    this._id = id || generateId();
    this._status = "pending";

    if (!id) {
      // this.addDomainEvent(
      //     new
      // )
    }
  }

  override get id(): string {
    return this._id;
  }
  override equals(other: Entity): boolean {
    if (!(other instanceof BetRequest)) {
      return false;
    }
    return this._id === other._id;
  }
  override toString(): string {
    return `BetRequest(${this._id}, ${this._status})`;
  }

  setTerms() {}

  setStakes() {}

  approve() {}

  reject() {}
}
