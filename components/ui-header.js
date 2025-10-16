/**
 * UI Header Component
 * Renders a shared page header with optional action buttons
 */

export function renderPageHeader(options = {}) {
    const {
        title = '',
        subtitle = '',
        showBack = true,
        buttons = [] // [{ label, classes, href, onClick }]
    } = options;

    const backButtonHtml = showBack ? `
                <button class="text-white text-lg cursor-pointer transition-colors duration-300 hover:text-qf-green" aria-label="Go back">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="w-px h-6 bg-white"></div>
    ` : '';

    const actionsHtml = buttons.length > 0 ? `
            <div class="flex gap-3">
                ${buttons.map(btn => {
                    const content = btn.href
                        ? `<a href="${btn.href}" class="${btn.classes}">${btn.label}</a>`
                        : `<button class="${btn.classes}">${btn.label}</button>`;
                    return content;
                }).join('')}
            </div>
    ` : '';

    return `
        <div class="mb-8">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 mb-4">
${backButtonHtml}
                    <div>
                        <h1 class="text-3xl font-bold mb-2">${title}</h1>
                        ${subtitle ? `<p class=\"text-qf-light-gray text-xs\">${subtitle}</p>` : ''}
                    </div>
                </div>
                ${actionsHtml}
            </div>
        </div>
    `;
}


