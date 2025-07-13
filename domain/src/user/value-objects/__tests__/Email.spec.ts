import { describe, it, expect } from "vitest";
import { Email } from "../Email";

describe("Email", () => {
  describe("constructor", () => {
    it("should create a valid Email with a valid email address", () => {
      const value = "test@example.com";
      const email = new Email(value);

      expect(email.value).toBe(value);
    });

    it("should convert email to lowercase", () => {
      const email = new Email("TEST@EXAMPLE.COM");

      expect(email.value).toBe("test@example.com");
    });

    it("should trim whitespace from the value", () => {
      const email = new Email("  test@example.com  ");

      expect(email.value).toBe("test@example.com");
    });

    it("should throw error for empty string", () => {
      expect(() => new Email("")).toThrow("Email cannot be empty");
    });

    it("should throw error for whitespace-only string", () => {
      expect(() => new Email("   ")).toThrow("Email cannot be empty");
    });

    it("should throw error for invalid email format", () => {
      expect(() => new Email("invalid-email")).toThrow("Invalid email format");
      expect(() => new Email("test@")).toThrow("Invalid email format");
      expect(() => new Email("@example.com")).toThrow("Invalid email format");
      expect(() => new Email("test@example")).toThrow("Invalid email format");
      expect(() => new Email("test.example.com")).toThrow(
        "Invalid email format",
      );
    });

    it("should throw error for emails exceeding 254 characters", () => {
      const longLocal = "a".repeat(250);
      const longEmail = `${longLocal}@example.com`;
      expect(() => new Email(longEmail)).toThrow(
        "Email cannot exceed 254 characters",
      );
    });

    it("should accept valid email formats", () => {
      const validEmails = [
        "test@example.com",
        "user.name@example.com",
        "user+tag@example.com",
        "user123@example-domain.com",
        "a@b.co",
      ];

      validEmails.forEach((emailValue) => {
        expect(() => new Email(emailValue)).not.toThrow();
      });
    });
  });

  describe("domain property", () => {
    it("should return the domain part of the email", () => {
      const email = new Email("test@example.com");

      expect(email.domain).toBe("example.com");
    });

    it("should handle complex domains", () => {
      const email = new Email("user@sub.example.co.uk");

      expect(email.domain).toBe("sub.example.co.uk");
    });
  });

  describe("localPart property", () => {
    it("should return the local part of the email", () => {
      const email = new Email("test@example.com");

      expect(email.localPart).toBe("test");
    });

    it("should handle complex local parts", () => {
      const email = new Email("user.name+tag@example.com");

      expect(email.localPart).toBe("user.name+tag");
    });
  });

  describe("equals", () => {
    it("should return true for identical email addresses", () => {
      const email1 = new Email("test@example.com");
      const email2 = new Email("test@example.com");

      expect(email1.equals(email2)).toBe(true);
    });

    it("should return false for different email addresses", () => {
      const email1 = new Email("test@example.com");
      const email2 = new Email("other@example.com");

      expect(email1.equals(email2)).toBe(false);
    });

    it("should handle case insensitivity correctly", () => {
      const email1 = new Email("test@example.com");
      const email2 = new Email("TEST@EXAMPLE.COM");

      expect(email1.equals(email2)).toBe(true);
    });

    it("should handle trimmed values correctly", () => {
      const email1 = new Email("test@example.com");
      const email2 = new Email("  test@example.com  ");

      expect(email1.equals(email2)).toBe(true);
    });
  });

  describe("toString", () => {
    it("should return the email string value", () => {
      const value = "test@example.com";
      const email = new Email(value);

      expect(email.toString()).toBe(value);
    });
  });

  describe("static methods", () => {
    describe("create", () => {
      it("should create a new Email instance", () => {
        const value = "test@example.com";
        const email = Email.create(value);

        expect(email).toBeInstanceOf(Email);
        expect(email.value).toBe(value);
      });
    });

    describe("isValid", () => {
      it("should return true for valid email addresses", () => {
        const validEmails = [
          "test@example.com",
          "user.name@example.com",
          "user+tag@example.com",
        ];

        validEmails.forEach((emailValue) => {
          expect(Email.isValid(emailValue)).toBe(true);
        });
      });

      it("should return false for invalid email addresses", () => {
        const invalidEmails = [
          "invalid-email",
          "test@",
          "@example.com",
          "test@example",
          "",
          "   ",
        ];

        invalidEmails.forEach((emailValue) => {
          expect(Email.isValid(emailValue)).toBe(false);
        });
      });
    });
  });
});
