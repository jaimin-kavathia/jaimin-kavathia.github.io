/**
 * Tests for accessibility utilities
 */

import { 
  announceToScreenReader, 
  provideAlternativeFeedback,
  enhanceKeyboardNavigation,
  testKeyboardNavigation,
  initializeAccessibilityEnhancements
} from '../accessibility';

// Mock DOM methods
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
const mockQuerySelector = jest.fn();
const mockGetElementById = jest.fn();
const mockMatchMedia = jest.fn();

// Setup DOM mocks
beforeEach(() => {
  // Reset mocks
  mockAppendChild.mockClear();
  mockRemoveChild.mockClear();
  mockQuerySelector.mockClear();
  mockGetElementById.mockClear();
  mockMatchMedia.mockClear();

  // Mock document.body
  Object.defineProperty(document, 'body', {
    value: {
      appendChild: mockAppendChild,
      removeChild: mockRemoveChild,
      insertBefore: jest.fn(),
      contains: jest.fn().mockReturnValue(true)
    },
    writable: true
  });

  // Mock document methods
  Object.defineProperty(document, 'querySelector', {
    value: mockQuerySelector,
    writable: true
  });

  Object.defineProperty(document, 'getElementById', {
    value: mockGetElementById,
    writable: true
  });

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    value: mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }),
    writable: true
  });

  // Mock console methods
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('announceToScreenReader', () => {
  it('should create and append announcement element', () => {
    announceToScreenReader('Test message');

    expect(mockAppendChild).toHaveBeenCalledWith(
      expect.objectContaining({
        textContent: 'Test message'
      })
    );
  });

  it('should set correct aria attributes', () => {
    announceToScreenReader('Test message', 'assertive');

    const call = mockAppendChild.mock.calls[0];
    const element = call[0];
    
    expect(element.getAttribute('aria-live')).toBe('assertive');
    expect(element.getAttribute('aria-atomic')).toBe('true');
  });

  it('should remove announcement after timeout', (done) => {
    announceToScreenReader('Test message');

    setTimeout(() => {
      expect(mockRemoveChild).toHaveBeenCalled();
      done();
    }, 1100);
  });
});

describe('provideAlternativeFeedback', () => {
  it('should add feedback classes to element', () => {
    const mockElement = {
      className: 'original-class'
    } as HTMLElement;

    provideAlternativeFeedback(mockElement, 'hover');

    expect(mockElement.className).toContain('bg-blue-100/20');
    expect(mockElement.className).toContain('border-blue-300/50');
  });

  it('should restore original classes after timeout', (done) => {
    const mockElement = {
      className: 'original-class'
    } as HTMLElement;

    provideAlternativeFeedback(mockElement, 'focus');

    setTimeout(() => {
      expect(mockElement.className).toBe('original-class');
      done();
    }, 250);
  });
});

describe('enhanceKeyboardNavigation', () => {
  it('should add focus event listener', () => {
    const mockElement = {
      addEventListener: jest.fn(),
      getAttribute: jest.fn().mockReturnValue('Test button'),
      textContent: 'Test'
    } as unknown as HTMLElement;

    enhanceKeyboardNavigation(mockElement);

    expect(mockElement.addEventListener).toHaveBeenCalledWith('focus', expect.any(Function));
    expect(mockElement.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});

describe('testKeyboardNavigation', () => {
  it('should find accessibility issues', () => {
    const mockElement = {
      tagName: 'BUTTON',
      getAttribute: jest.fn().mockReturnValue(null),
      textContent: null
    };

    const mockContainer = {
      querySelectorAll: jest.fn().mockReturnValue([mockElement])
    } as unknown as HTMLElement;

    const issues = testKeyboardNavigation(mockContainer);

    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]).toContain('lacks accessible label');
  });

  it('should return empty array when no issues found', () => {
    const mockElement = {
      tagName: 'BUTTON',
      getAttribute: jest.fn().mockReturnValue('Test button'),
      textContent: 'Test'
    };

    const mockContainer = {
      querySelectorAll: jest.fn().mockReturnValue([mockElement])
    } as unknown as HTMLElement;

    // Mock getComputedStyle to return focus indicator
    Object.defineProperty(window, 'getComputedStyle', {
      value: jest.fn().mockReturnValue({
        outline: '2px solid blue'
      }),
      writable: true
    });

    const issues = testKeyboardNavigation(mockContainer);

    expect(issues).toHaveLength(0);
  });
});

describe('initializeAccessibilityEnhancements', () => {
  it('should inject reduced motion styles', () => {
    const mockHead = {
      appendChild: jest.fn()
    };

    Object.defineProperty(document, 'head', {
      value: mockHead,
      writable: true
    });

    initializeAccessibilityEnhancements();

    expect(mockHead.appendChild).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'reduced-motion-styles'
      })
    );
  });

  it('should add skip link', () => {
    const mockInsertBefore = jest.fn();
    
    Object.defineProperty(document.body, 'insertBefore', {
      value: mockInsertBefore,
      writable: true
    });

    Object.defineProperty(document.body, 'firstChild', {
      value: {},
      writable: true
    });

    initializeAccessibilityEnhancements();

    expect(mockInsertBefore).toHaveBeenCalledWith(
      expect.objectContaining({
        href: '#main-content',
        textContent: 'Skip to main content'
      }),
      expect.any(Object)
    );
  });
});