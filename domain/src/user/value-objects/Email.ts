/**
 * Email Value Object
 * Represents a valid email address that serves as username in the system
 */
export class Email {
  private readonly _value: string;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    const trimmedValue = value.trim().toLowerCase();

    if (!Email.EMAIL_REGEX.test(trimmedValue)) {
      throw new Error('Invalid email format');
    }

    if (trimmedValue.length > 254) {
      throw new Error('Email cannot exceed 254 characters');
    }

    this._value = trimmedValue;
  }

  get value(): string {
    return this._value;
  }

  get domain(): string {
    return this._value.split('@')[1];
  }

  get localPart(): string {
    return this._value.split('@')[0];
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): Email {
    return new Email(value);
  }

  static isValid(value: string): boolean {
    try {
      new Email(value);
      return true;
    } catch {
      return false;
    }
  }
}
