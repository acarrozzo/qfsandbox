/**
 * QuickFrame Design System Components
 * Based on @mntn-dev/ui-components patterns
 */

// Design Tokens
export const designTokens = {
  colors: {
    brand: '#1AC9AA',
    primary: '#181F25',
    secondary: '#0F1419',
    tertiary: '#575A5C',
    light: '#8B8F91',
    white: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.20)',
    glassContainer: 'rgba(87, 90, 92, 0.20)',
  },
  typography: {
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  glassMorphism: {
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    background: 'radial-gradient(162.34% 115.1% at 70.34% 91.1%, rgba(26, 201, 170, 0.06) 0%, rgba(24, 31, 37, 0.00) 62.23%), rgba(87, 90, 92, 0.20)',
    backdropFilter: 'blur(20px)',
  }
};

// Component Classes
export const componentClasses = {
  // Glass Container
  glassContainer: `
    rounded-lg
    border
    border-white/20
    bg-gradient-to-br
    from-qf-green/6
    via-transparent
    to-qf-gray/20
    backdrop-blur-xl
    shadow-lg
  `,
  
  // Buttons
  button: {
    primary: `
      bg-qf-green
      text-white
      px-4
      py-2
      rounded-lg
      font-medium
      hover:bg-qf-green/90
      transition-colors
      focus:outline-none
      focus:ring-2
      focus:ring-qf-green/50
    `,
    secondary: `
      bg-white/10
      text-white
      px-4
      py-2
      rounded-lg
      font-medium
      hover:bg-white/20
      transition-colors
      focus:outline-none
      focus:ring-2
      focus:ring-white/50
    `,
    ghost: `
      text-qf-light-gray
      px-4
      py-2
      rounded-lg
      font-medium
      hover:text-white
      hover:bg-white/10
      transition-colors
      focus:outline-none
    `
  },
  
  // Form Elements
  input: `
    w-full
    px-3
    py-2
    bg-white/10
    border
    border-white/20
    rounded-lg
    text-white
    placeholder-qf-light-gray
    focus:outline-none
    focus:ring-2
    focus:ring-qf-green/50
    focus:border-qf-green
  `,
  
  // Cards
  card: `
    glass-container
    p-6
    rounded-lg
    transition-all
    duration-300
    hover:transform
    hover:-translate-y-1
    hover:shadow-xl
  `,
  
  // Typography
  heading: {
    h1: 'text-4xl font-bold text-white',
    h2: 'text-3xl font-bold text-white',
    h3: 'text-2xl font-semibold text-white',
    h4: 'text-xl font-semibold text-white',
    h5: 'text-lg font-medium text-white',
    h6: 'text-base font-medium text-white',
  },
  
  text: {
    primary: 'text-white',
    secondary: 'text-qf-light-gray',
    tertiary: 'text-qf-gray',
    brand: 'text-qf-green',
  }
};

// Layout Components
export const layoutComponents = {
  // Three Column Layout (based on your ThreeColumn component)
  threeColumn: `
    grid
    grid-cols-10
    gap-8
    h-screen-minus-64
  `,
  
  threeColumnMain: `
    col-span-4
    sticky
    h-screen-minus-64
    grow
  `,
  
  threeColumnAside: `
    col-span-3
    sticky
    h-screen-minus-64
  `,
  
  // Navigation
  sidebar: `
    fixed
    top-0
    left-0
    h-full
    w-18
    glass-container
    z-50
  `,
  
  // Content
  contentWrapper: `
    ml-18
    min-h-screen
    p-8
  `
};

// Utility Functions
export const utils = {
  // Generate responsive classes
  responsive: (base, sm, md, lg, xl) => {
    return `${base} ${sm ? `sm:${sm}` : ''} ${md ? `md:${md}` : ''} ${lg ? `lg:${lg}` : ''} ${xl ? `xl:${xl}` : ''}`.trim();
  },
  
  // Generate glass morphism styles
  glass: (opacity = 0.2) => `
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, ${opacity});
    background: radial-gradient(162.34% 115.1% at 70.34% 91.1%, rgba(26, 201, 170, 0.06) 0%, rgba(24, 31, 37, 0.00) 62.23%), rgba(87, 90, 92, ${opacity});
    backdrop-filter: blur(20px);
  `,
  
  // Generate component variants
  variant: (base, variants) => {
    return Object.entries(variants).reduce((acc, [key, value]) => {
      acc[key] = `${base} ${value}`;
      return acc;
    }, {});
  }
};

// Export all components
export default {
  designTokens,
  componentClasses,
  layoutComponents,
  utils
};
