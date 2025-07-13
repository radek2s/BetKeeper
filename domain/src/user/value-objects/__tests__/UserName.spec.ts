import { describe, it, expect } from 'vitest';
import { UserName } from '../UserName';

describe('UserName', () => {
  describe('constructor', () => {
    it('should create a valid UserName with a valid name', () => {
      const value = 'John Doe';
      const userName = new UserName(value);

      expect(userName.value).toBe(value);
    });

    it('should trim whitespace from the value', () => {
      const userName = new UserName('  John Doe  ');

      expect(userName.value).toBe('John Doe');
    });

    it('should throw error for empty string', () => {
      expect(() => new UserName('')).toThrow('UserName cannot be empty');
    });

    it('should throw error for whitespace-only string', () => {
      expect(() => new UserName('   ')).toThrow('UserName cannot be empty');
    });

    it('should throw error for names shorter than 2 characters', () => {
      expect(() => new UserName('A')).toThrow('UserName must be at least 2 characters long');
    });

    it('should throw error for names exceeding 100 characters', () => {
      const longName = 'A'.repeat(101);
      expect(() => new UserName(longName)).toThrow('UserName cannot exceed 100 characters');
    });

    it('should accept names with exactly 2 characters', () => {
      const userName = new UserName('Jo');

      expect(userName.value).toBe('Jo');
    });

    it('should accept names with exactly 100 characters', () => {
      const maxName = 'A'.repeat(100);
      const userName = new UserName(maxName);

      expect(userName.value).toBe(maxName);
    });

    it('should throw error for invalid characters', () => {
      const invalidNames = [
        'John@Doe',
        'John#Doe',
        'John$Doe',
        'John%Doe',
        'John&Doe',
        'John*Doe',
        'John+Doe',
        'John=Doe',
        'John?Doe',
        'John^Doe',
        'John`Doe',
        'John|Doe',
        'John~Doe'
      ];

      invalidNames.forEach(name => {
        expect(() => new UserName(name)).toThrow('UserName contains invalid characters');
      });
    });

    it('should accept valid characters', () => {
      const validNames = [
        'John Doe',
        'John-Doe',
        'John_Doe',
        'John123',
        'JohnDoe',
        'john doe',
        'JOHN DOE',
        'John-Smith_Jr 123'
      ];

      validNames.forEach(name => {
        expect(() => new UserName(name)).not.toThrow();
      });
    });
  });

  describe('equals', () => {
    it('should return true for identical names', () => {
      const userName1 = new UserName('John Doe');
      const userName2 = new UserName('John Doe');

      expect(userName1.equals(userName2)).toBe(true);
    });

    it('should return false for different names', () => {
      const userName1 = new UserName('John Doe');
      const userName2 = new UserName('Jane Doe');

      expect(userName1.equals(userName2)).toBe(false);
    });

    it('should be case sensitive', () => {
      const userName1 = new UserName('John Doe');
      const userName2 = new UserName('john doe');

      expect(userName1.equals(userName2)).toBe(false);
    });

    it('should handle trimmed values correctly', () => {
      const userName1 = new UserName('John Doe');
      const userName2 = new UserName('  John Doe  ');

      expect(userName1.equals(userName2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the name string value', () => {
      const value = 'John Doe';
      const userName = new UserName(value);

      expect(userName.toString()).toBe(value);
    });
  });

  describe('static methods', () => {
    describe('create', () => {
      it('should create a new UserName instance', () => {
        const value = 'John Doe';
        const userName = UserName.create(value);

        expect(userName).toBeInstanceOf(UserName);
        expect(userName.value).toBe(value);
      });
    });

    describe('isValid', () => {
      it('should return true for valid names', () => {
        const validNames = [
          'John Doe',
          'John-Doe',
          'John_Doe',
          'John123',
          'Jo'
        ];

        validNames.forEach(name => {
          expect(UserName.isValid(name)).toBe(true);
        });
      });

      it('should return false for invalid names', () => {
        const invalidNames = [
          '',
          'A',
          'John@Doe',
          'A'.repeat(101),
          '   '
        ];

        invalidNames.forEach(name => {
          expect(UserName.isValid(name)).toBe(false);
        });
      });
    });
  });
});
