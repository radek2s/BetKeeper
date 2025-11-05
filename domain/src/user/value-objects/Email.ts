/**
 * Email Value Object
 * Represents a valid email address that serves as username in the system
 * https://codemia.io/knowledge-hub/path/what_is_the_maximum_length_of_a_valid_email_address
 */
export class Email {
  private readonly _value: string;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Email cannot be empty");
    }

    const trimmedValue = value.trim().toLowerCase();

    if (!Email.EMAIL_REGEX.test(trimmedValue)) {
      throw new Error("Invalid email format");
    }

    const [localPart, domainPart] = trimmedValue.split("@");
    if (localPart.length > 64) {
      throw new Error("Email local part cannot exceed 64 characters");
    }
    if (domainPart.length > 190) {
      throw new Error("Email domain part cannot exceed 190 characters");
    }

    this._value = trimmedValue;
  }

  get value(): string {
    return this._value;
  }

  get domain(): string {
    return this._value.split("@")[1];
  }

  get localPart(): string {
    return this._value.split("@")[0];
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
