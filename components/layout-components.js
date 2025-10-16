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

// Export all layout components
export default {
  ThreeColumn,
  SidebarNav,
  ContentWrapper,
  GridLayout,
  Modal
};
