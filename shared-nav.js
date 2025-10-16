/**
 * QuickFrame Shared Navigation Component
 * DRY navigation system for all pages
 */

export class SharedNavigation {
    constructor(currentPage = 'index') {
        this.currentPage = currentPage;
        this.navItems = [
            { id: 'index', icon: 'th-large', title: 'Table of Contents', href: 'index.html' },
            { id: 'dashboard', icon: 'chart-line', title: 'Dashboard', href: 'dashboard.html' },
            { id: 'profile', icon: 'user', title: 'User Profile', href: 'profile.html' },
            { id: 'analytics', icon: 'chart-bar', title: 'Analytics', href: '#' },
            { id: 'settings', icon: 'cog', title: 'Settings', href: '#' },
            { id: 'notifications', icon: 'bell', title: 'Notifications', href: '#' },
            { id: 'projects', icon: 'folder', title: 'Projects', href: '#' },
            { id: 'team', icon: 'users', title: 'Team', href: '#' },
            { id: 'billing', icon: 'credit-card', title: 'Billing', href: '#' },
            { id: 'help', icon: 'question-circle', title: 'Help Center', href: '#' },
            { id: 'onboarding', icon: 'rocket', title: 'Onboarding', href: '#' },
            { id: 'package-selection', icon: 'box', title: 'Package', href: 'package-selection.html' },
            { id: 'service', icon: 'flask', title: 'Service', href: 'service.html' }
        ];
    }

    render() {
        return `
            <!-- Desktop Navigation -->
            <nav class="hidden md:flex fixed top-0 left-0 h-full w-18 glass-container z-50" style="width: 72px;">
                <div class="flex flex-col items-center py-6 h-full">
                    <!-- QF Logo -->
                    <a href="index.html" class="text-3xl font-bold text-white mb-8 hover:text-qf-green transition-colors">
                        QF
                    </a>
                    
                    <!-- Navigation Items -->
                    <div class="flex flex-col space-y-4">
                        ${this.navItems.map(item => `
                            <a href="${item.href}" 
                               class="p-3 rounded-lg transition-colors ${this.getNavItemClasses(item)}" 
                               title="${item.title}">
                                <i class="fas fa-${item.icon}"></i>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </nav>

            <!-- Mobile Bottom Navigation -->
            <nav class="md:hidden fixed bottom-0 left-0 right-0 glass-container z-50 mobile-nav">
                <div class="flex items-center justify-around py-3 px-4">
                    ${this.navItems.slice(0, 5).map(item => `
                        <a href="${item.href}" 
                           class="mobile-nav-item flex flex-col items-center p-2 rounded-lg transition-colors ${this.getNavItemClasses(item)}" 
                           title="${item.title}">
                            <i class="fas fa-${item.icon} text-lg mb-1"></i>
                            <span class="mobile-nav-text text-xs">${item.title.split(' ')[0]}</span>
                        </a>
                    `).join('')}
                </div>
            </nav>
        `;
    }

    // Render page header component
    renderPageHeader(title, subtitle = '', showBackButton = true) {
        return `
            <div class="mb-8">
                <div class="flex items-center gap-4 mb-4">
                    ${showBackButton ? `
                        <button class="text-white text-lg cursor-pointer transition-colors duration-300 hover:text-qf-green" aria-label="Go back">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <div class="w-px h-6 bg-white"></div>
                    ` : ''}
                    <div>
                        <h1 class="text-2xl font-bold">${title}</h1>
                        ${subtitle ? `<p class="text-qf-light-gray text-base">${subtitle}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    getNavItemClasses(item) {
        if (item.id === this.currentPage) {
            return 'bg-qf-green/20 text-qf-green';
        }
        
        // Special handling for non-existent pages
        if (item.href === '#') {
            return 'text-qf-light-gray opacity-50 cursor-not-allowed';
        }
        
        return 'text-qf-light-gray hover:text-white hover:bg-white/10';
    }

    // Method to update navigation for a specific page
    static updateNavigation(currentPage) {
        const nav = new SharedNavigation(currentPage);
        const navElement = document.querySelector('nav');
        if (navElement) {
            navElement.outerHTML = nav.render();
        }
    }
}

// Auto-initialize navigation based on current page
document.addEventListener('DOMContentLoaded', () => {
    // Determine current page from URL
    const currentPath = window.location.pathname;
    let currentPage = 'index';
    
    if (currentPath.includes('dashboard')) currentPage = 'dashboard';
    else if (currentPath.includes('profile')) currentPage = 'profile';
    else if (currentPath.includes('package-selection')) currentPage = 'package-selection';
    else if (currentPath.includes('service')) currentPage = 'service';
    
    // Update navigation
    SharedNavigation.updateNavigation(currentPage);
});
