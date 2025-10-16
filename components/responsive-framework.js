/**
 * QuickFrame Responsive Framework
 * Based on your design system breakpoints
 */

import { designTokens } from './design-system.js';

export class ResponsiveFramework {
  constructor() {
    this.breakpoints = designTokens.breakpoints;
    this.currentBreakpoint = this.getCurrentBreakpoint();
    this.init();
  }

  init() {
    // Listen for resize events
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Initial setup
    this.updateBreakpoint();
  }

  // Get current breakpoint
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width >= parseInt(this.breakpoints.xl)) return 'xl';
    if (width >= parseInt(this.breakpoints.lg)) return 'lg';
    if (width >= parseInt(this.breakpoints.md)) return 'md';
    if (width >= parseInt(this.breakpoints.sm)) return 'sm';
    return 'xs';
  }

  // Handle resize events
  handleResize() {
    const newBreakpoint = this.getCurrentBreakpoint();
    if (newBreakpoint !== this.currentBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      this.updateBreakpoint();
      this.dispatchBreakpointChange();
    }
  }

  // Update breakpoint-specific styles
  updateBreakpoint() {
    document.documentElement.setAttribute('data-breakpoint', this.currentBreakpoint);
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--current-breakpoint', this.currentBreakpoint);
  }

  // Dispatch breakpoint change event
  dispatchBreakpointChange() {
    const event = new CustomEvent('breakpointChange', {
      detail: { breakpoint: this.currentBreakpoint }
    });
    window.dispatchEvent(event);
  }

  // Get responsive classes
  getResponsiveClasses(base, sm, md, lg, xl) {
    const classes = [base];
    
    if (sm) classes.push(`sm:${sm}`);
    if (md) classes.push(`md:${md}`);
    if (lg) classes.push(`lg:${lg}`);
    if (xl) classes.push(`xl:${xl}`);
    
    return classes.join(' ');
  }

  // Check if current breakpoint matches
  isBreakpoint(breakpoint) {
    return this.currentBreakpoint === breakpoint;
  }

  // Check if current breakpoint is above
  isAbove(breakpoint) {
    const order = ['xs', 'sm', 'md', 'lg', 'xl'];
    return order.indexOf(this.currentBreakpoint) > order.indexOf(breakpoint);
  }

  // Check if current breakpoint is below
  isBelow(breakpoint) {
    const order = ['xs', 'sm', 'md', 'lg', 'xl'];
    return order.indexOf(this.currentBreakpoint) < order.indexOf(breakpoint);
  }
}

// Responsive Grid Component
export class ResponsiveGrid {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      columns: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
      gap: 6,
      ...options
    };
    this.init();
  }

  init() {
    this.element.className = this.getGridClasses();
  }

  getGridClasses() {
    const baseClasses = 'grid';
    const gapClasses = `gap-${this.options.gap}`;
    const columnClasses = this.getColumnClasses();
    
    return `${baseClasses} ${gapClasses} ${columnClasses}`;
  }

  getColumnClasses() {
    const { columns } = this.options;
    const classes = [];
    
    if (columns.xs) classes.push(`grid-cols-${columns.xs}`);
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    return classes.join(' ');
  }

  updateColumns(columns) {
    this.options.columns = { ...this.options.columns, ...columns };
    this.element.className = this.getGridClasses();
  }
}

// Responsive Container Component
export class ResponsiveContainer {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      maxWidth: { xs: 'full', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' },
      padding: { xs: 4, sm: 6, md: 8, lg: 10, xl: 12 },
      ...options
    };
    this.init();
  }

  init() {
    this.element.className = this.getContainerClasses();
  }

  getContainerClasses() {
    const baseClasses = 'mx-auto';
    const maxWidthClasses = this.getMaxWidthClasses();
    const paddingClasses = this.getPaddingClasses();
    
    return `${baseClasses} ${maxWidthClasses} ${paddingClasses}`;
  }

  getMaxWidthClasses() {
    const { maxWidth } = this.options;
    const classes = [];
    
    if (maxWidth.xs) classes.push(`max-w-${maxWidth.xs}`);
    if (maxWidth.sm) classes.push(`sm:max-w-${maxWidth.sm}`);
    if (maxWidth.md) classes.push(`md:max-w-${maxWidth.md}`);
    if (maxWidth.lg) classes.push(`lg:max-w-${maxWidth.lg}`);
    if (maxWidth.xl) classes.push(`xl:max-w-${maxWidth.xl}`);
    
    return classes.join(' ');
  }

  getPaddingClasses() {
    const { padding } = this.options;
    const classes = [];
    
    if (padding.xs) classes.push(`px-${padding.xs}`);
    if (padding.sm) classes.push(`sm:px-${padding.sm}`);
    if (padding.md) classes.push(`md:px-${padding.md}`);
    if (padding.lg) classes.push(`lg:px-${padding.lg}`);
    if (padding.xl) classes.push(`xl:px-${padding.xl}`);
    
    return classes.join(' ');
  }
}

// Responsive Typography Component
export class ResponsiveTypography {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      fontSize: { xs: 'base', sm: 'lg', md: 'xl', lg: '2xl', xl: '3xl' },
      fontWeight: 'normal',
      textColor: 'white',
      ...options
    };
    this.init();
  }

  init() {
    this.element.className = this.getTypographyClasses();
  }

  getTypographyClasses() {
    const baseClasses = 'font-sans';
    const fontSizeClasses = this.getFontSizeClasses();
    const fontWeightClasses = `font-${this.options.fontWeight}`;
    const textColorClasses = `text-${this.options.textColor}`;
    
    return `${baseClasses} ${fontSizeClasses} ${fontWeightClasses} ${textColorClasses}`;
  }

  getFontSizeClasses() {
    const { fontSize } = this.options;
    const classes = [];
    
    if (fontSize.xs) classes.push(`text-${fontSize.xs}`);
    if (fontSize.sm) classes.push(`sm:text-${fontSize.sm}`);
    if (fontSize.md) classes.push(`md:text-${fontSize.md}`);
    if (fontSize.lg) classes.push(`lg:text-${fontSize.lg}`);
    if (fontSize.xl) classes.push(`xl:text-${fontSize.xl}`);
    
    return classes.join(' ');
  }
}

// Export all responsive components
export default {
  ResponsiveFramework,
  ResponsiveGrid,
  ResponsiveContainer,
  ResponsiveTypography
};
