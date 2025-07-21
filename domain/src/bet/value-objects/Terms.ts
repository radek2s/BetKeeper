/**
 * Terms Value Object
 * Represents the terms and conditions of a bet
 */
export class Terms {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.trim();
  }

  private validate(value: string): void {
    if (!value || typeof value !== "string") {
      throw new Error("Terms cannot be empty");
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      throw new Error("Terms cannot be empty");
    }

    if (trimmedValue.length < 10) {
      throw new Error("Terms must be at least 10 characters long");
    }

    if (trimmedValue.length > 1000) {
      throw new Error("Terms cannot exceed 1000 characters");
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: Terms): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  /**
   * Creates a new Terms instance with updated content
   */
  update(newValue: string): Terms {
    return new Terms(newValue);
  }
}
