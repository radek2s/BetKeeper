/**
 * UserName Value Object
 * Represents a user's display name
 */
export class UserName {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UserName cannot be empty');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length < 2) {
      throw new Error('UserName must be at least 2 characters long');
    }

    if (trimmedValue.length > 100) {
      throw new Error('UserName cannot exceed 100 characters');
    }

    // Check for invalid characters (only allow letters, numbers, spaces, hyphens, and underscores)
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedValue)) {
      throw new Error('UserName contains invalid characters');
    }

    this._value = trimmedValue;
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): UserName {
    return new UserName(value);
  }

  static isValid(value: string): boolean {
    try {
      new UserName(value);
      return true;
    } catch {
      return false;
    }
  }
}
