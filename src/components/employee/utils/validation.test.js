import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateMobile, validateRequired } from './validation';

describe('Validation Utils', () => {
    describe('validateEmail', () => {
        it('should return error for empty email', () => {
            expect(validateEmail('')).toBe('Email is required');
        });

        it('should return error for invalid email format', () => {
            expect(validateEmail('invalid-email')).toBe('Invalid email format');
            expect(validateEmail('test@')).toBe('Invalid email format');
            expect(validateEmail('test@com')).toBe('Invalid email format');
        });

        it('should return empty string for valid email', () => {
            expect(validateEmail('test@example.com')).toBe('');
            expect(validateEmail('user.name@domain.co.in')).toBe('');
        });
    });

    describe('validatePassword', () => {
        it('should return error for empty password', () => {
            expect(validatePassword('')).toBe('Password is required');
        });

        it('should return error for short password', () => {
            expect(validatePassword('Short1')).toBe('Password must be at least 8 characters long');
        });

        it('should return error for password with no letters', () => {
            expect(validatePassword('12345678')).toBe('Password must contain at least one letter');
        });

        it('should return error for password with no numbers', () => {
            expect(validatePassword('abcdefgh')).toBe('Password must contain at least one number');
        });

        it('should return empty string for valid password', () => {
            expect(validatePassword('ValidPass123')).toBe('');
        });
    });

    describe('validateMobile', () => {
        it('should return error for empty mobile', () => {
            expect(validateMobile('')).toBe('Mobile number is required');
        });

        it('should return error for invalid mobile length', () => {
            expect(validateMobile('123456789')).toBe('Mobile number must be 10 digits');
            expect(validateMobile('12345678901')).toBe('Mobile number must be 10 digits');
        });

        it('should return error for non-numeric mobile', () => {
            expect(validateMobile('12345abcde')).toBe('Mobile number must be 10 digits');
        });

        it('should return empty string for valid 10-digit mobile', () => {
            expect(validateMobile('1234567890')).toBe('');
        });
    });

    describe('validateRequired', () => {
        it('should return error for empty value', () => {
            expect(validateRequired('Field', '')).toBe('Field is required');
            expect(validateRequired('Field', '   ')).toBe('Field is required');
        });

        it('should return empty string for non-empty value', () => {
            expect(validateRequired('Field', 'Value')).toBe('');
        });
    });
});
