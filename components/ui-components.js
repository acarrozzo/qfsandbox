/**
 * QuickFrame UI Components
 * Replicating @mntn-dev/ui-components patterns
 */

import { componentClasses, designTokens } from './design-system.js';

// Button Component
export class Button {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      variant: 'primary',
      size: 'md',
      disabled: false,
      ...options
    };
    this.init();
  }

  init() {
    this.element.className = this.getButtonClasses();
    this.element.disabled = this.options.disabled;
    this.setupEventListeners();
  }

  getButtonClasses() {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2';
    const variantClasses = componentClasses.button[this.options.variant] || componentClasses.button.primary;
    const sizeClasses = this.getSizeClasses();
    
    return `${baseClasses} ${variantClasses} ${sizeClasses}`;
  }

  getSizeClasses() {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-lg'
    };
    return sizes[this.options.size] || sizes.md;
  }

  setupEventListeners() {
    this.element.addEventListener('click', (e) => {
      if (this.options.disabled) {
        e.preventDefault();
        return;
      }
      this.options.onClick?.(e);
    });
  }

  update(options) {
    this.options = { ...this.options, ...options };
    this.init();
  }
}

// Input Component
export class Input {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      type: 'text',
      placeholder: '',
      disabled: false,
      ...options
    };
    this.init();
  }

  init() {
    this.element.className = componentClasses.input;
    this.element.type = this.options.type;
    this.element.placeholder = this.options.placeholder;
    this.element.disabled = this.options.disabled;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.element.addEventListener('input', (e) => {
      this.options.onChange?.(e.target.value, e);
    });

    this.element.addEventListener('focus', (e) => {
      this.options.onFocus?.(e);
    });

    this.element.addEventListener('blur', (e) => {
      this.options.onBlur?.(e);
    });
  }

  getValue() {
    return this.element.value;
  }

  setValue(value) {
    this.element.value = value;
  }

  update(options) {
    this.options = { ...this.options, ...options };
    this.init();
  }
}

// Card Component
export class Card {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      variant: 'default',
      interactive: false,
      ...options
    };
    this.init();
  }

  init() {
    this.element.className = this.getCardClasses();
    this.setupEventListeners();
  }

  getCardClasses() {
    const baseClasses = componentClasses.card;
    const interactiveClasses = this.options.interactive ? 'cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-xl' : '';
    return `${baseClasses} ${interactiveClasses}`;
  }

  setupEventListeners() {
    if (this.options.interactive) {
      this.element.addEventListener('click', (e) => {
        this.options.onClick?.(e);
      });
    }
  }
}

// Loading Spinner Component
export class LoadingSpinner {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      size: 'md',
      color: 'brand',
      ...options
    };
    this.init();
  }

  init() {
    this.element.innerHTML = this.getSpinnerHTML();
    this.element.className = this.getSpinnerClasses();
  }

  getSpinnerHTML() {
    return `
      <div class="animate-spin rounded-full border-2 border-t-transparent" style="border-top-color: ${designTokens.colors[this.options.color] || designTokens.colors.brand};">
        <span class="sr-only">Loading...</span>
      </div>
    `;
  }

  getSpinnerClasses() {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    return `flex items-center justify-center ${sizes[this.options.size] || sizes.md}`;
  }
}

// Empty State Component
export class EmptyState {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      title: '',
      subtitle: '',
      icon: 'info-circle',
      ...options
    };
    this.init();
  }

  init() {
    this.element.innerHTML = this.getEmptyStateHTML();
    this.element.className = 'flex flex-col items-center justify-center text-center p-8';
  }

  getEmptyStateHTML() {
    return `
      <div class="w-16 h-16 bg-qf-green/20 rounded-full flex items-center justify-center mb-4">
        <i class="fas fa-${this.options.icon} text-qf-green text-2xl"></i>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">${this.options.title}</h3>
      <p class="text-qf-light-gray">${this.options.subtitle}</p>
    `;
  }
}

// Tooltip Component
export class Tooltip {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      content: '',
      position: 'top',
      delay: 0,
      ...options
    };
    this.init();
  }

  init() {
    this.setupTooltip();
    this.setupEventListeners();
  }

  setupTooltip() {
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = `
      absolute z-50 px-3 py-2 text-sm text-white bg-qf-darker rounded-lg shadow-lg
      opacity-0 transition-opacity duration-200 pointer-events-none
    `;
    this.tooltipElement.textContent = this.options.content;
    document.body.appendChild(this.tooltipElement);
  }

  setupEventListeners() {
    let timeout;
    
    this.element.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.show();
      }, this.options.delay);
    });

    this.element.addEventListener('mouseleave', () => {
      clearTimeout(timeout);
      this.hide();
    });
  }

  show() {
    const rect = this.element.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    
    let top, left;
    
    switch (this.options.position) {
      case 'top':
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 8;
        break;
    }
    
    this.tooltipElement.style.top = `${top + window.scrollY}px`;
    this.tooltipElement.style.left = `${left + window.scrollX}px`;
    this.tooltipElement.style.opacity = '1';
  }

  hide() {
    this.tooltipElement.style.opacity = '0';
  }

  destroy() {
    this.tooltipElement?.remove();
  }
}

// Export all components
export default {
  Button,
  Input,
  Card,
  LoadingSpinner,
  EmptyState,
  Tooltip
};
