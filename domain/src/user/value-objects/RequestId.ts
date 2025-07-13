/**
 * RequestId Value Object
 * Represents a unique identifier for friend requests and invitation requests
 */
export class RequestId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('RequestId cannot be empty');
    }

    if (value.length > 255) {
      throw new Error('RequestId cannot exceed 255 characters');
    }

    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: RequestId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): RequestId {
    return new RequestId(value);
  }

  static generate(): RequestId {
    // Simple UUID-like generation for demo purposes
    // In production, use a proper UUID library
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2);
    return new RequestId(`req_${timestamp}_${randomPart}`);
  }
}
