/**
 * QuickFrame Layout Components
 * Based on your ThreeColumn and layout patterns
 */

import { layoutComponents, componentClasses } from './design-system.js';

// Three Column Layout Component
export class ThreeColumn {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      mainSpan: 4,
      asideSpan: 3,
      gap: 8,
      ...options
    };
    this.init();
  }

  init() {
    this.element.className = layoutComponents.threeColumn;
    this.createStructure();
  }

  createStructure() {
    this.element.innerHTML = `
      <div class="grid grid-cols-10 gap-8 h-screen-minus-64">
        <aside class="col-span-${this.options.asideSpan} sticky h-screen-minus-64" data-role="aside">
          <!-- Aside content will be inserted here -->
        </aside>
        <main class="col-span-${this.options.mainSpan} sticky h-screen-minus-64 grow" data-role="main">
          <!-- Main content will be inserted here -->
        </main>
      </div>
    `;
  }

  getAside() {
    return this.element.querySelector('[data-role="aside"]');
  }

  getMain() {
    return this.element.querySelector('[data-role="main"]');
  }
}

// Sidebar Navigation Component
export class SidebarNav {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      width: '72px',
      logo: 'QF',
      items: [],
      ...options
    };
    this.init();
  }

  init() {
    this.element.className = layoutComponents.sidebar;
    this.element.style.width = this.options.width;
    this.createStructure();
    this.setupEventListeners();
  }

  createStructure() {
    this.element.innerHTML = `
      <div class="flex flex-col items-center py-6 h-full">
        <div class="text-2xl font-bold text-white mb-8 cursor-pointer" data-role="logo">
          ${this.options.logo}
        </div>
        <nav class="flex flex-col space-y-4" data-role="nav">
          ${this.options.items.map(item => `
            <a href="${item.href}" 
               class="p-3 rounded-lg text-qf-light-gray hover:text-white hover:bg-white/10 transition-colors ${item.active ? 'bg-qf-green/20 text-qf-green' : ''}"
               title="${item.title}"
               data-role="nav-item">
              <i class="fas fa-${item.icon}"></i>
            </a>
          `).join('')}
        </nav>
      </div>
    `;
  }

  setupEventListeners() {
    // Logo click handler
    const logo = this.element.querySelector('[data-role="logo"]');
    if (logo) {
      logo.addEventListener('click', () => {
        this.options.onLogoClick?.();
      });
    }

    // Navigation item handlers
    const navItems = this.element.querySelectorAll('[data-role="nav-item"]');
    navItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.options.items[index].onClick?.(e);
        this.setActiveItem(index);
      });
    });
  }

  setActiveItem(index) {
    const navItems = this.element.querySelectorAll('[data-role="nav-item"]');
    navItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('bg-qf-green/20', 'text-qf-green');
        item.classList.remove('text-qf-light-gray');
      } else {
        item.classList.remove('bg-qf-green/20', 'text-qf-green');
        item.classList.add('text-qf-light-gray');
      }
    });
  }

  addItem(item) {
    this.options.items.push(item);
    this.createStructure();
    this.setupEventListeners();
  }

  removeItem(index) {
    this.options.items.splice(index, 1);
    this.createStructure();
    this.setupEventListeners();
  }
}

// Content Wrapper Component
export class ContentWrapper {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      sidebarWidth: '72px',
      padding: 'p-8',
      ...options
    };
    this.init();
  }

  init() {
    this.element.className = layoutComponents.contentWrapper;
    this.element.style.marginLeft = this.options.sidebarWidth;
    this.element.style.padding = this.options.padding.replace('p-', '').replace('p', '') + 'rem';
  }
}

// Grid Layout Component
export class GridLayout {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      columns: 1,
      gap: 6,
      responsive: true,
      ...options
    };
    this.init();
  }

  init() {
    this.element.className = this.getGridClasses();
  }

  getGridClasses() {
    const baseClasses = 'grid';
    const columnClasses = this.getColumnClasses();
    const gapClasses = `gap-${this.options.gap}`;
    
    return `${baseClasses} ${columnClasses} ${gapClasses}`;
  }

  getColumnClasses() {
    if (this.options.responsive) {
      return `
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-${this.options.columns}
      `;
    }
    return `grid-cols-${this.options.columns}`;
  }
}

// Modal Component
export class Modal {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      title: '',
      content: '',
      size: 'md',
      closable: true,
      ...options
    };
    this.init();
  }

  init() {
    this.element.className = 'fixed inset-0 z-50 flex items-center justify-center';
    this.element.style.display = 'none';
    this.createStructure();
    this.setupEventListeners();
  }

  createStructure() {
    this.element.innerHTML = `
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" data-role="backdrop"></div>
      <div class="relative glass-container p-6 rounded-lg max-w-${this.options.size} w-full mx-4" data-role="modal">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-white">${this.options.title}</h3>
          ${this.options.closable ? '<button class="text-qf-light-gray hover:text-white" data-role="close">×</button>' : ''}
        </div>
        <div data-role="content">
          ${this.options.content}
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const closeBtn = this.element.querySelector('[data-role="close"]');
    const backdrop = this.element.querySelector('[data-role="backdrop"]');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }
    
    if (backdrop) {
      backdrop.addEventListener('click', () => this.hide());
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hide();
      }
    });
  }

  show() {
    this.element.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.element.style.display = 'none';
    document.body.style.overflow = '';
  }

  setContent(content) {
    const contentEl = this.element.querySelector('[data-role="content"]');
    if (contentEl) {
      contentEl.innerHTML = content;
    }
  }
}

// Two Column Layout Component with Auto-Sticky Detection
export class TwoColumnLayout {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      leftSpan: 4,
      rightSpan: 6,
      gap: 6,
      headerHeight: 0,
      footerHeight: 0,
      ...options
    };
    this.leftColumn = null;
    this.rightColumn = null;
    this.stickyColumn = null;
    this.init();
  }

  init() {
    this.createStructure();
    this.setupStickyDetection();
    this.setupResizeListener();
  }

  createStructure() {
    this.element.className = `grid grid-cols-1 lg:grid-cols-10 gap-${this.options.gap} h-full`;
    this.element.innerHTML = `
      <aside id="two-col-left" class="col-span-1 lg:col-span-${this.options.leftSpan} overflow-y-auto" data-role="left-column">
        <!-- Left column content -->
      </aside>
      <main id="two-col-right" class="col-span-1 lg:col-span-${this.options.rightSpan} overflow-y-auto" data-role="right-column">
        <!-- Right column content -->
      </main>
    `;
    
    this.leftColumn = document.getElementById('two-col-left');
    this.rightColumn = document.getElementById('two-col-right');
  }

  setupStickyDetection() {
    // Wait for content to be loaded
    setTimeout(() => {
      this.detectAndApplySticky();
    }, 100);
  }

  detectAndApplySticky() {
    if (!this.leftColumn || !this.rightColumn) return;

    // Reset sticky positioning
    this.leftColumn.style.position = '';
    this.leftColumn.style.top = '';
    this.rightColumn.style.position = '';
    this.rightColumn.style.top = '';

    // Get actual content heights
    const leftHeight = this.leftColumn.scrollHeight;
    const rightHeight = this.rightColumn.scrollHeight;
    
    // Get viewport height minus header/footer
    const viewportHeight = window.innerHeight - this.options.headerHeight - this.options.footerHeight;
    
    // Only apply sticky if content is shorter than viewport
    if (leftHeight < viewportHeight && rightHeight < viewportHeight) {
      // Both fit, make shorter one sticky
      if (leftHeight < rightHeight) {
        this.applySticky(this.leftColumn);
        this.stickyColumn = 'left';
      } else {
        this.applySticky(this.rightColumn);
        this.stickyColumn = 'right';
      }
    } else if (leftHeight < viewportHeight) {
      // Only left fits
      this.applySticky(this.leftColumn);
      this.stickyColumn = 'left';
    } else if (rightHeight < viewportHeight) {
      // Only right fits
      this.applySticky(this.rightColumn);
      this.stickyColumn = 'right';
    } else {
      // Neither fits, no sticky
      this.stickyColumn = null;
    }
  }

  applySticky(column) {
    column.style.position = 'sticky';
    column.style.top = `${this.options.headerHeight}px`;
    column.style.alignSelf = 'flex-start';
  }

  setupResizeListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.detectAndApplySticky();
      }, 150);
    });
  }

  getLeftColumn() {
    return this.leftColumn;
  }

  getRightColumn() {
    return this.rightColumn;
  }

  setLeftContent(html) {
    if (this.leftColumn) {
      this.leftColumn.innerHTML = html;
      this.detectAndApplySticky();
    }
  }

  setRightContent(html) {
    if (this.rightColumn) {
      this.rightColumn.innerHTML = html;
      this.detectAndApplySticky();
    }
  }
}

// Mobile Overlay Sidebar Component
export class MobileOverlaySidebar {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      width: '320px',
      ...options
    };
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createStructure();
    this.setupEventListeners();
  }

  createStructure() {
    this.element.className = 'fixed inset-0 z-50 lg:hidden';
    this.element.style.display = 'none';
    this.element.innerHTML = `
      <div class="mobile-sidebar-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm" data-role="backdrop"></div>
      <aside class="mobile-sidebar fixed top-0 left-0 h-full bg-qf-dark overflow-y-auto" 
             style="width: ${this.options.width}; transform: translateX(-100%); transition: transform 0.3s ease-in-out; border-right: 1px solid rgba(255, 255, 255, 0.20); background: radial-gradient(162.34% 115.1% at 70.34% 91.1%, rgba(26, 201, 170, 0.06) 0%, rgba(24, 31, 37, 0.00) 62.23%), rgba(87, 90, 92, 0.20); backdrop-filter: blur(20px);" 
             data-role="sidebar">
        <!-- Sidebar content -->
      </aside>
    `;
    
    this.backdrop = this.element.querySelector('[data-role="backdrop"]');
    this.sidebar = this.element.querySelector('[data-role="sidebar"]');
  }

  setupEventListeners() {
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.element.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    setTimeout(() => {
      if (this.sidebar) {
        this.sidebar.style.transform = 'translateX(0)';
      }
    }, 10);
  }

  close() {
    this.isOpen = false;
    if (this.sidebar) {
      this.sidebar.style.transform = 'translateX(-100%)';
    }
    
    setTimeout(() => {
      this.element.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  setContent(html) {
    if (this.sidebar) {
      this.sidebar.innerHTML = html;
    }
  }
}

// Export all layout components
export default {
  ThreeColumn,
  SidebarNav,
  ContentWrapper,
  GridLayout,
  Modal,
  TwoColumnLayout,
  MobileOverlaySidebar
};
