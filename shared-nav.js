/**
 * Shared Navigation Component
 * DRY navigation system for all pages
 */

class SharedNavigation {
    /**
     * Render desktop sidebar navigation
     * @param {string} activePage - Currently active page identifier
     */
    static renderDesktopNav(activePage = '') {
        const navItems = [
            { id: 'index', href: 'index.html', icon: 'fas fa-th-large', title: 'Table of Contents' },
            { id: 'dashboard', href: 'dashboard.html', icon: 'fas fa-chart-line', title: 'Dashboard' },
            { id: 'package-selection', href: 'package-selection.html', icon: 'fas fa-box', title: 'Package Selection' },
            { id: 'service', href: 'service.html', icon: 'fas fa-flask', title: 'Service Prototype' },
            { id: 'project-draft', href: 'project-draft.html', icon: 'fas fa-file-alt', title: 'Project Draft' }
        ];

        const navItemsHtml = navItems.map(item => {
            const isActive = item.id === activePage;
            const activeClasses = isActive ? 'bg-qf-green/20 text-qf-green' : 'text-qf-light-gray hover:text-white hover:bg-white/10 transition-colors';
            
            return `
                <div class="relative group">
                    <a href="${item.href}" class="p-3 rounded-lg ${activeClasses} block" title="${item.title}">
                        <i class="${item.icon}"></i>
                    </a>
                    <!-- Tooltip -->
                    <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-qf-dark text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-0 pointer-events-none whitespace-nowrap z-50">
                        ${item.title}
                        <!-- Tooltip arrow -->
                        <div class="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-qf-dark"></div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <nav class="fixed top-0 left-0 h-full z-50 hidden md:block" style="width: 72px; border-right: 1px solid rgba(255, 255, 255, 0.20); background: radial-gradient(162.34% 115.1% at 70.34% 91.1%, rgba(26, 201, 170, 0.06) 0%, rgba(24, 31, 37, 0.00) 62.23%), rgba(87, 90, 92, 0.20); backdrop-filter: blur(20px);">
                <div class="flex flex-col items-center py-6 h-full">
                    <!-- QF Logo -->
                    <a href="index.html" class="text-2xl font-bold text-white mb-8 hover:text-qf-green transition-colors">
                        QF
                    </a>
                    
                    <!-- Navigation Items -->
                    <div class="flex flex-col space-y-4">
                        ${navItemsHtml}
                    </div>
                </div>
            </nav>
        `;
    }

    /**
     * Render mobile bottom navigation
     * @param {string} activePage - Currently active page identifier
     */
    static renderMobileNav(activePage = '') {
        const navItems = [
            { id: 'index', href: 'index.html', icon: 'fas fa-th-large', title: 'Table of Contents', label: 'Table' },
            { id: 'dashboard', href: 'dashboard.html', icon: 'fas fa-chart-line', title: 'Dashboard', label: 'Dashboard' },
            { id: 'package-selection', href: 'package-selection.html', icon: 'fas fa-box', title: 'Package Selection', label: 'Package' },
            { id: 'service', href: 'service.html', icon: 'fas fa-flask', title: 'Service Prototype', label: 'Service' },
            { id: 'project-draft', href: 'project-draft.html', icon: 'fas fa-file-alt', title: 'Project Draft', label: 'Draft' }
        ];

        const navItemsHtml = navItems.map(item => {
            const isActive = item.id === activePage;
            const activeClasses = isActive ? 'bg-qf-green/20 text-qf-green' : 'text-qf-light-gray hover:text-white hover:bg-white/10 transition-colors';
            
            return `
                <a href="${item.href}" class="flex flex-col items-center p-2 rounded-lg ${activeClasses}" title="${item.title}">
                    <i class="${item.icon} text-lg mb-1"></i>
                    <span class="text-xs">${item.label}</span>
                </a>
            `;
        }).join('');

        return `
            <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50" style="border-top: 1px solid rgba(255, 255, 255, 0.20); background: radial-gradient(162.34% 115.1% at 70.34% 91.1%, rgba(26, 201, 170, 0.06) 0%, rgba(24, 31, 37, 0.00) 62.23%), rgba(87, 90, 92, 0.20); backdrop-filter: blur(20px);">
                <div class="flex items-center justify-around py-3 px-4">
                    ${navItemsHtml}
                </div>
            </nav>
        `;
    }

    /**
     * Render both desktop and mobile navigation
     * @param {string} activePage - Currently active page identifier
     */
    static render(activePage = '') {
        return this.renderDesktopNav(activePage) + this.renderMobileNav(activePage);
    }
}

// Expose globally for non-module inline scripts
if (typeof window !== 'undefined') {
    window.SharedNavigation = SharedNavigation;
}