/**
 * UserId Value Object
 * Represents a unique identifier for a user in the system
 */
export class UserId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UserId cannot be empty');
    }

    if (value.length > 255) {
      throw new Error('UserId cannot exceed 255 characters');
    }

    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): UserId {
    return new UserId(value);
  }

  static fromString(value: string): UserId {
    return new UserId(value);
  }
}
