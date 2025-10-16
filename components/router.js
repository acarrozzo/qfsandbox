/**
 * QuickFrame Client-Side Router
 * Simple routing system for the prototype app
 */

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.init();
  }

  init() {
    // Listen for navigation events
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });

    // Handle initial route
    this.handleRoute();
  }

  // Register a route
  route(path, handler) {
    this.routes.set(path, handler);
  }

  // Navigate to a route
  navigate(path, data = {}) {
    if (this.routes.has(path)) {
      this.currentRoute = path;
      history.pushState(data, '', path);
      this.handleRoute();
    } else {
      console.warn(`Route ${path} not found`);
    }
  }

  // Handle route changes
  handleRoute() {
    const path = window.location.pathname;
    const route = this.routes.get(path);
    
    if (route) {
      this.currentRoute = path;
      route();
    } else {
      // Default to TOC if route not found
      this.navigate('/toc');
    }
  }

  // Get current route
  getCurrentRoute() {
    return this.currentRoute;
  }

  // Get route data
  getRouteData() {
    return history.state || {};
  }
}

// Page Manager for handling different page types
export class PageManager {
  constructor() {
    this.pages = new Map();
    this.currentPage = null;
  }

  // Register a page
  registerPage(name, pageData) {
    this.pages.set(name, pageData);
  }

  // Load a page
  async loadPage(name, container) {
    const pageData = this.pages.get(name);
    
    if (!pageData) {
      console.warn(`Page ${name} not found`);
      return;
    }

    this.currentPage = name;
    
    // Show loading state
    container.innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent border-qf-green"></div>
      </div>
    `;

    try {
      // Load page content
      const content = await this.renderPage(pageData);
      container.innerHTML = content;
      
      // Initialize page-specific functionality
      if (pageData.onLoad) {
        pageData.onLoad(container);
      }
    } catch (error) {
      console.error(`Error loading page ${name}:`, error);
      container.innerHTML = `
        <div class="text-center p-8">
          <h3 class="text-xl font-semibold text-white mb-2">Error Loading Page</h3>
          <p class="text-qf-light-gray">Something went wrong while loading this page.</p>
        </div>
      `;
    }
  }

  // Render page content
  async renderPage(pageData) {
    if (typeof pageData.template === 'function') {
      return await pageData.template();
    }
    
    if (typeof pageData.template === 'string') {
      return pageData.template;
    }
    
    return pageData.template;
  }

  // Get current page
  getCurrentPage() {
    return this.currentPage;
  }

  // Get all pages
  getAllPages() {
    return Array.from(this.pages.keys());
  }
}

// Navigation Helper
export class NavigationHelper {
  constructor(router, pageManager) {
    this.router = router;
    this.pageManager = pageManager;
  }

  // Navigate to a page
  async navigateToPage(pageName, container) {
    // Update URL
    this.router.navigate(`/${pageName}`);
    
    // Load page content
    await this.pageManager.loadPage(pageName, container);
  }

  // Setup navigation
  setupNavigation(navItems, container) {
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToPage(item.dataset.page, container);
      });
    });
  }
}

// Export all routing components
export default {
  Router,
  PageManager,
  NavigationHelper
};
