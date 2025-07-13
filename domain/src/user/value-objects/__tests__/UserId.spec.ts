/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { describe, it, expect } from "vitest";
import { UserId } from "../UserId";

describe("UserId", () => {
  describe("constructor", () => {
    it("should create a valid UserId with a string value", () => {
      const value = "user_123";
      const userId = new UserId(value);

      expect(userId.value).toBe(value);
    });

    it("should trim whitespace from the value", () => {
      const userId = new UserId("  user_123  ");

      expect(userId.value).toBe("user_123");
    });

    it("should throw error for empty string", () => {
      expect(() => new UserId("")).toThrow("UserId cannot be empty");
    });

    it("should throw error for whitespace-only string", () => {
      expect(() => new UserId("   ")).toThrow("UserId cannot be empty");
    });

    it("should throw error for null or undefined", () => {
      expect(() => new UserId(null as any)).toThrow("UserId cannot be empty");
      expect(() => new UserId(undefined as any)).toThrow(
        "UserId cannot be empty",
      );
    });

    it("should throw error for values exceeding 255 characters", () => {
      const longValue = "a".repeat(256);
      expect(() => new UserId(longValue)).toThrow(
        "UserId cannot exceed 255 characters",
      );
    });

    it("should accept values with exactly 255 characters", () => {
      const maxValue = "a".repeat(255);
      const userId = new UserId(maxValue);

      expect(userId.value).toBe(maxValue);
    });
  });

  describe("equals", () => {
    it("should return true for identical values", () => {
      const userId1 = new UserId("user_123");
      const userId2 = new UserId("user_123");

      expect(userId1.equals(userId2)).toBe(true);
    });

    it("should return false for different values", () => {
      const userId1 = new UserId("user_123");
      const userId2 = new UserId("user_456");

      expect(userId1.equals(userId2)).toBe(false);
    });

    it("should handle trimmed values correctly", () => {
      const userId1 = new UserId("user_123");
      const userId2 = new UserId("  user_123  ");

      expect(userId1.equals(userId2)).toBe(true);
    });
  });

  describe("toString", () => {
    it("should return the string value", () => {
      const value = "user_123";
      const userId = new UserId(value);

      expect(userId.toString()).toBe(value);
    });
  });

  describe("static methods", () => {
    describe("create", () => {
      it("should create a new UserId instance", () => {
        const value = "user_123";
        const userId = UserId.create(value);

        expect(userId).toBeInstanceOf(UserId);
        expect(userId.value).toBe(value);
      });
    });

    describe("fromString", () => {
      it("should create a new UserId instance from string", () => {
        const value = "user_123";
        const userId = UserId.fromString(value);

        expect(userId).toBeInstanceOf(UserId);
        expect(userId.value).toBe(value);
      });
    });
  });
});
