/**
 * QuickFrame Shared UI Components
 * DRY component system for consistent UI elements
 */

class UIComponents {
    /**
     * Primary Button Component
     * @param {string} text - Button text
     * @param {Object} options - Button options
     * @param {string} options.icon - FontAwesome icon class
     * @param {string} options.size - Button size (sm, md, lg)
     * @param {boolean} options.disabled - Disabled state
     * @param {string} options.className - Additional CSS classes
     * @param {Function} options.onClick - Click handler
     */
    static primaryButton(text, options = {}) {
        const {
            icon = '',
            size = 'md',
            disabled = false,
            className = '',
            onClick = null,
            iconPosition = 'left'
        } = options;

        const sizeClasses = {
            xs: 'px-3 py-1.5 text-xs h-8',
            sm: 'px-4 py-2 text-sm h-10',
            md: 'px-6 py-3 text-base h-12',
            lg: 'px-8 py-4 text-lg h-14'
        };

        let iconHtml = '';
        if (icon) {
            if (iconPosition === 'right') {
                iconHtml = `<i class="${icon} ml-2 flex items-center"></i>`;
            } else {
                iconHtml = `<i class="${icon} mr-2 flex items-center"></i>`;
            }
        }

        const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-qf-green/80';
        const clickHandler = onClick ? `onclick="${onClick}"` : '';
        const content = iconPosition === 'right' ? `${text}${iconHtml}` : `${iconHtml}${text}`;

        return `
            <button class="bg-qf-green text-black font-medium transition-colors rounded ${sizeClasses[size]} ${disabledClass} ${className} flex items-center backdrop-blur-[12px]" ${clickHandler}>
                ${content}
            </button>
        `;
    }

    /**
     * Secondary Button Component (glass style)
     * @param {string} text - Button text
     * @param {Object} options - Button options
     * @param {string} options.icon - FontAwesome icon class
     * @param {string} options.size - Button size (sm, md, lg)
     * @param {boolean} options.disabled - Disabled state
     * @param {string} options.className - Additional CSS classes
     * @param {Function} options.onClick - Click handler
     */
    static secondaryButton(text, options = {}) {
        const {
            icon = '',
            size = 'md',
            disabled = false,
            className = '',
            onClick = null,
            iconPosition = 'left'
        } = options;

        const sizeClasses = {
            xs: 'px-3 py-1.5 text-xs h-8',
            sm: 'px-4 py-2 text-sm h-10',
            md: 'px-6 py-3 text-base h-12',
            lg: 'px-8 py-4 text-lg h-14'
        };

        let iconHtml = '';
        if (icon) {
            if (iconPosition === 'right') {
                iconHtml = `<i class="${icon} ml-2 flex items-center"></i>`;
            } else {
                iconHtml = `<i class="${icon} mr-2 flex items-center"></i>`;
            }
        }

        const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20';
        const clickHandler = onClick ? `onclick="${onClick}"` : '';
        const content = iconPosition === 'right' ? `${text}${iconHtml}` : `${iconHtml}${text}`;

        return `
            <button class="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors rounded backdrop-blur-[12px] ${sizeClasses[size]} ${disabledClass} ${className} flex items-center" ${clickHandler}>
                ${content}
            </button>
        `;
    }

    /**
     * Tertiary Button Component (text style)
     * @param {string} text - Button text
     * @param {Object} options - Button options
     * @param {string} options.icon - FontAwesome icon class
     * @param {string} options.size - Button size (sm, md, lg)
     * @param {boolean} options.disabled - Disabled state
     * @param {string} options.className - Additional CSS classes
     * @param {Function} options.onClick - Click handler
     */
    static tertiaryButton(text, options = {}) {
        const {
            icon = '',
            size = 'md',
            disabled = false,
            className = '',
            onClick = null,
            iconPosition = 'left'
        } = options;

        const sizeClasses = {
            xs: 'px-3 py-1.5 text-xs h-8',
            sm: 'px-4 py-2 text-sm h-10',
            md: 'px-6 py-3 text-base h-12',
            lg: 'px-8 py-4 text-lg h-14'
        };

        let iconHtml = '';
        if (icon) {
            if (iconPosition === 'right') {
                iconHtml = `<i class="${icon} ml-2 flex items-center"></i>`;
            } else {
                iconHtml = `<i class="${icon} mr-2 flex items-center"></i>`;
            }
        }

        const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10';
        const clickHandler = onClick ? `onclick="${onClick}"` : '';
        const content = iconPosition === 'right' ? `${text}${iconHtml}` : `${iconHtml}${text}`;

        return `
            <button class="bg-transparent hover:bg-white/10 text-white font-medium transition-colors rounded backdrop-blur-[12px] ${sizeClasses[size]} ${disabledClass} ${className} flex items-center" ${clickHandler}>
                ${content}
            </button>
        `;
    }

    /**
     * Ghost Button Component (pure text style)
     * No background by default; hover adds 10% white; no blur
     */
    static ghostButton(text, options = {}) {
        const {
            icon = '',
            size = 'md',
            disabled = false,
            className = '',
            onClick = null,
            iconPosition = 'left'
        } = options;

        const sizeClasses = {
            xs: 'px-3 py-1.5 text-xs h-8',
            sm: 'px-4 py-2 text-sm h-10',
            md: 'px-6 py-3 text-base h-12',
            lg: 'px-8 py-4 text-lg h-14'
        };

        let iconHtml = '';
        if (icon) {
            if (iconPosition === 'right') {
                iconHtml = `<i class="${icon} ml-2 flex items-center"></i>`;
            } else {
                iconHtml = `<i class="${icon} mr-2 flex items-center"></i>`;
            }
        }

        const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10';
        const clickHandler = onClick ? `onclick="${onClick}"` : '';
        const content = iconPosition === 'right' ? `${text}${iconHtml}` : `${iconHtml}${text}`;

        return `
            <button class="bg-transparent text-white font-medium transition-colors rounded ${sizeClasses[size]} ${disabledClass} ${className} flex items-center" ${clickHandler}>
                ${content}
            </button>
        `;
    }

    // Backwards compatibility alias (temporary)
    static textButton(text, options = {}) { return UIComponents.ghostButton(text, options); }

    /**
     * Input Component
     * @param {Object} options - Input options
     * @param {string} options.type - Input type (text, email, password, etc.)
     * @param {string} options.placeholder - Placeholder text
     * @param {string} options.value - Input value
     * @param {string} options.size - Input size (xs, sm, md, lg)
     * @param {string} options.className - Additional CSS classes
     * @param {Function} options.onChange - Change handler
     */
    static input(options = {}) {
        const {
            type = 'text',
            placeholder = '',
            value = '',
            size = 'sm',
            className = '',
            onChange = null
        } = options;

        const sizeClasses = {
            xs: 'px-3 py-1.5 text-xs h-8',
            sm: 'px-4 py-2 text-sm h-10',
            md: 'px-6 py-3 text-base h-12',
            lg: 'px-8 py-4 text-lg h-14'
        };

        const changeHandler = onChange ? `onchange="${onChange}"` : '';

        if (type === 'textarea') {
            return `
                <textarea placeholder="${placeholder}" 
                          class="w-full ${sizeClasses[size]} bg-white/10 border border-white/20 rounded backdrop-blur-[12px] text-white placeholder-qf-light-gray focus:border-qf-green focus:outline-none transition-colors resize-none ${className}"
                          ${changeHandler}>${value}</textarea>
            `;
        }

        return `
            <input type="${type}" 
                   placeholder="${placeholder}" 
                   value="${value}"
                   class="w-full ${sizeClasses[size]} bg-white/10 border border-white/20 rounded backdrop-blur-[12px] text-white placeholder-qf-light-gray focus:border-qf-green focus:outline-none transition-colors ${className}"
                   ${changeHandler}>
        `;
    }

    /**
     * Select Component
     * @param {Object} options - Select options
     * @param {Array} options.options - Array of option objects {value, label}
     * @param {string} options.value - Selected value
     * @param {string} options.size - Select size (xs, sm, md, lg)
     * @param {string} options.className - Additional CSS classes
     * @param {Function} options.onChange - Change handler
     */
    static select(options = {}) {
        const {
            options: selectOptions = [],
            value = '',
            size = 'sm',
            className = '',
            onChange = null
        } = options;

        const sizeClasses = {
            xs: 'px-3 py-1.5 text-xs h-8',
            sm: 'px-4 py-2 text-sm h-10',
            md: 'px-6 py-3 text-base h-12',
            lg: 'px-8 py-4 text-lg h-14'
        };

        const changeHandler = onChange ? `onchange="${onChange}"` : '';

        const optionsHtml = selectOptions.map(option => 
            `<option value="${option.value}" ${option.value === value ? 'selected' : ''}>${option.label}</option>`
        ).join('');

        return `
            <select class="w-full ${sizeClasses[size]} bg-white/10 border border-white/20 rounded backdrop-blur-[12px] text-white focus:border-qf-green focus:outline-none transition-colors ${className}" ${changeHandler}>
                ${optionsHtml}
            </select>
        `;
    }

    /**
     * Search Input Component
     * @param {Object} options - Input options
     * @param {string} options.placeholder - Placeholder text
     * @param {string} options.value - Input value
     * @param {string} options.size - Input size (xs, sm, md, lg)
     * @param {string} options.className - Additional CSS classes
     * @param {Function} options.onChange - Change handler
     */
    static searchInput(options = {}) {
        const {
            placeholder = 'Search',
            value = '',
            size = 'sm',
            className = '',
            onChange = null
        } = options;

        const sizeClasses = {
            xs: 'px-3 py-1.5 text-xs h-8',
            sm: 'px-4 py-2 text-sm h-10',
            md: 'px-6 py-3 text-base h-12',
            lg: 'px-8 py-4 text-lg h-14'
        };

        const changeHandler = onChange ? `onchange="${onChange}"` : '';

    return `
            <div class="relative ${className}">
                <input type="text" 
                       placeholder="${placeholder}" 
                       value="${value}"
                       class="w-full ${sizeClasses[size]} bg-white/10 border border-white/20 rounded backdrop-blur-[12px] text-white placeholder-qf-light-gray focus:border-qf-green focus:outline-none transition-colors"
                       ${changeHandler}>
                <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-qf-light-gray"></i>
      </div>
    `;
  }

    /**
     * Tab Navigation Component
     * @param {Array} tabs - Array of tab objects
     * @param {string} activeTab - Currently active tab
     * @param {Function} onTabClick - Tab click handler
     */
    static tabNavigation(tabs, activeTab, onTabClick = null) {
        return `
            <div class="flex flex-wrap gap-1">
                ${tabs.map(tab => {
                    const isActive = tab.id === activeTab;
                    const activeClasses = isActive ? 'text-white border-b-2 border-qf-green' : 'text-qf-light-gray hover:text-white';
                    const clickHandler = onTabClick ? `onclick="${onTabClick}('${tab.id}')"` : '';
                    
                    return `
                        <button class="px-4 py-2 text-sm font-medium transition-colors ${activeClasses}" ${clickHandler}>
                            ${tab.label}
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Dropdown Component
     * @param {Object} options - Dropdown options
     * @param {Array} options.items - Array of dropdown items {value, label, active}
     * @param {string} options.selectedValue - Currently selected value
     * @param {string} options.placeholder - Placeholder text
     * @param {string} options.size - Dropdown size (sm, md, lg)
     * @param {string} options.className - Additional CSS classes
     * @param {Function} options.onChange - Change handler
     * @param {string} options.id - Unique ID for the dropdown
     */
    static dropdown(options = {}) {
        const {
            items = [],
            selectedValue = '',
            placeholder = 'Select an option',
            size = 'sm',
            className = '',
            onChange = null,
            id = `dropdown-${Math.random().toString(36).substr(2, 9)}`
        } = options;

        const sizeClasses = {
            xs: 'px-3 py-1.5 text-xs h-8',
            sm: 'px-4 py-2 text-sm h-10',
            md: 'px-6 py-3 text-base h-12',
            lg: 'px-8 py-4 text-lg h-14'
        };

        const selectedItem = items.find(item => item.value === selectedValue);
        const displayText = selectedItem ? selectedItem.label : placeholder;

        const itemsHtml = items.map(item => {
            const isActive = item.value === selectedValue;
            const activeClasses = isActive ? 'text-white border-l-2 border-qf-green' : 'text-qf-light-gray hover:text-white';
            return `
                <button class="w-full px-4 py-2 text-sm font-medium text-left hover:bg-white/10 transition-colors ${activeClasses}" 
                        data-value="${item.value}" 
                        data-label="${item.label}">
                    ${item.label}
                </button>
            `;
        }).join('');

        return `
            <div class="relative ${className}" id="${id}-container">
                <button id="${id}-button" 
                        class="flex items-center justify-between w-full ${sizeClasses[size]} bg-white/10 border border-white/20 rounded backdrop-blur-[12px] text-white hover:bg-white/20 transition-colors">
                    <span id="${id}-text">${displayText}</span>
                    <i class="fas fa-chevron-down transition-transform duration-200" id="${id}-arrow"></i>
                </button>
                
                <div id="${id}-menu" 
                     class="absolute top-full left-0 right-0 mt-1 bg-qf-dark border border-white/20 rounded backdrop-blur-[12px] shadow-lg z-50 hidden">
                    ${itemsHtml}
                </div>
            </div>
        `;
    }

    /**
     * Section Header Component
     * @param {string} title - Section title
     * @param {string} subtitle - Section subtitle
     * @param {string} className - Additional CSS classes
     */
    static sectionHeader(title, subtitle = '', className = '') {
    return `
            <div class="mb-6 ${className}">
                <h2 class="text-xl font-bold text-white mb-2">${title}</h2>
                ${subtitle ? `<p class="text-qf-light-gray text-sm">${subtitle}</p>` : ''}
      </div>
        `;
    }

    /**
     * Initialize Dropdown Functionality
     * @param {string} dropdownId - The ID of the dropdown to initialize
     * @param {Function} onChange - Change handler function
     */
    static initializeDropdown(dropdownId, onChange = null) {
        const button = document.getElementById(`${dropdownId}-button`);
        const menu = document.getElementById(`${dropdownId}-menu`);
        const arrow = document.getElementById(`${dropdownId}-arrow`);
        const text = document.getElementById(`${dropdownId}-text`);
        
        if (!button || !menu || !arrow || !text) return;

        // Toggle dropdown
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !menu.classList.contains('hidden');
            
            if (isOpen) {
                menu.classList.add('hidden');
                arrow.classList.remove('rotate-180');
            } else {
                menu.classList.remove('hidden');
                arrow.classList.add('rotate-180');
            }
        });

        // Handle item selection
        const items = menu.querySelectorAll('button[data-value]');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const value = item.dataset.value;
                const label = item.dataset.label;
                
                // Update display text
                text.textContent = label;
                
                // Update active states
                items.forEach(i => {
                    i.classList.remove('text-white', 'border-l-2', 'border-qf-green');
                    i.classList.add('text-qf-light-gray');
                });
                item.classList.remove('text-qf-light-gray');
                item.classList.add('text-white', 'border-l-2', 'border-qf-green');
                
                // Close dropdown
                menu.classList.add('hidden');
                arrow.classList.remove('rotate-180');
                
                // Call onChange if provided
                if (onChange) {
                    onChange(value, label);
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const container = document.getElementById(`${dropdownId}-container`);
            if (container && !container.contains(e.target)) {
                menu.classList.add('hidden');
                arrow.classList.remove('rotate-180');
            }
        });
    }
}

// Expose globally for non-module inline scripts
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.UIComponents = UIComponents;
}