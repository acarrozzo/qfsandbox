// Tiptap Rich Text Editor
class TiptapEditor {
    constructor() {
        this.editor = null;
        this.init();
    }

    async init() {
        // Wait for Tiptap to be available
        if (typeof window.tiptap === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }

        try {
            // Use only basic extensions to avoid loading issues
            const extensions = [];
            
            // Try to add StarterKit if available
            try {
                if (window.tiptap.StarterKit) {
                    extensions.push(window.tiptap.StarterKit);
                }
            } catch (e) {
                console.warn('StarterKit not available, using basic editor');
            }

            // Initialize Tiptap editor with minimal setup
            this.editor = new window.tiptap.Editor({
                element: document.querySelector('#tiptap-editor'),
                extensions: extensions,
                content: '<p>Please provide your concepting ideas</p>',
                editorProps: {
                    attributes: {
                        class: 'prose prose-invert max-w-none focus:outline-none',
                        style: 'min-height: 12rem;',
                    },
                },
                onUpdate: ({ editor }) => {
                    // Handle content updates
                    console.log('Content updated:', editor.getHTML());
                },
            });

            this.setupToolbar();
        } catch (error) {
            console.error('Failed to initialize Tiptap:', error);
            // Fallback to basic editor
            this.setupFallbackEditor();
        }
    }

    setupToolbar() {
        if (!this.editor) return;

        // Heading select
        const headingSelect = document.getElementById('heading-select');
        if (headingSelect) {
            headingSelect.addEventListener('change', (e) => {
                const level = e.target.value;
                if (level === 'paragraph') {
                    this.editor.chain().focus().setParagraph().run();
                } else {
                    this.editor.chain().focus().toggleHeading({ level: parseInt(level.replace('heading', '')) }).run();
                }
            });
        }

        // Toolbar buttons with error handling
        const buttons = {
            'bullet-list': () => {
                try {
                    this.editor.chain().focus().toggleBulletList().run();
                } catch (e) {
                    console.warn('Bullet list not available');
                }
            },
            'ordered-list': () => {
                try {
                    this.editor.chain().focus().toggleOrderedList().run();
                } catch (e) {
                    console.warn('Ordered list not available');
                }
            },
            'bold': () => {
                try {
                    this.editor.chain().focus().toggleBold().run();
                } catch (e) {
                    console.warn('Bold not available');
                }
            },
            'italic': () => {
                try {
                    this.editor.chain().focus().toggleItalic().run();
                } catch (e) {
                    console.warn('Italic not available');
                }
            },
            'underline': () => {
                try {
                    this.editor.chain().focus().toggleUnderline().run();
                } catch (e) {
                    console.warn('Underline not available');
                }
            },
            'strike': () => {
                try {
                    this.editor.chain().focus().toggleStrike().run();
                } catch (e) {
                    console.warn('Strike not available');
                }
            },
            'text-align-left': () => {
                try {
                    this.editor.chain().focus().setTextAlign('left').run();
                } catch (e) {
                    console.warn('Text align not available');
                }
            },
            'text-align-center': () => {
                try {
                    this.editor.chain().focus().setTextAlign('center').run();
                } catch (e) {
                    console.warn('Text align not available');
                }
            },
            'text-align-right': () => {
                try {
                    this.editor.chain().focus().setTextAlign('right').run();
                } catch (e) {
                    console.warn('Text align not available');
                }
            },
            'text-align-justify': () => {
                try {
                    this.editor.chain().focus().setTextAlign('justify').run();
                } catch (e) {
                    console.warn('Text align not available');
                }
            },
        };

        Object.entries(buttons).forEach(([id, action]) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    action();
                    this.updateButtonStates();
                });
            }
        });

        // Update button states on selection change
        this.editor.on('selectionUpdate', () => {
            this.updateButtonStates();
        });
    }

    updateButtonStates() {
        if (!this.editor) return;

        // Update button active states
        const buttons = {
            'bullet-list': this.editor.isActive('bulletList'),
            'ordered-list': this.editor.isActive('orderedList'),
            'bold': this.editor.isActive('bold'),
            'italic': this.editor.isActive('italic'),
            'underline': this.editor.isActive('underline'),
            'strike': this.editor.isActive('strike'),
            'text-align-left': this.editor.isActive({ textAlign: 'left' }),
            'text-align-center': this.editor.isActive({ textAlign: 'center' }),
            'text-align-right': this.editor.isActive({ textAlign: 'right' }),
            'text-align-justify': this.editor.isActive({ textAlign: 'justify' }),
        };

        Object.entries(buttons).forEach(([id, isActive]) => {
            const button = document.getElementById(id);
            if (button) {
                if (isActive) {
                    button.classList.add('bg-qf-gray', 'text-white');
                    button.classList.remove('text-qf-light-gray');
                } else {
                    button.classList.remove('bg-qf-gray', 'text-white');
                    button.classList.add('text-qf-light-gray');
                }
            }
        });

        // Update heading select
        const headingSelect = document.getElementById('heading-select');
        if (headingSelect) {
            if (this.editor.isActive('heading', { level: 1 })) {
                headingSelect.value = 'heading1';
            } else if (this.editor.isActive('heading', { level: 2 })) {
                headingSelect.value = 'heading2';
            } else if (this.editor.isActive('heading', { level: 3 })) {
                headingSelect.value = 'heading3';
            } else {
                headingSelect.value = 'paragraph';
            }
        }
    }

    setupFallbackEditor() {
        // Fallback to basic contenteditable if Tiptap fails
        const editorElement = document.querySelector('#tiptap-editor');
        if (editorElement) {
            editorElement.contentEditable = true;
            editorElement.innerHTML = '<p>Please provide your concepting ideas</p>';
        }
    }

    getContent() {
        return this.editor ? this.editor.getHTML() : '';
    }

    setContent(content) {
        if (this.editor) {
            this.editor.commands.setContent(content);
        }
    }
}

// Tab Functionality
class TabManager {
    constructor() {
        this.tabs = document.querySelectorAll('.flex.border-b.border-qf-gray > div');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab);
            });
        });
    }

    switchTab(activeTab) {
        // Remove active class from all tabs
        this.tabs.forEach(tab => {
            tab.classList.remove('text-white', 'after:content-[\'\']');
            tab.classList.add('text-qf-light-gray');
        });
        
        // Add active class to clicked tab
        activeTab.classList.remove('text-qf-light-gray');
        activeTab.classList.add('text-white', 'after:content-[\'\']');
        
        // Here you would typically show/hide different content panels
        console.log(`Switched to ${activeTab.textContent} tab`);
    }
}

// Collapsible Sections
class CollapsibleSections {
    constructor() {
        this.sections = document.querySelectorAll('.border-b.border-gray-500.pb-6, .collapsed');
        this.init();
    }

    init() {
        this.sections.forEach(section => {
            const toggleIcon = section.querySelector('i');
            if (toggleIcon && (toggleIcon.classList.contains('fa-chevron-up') || toggleIcon.classList.contains('fa-chevron-down'))) {
                toggleIcon.addEventListener('click', () => {
                    this.toggleSection(section);
                });
            }
        });
    }

    toggleSection(section) {
        const isCollapsed = section.classList.contains('collapsed');
        const toggleIcon = section.querySelector('i');
        const content = section.querySelector('div:not(.flex)');
        
        if (isCollapsed) {
            section.classList.remove('collapsed');
            toggleIcon.classList.remove('fa-chevron-down');
            toggleIcon.classList.add('fa-chevron-up');
            if (content) content.classList.remove('hidden');
        } else {
            section.classList.add('collapsed');
            toggleIcon.classList.remove('fa-chevron-up');
            toggleIcon.classList.add('fa-chevron-down');
            if (content) content.classList.add('hidden');
        }
    }
}

// File Upload Functionality
class FileManager {
    constructor() {
        this.addFilesBtn = document.querySelector('button');
        this.filesContent = document.querySelector('.flex-1.flex.items-center.justify-center');
        this.init();
    }

    init() {
        if (this.addFilesBtn && this.addFilesBtn.textContent.includes('Add Files')) {
            this.addFilesBtn.addEventListener('click', () => {
                this.openFileDialog();
            });
        }

        // Create hidden file input
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.multiple = true;
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);

        this.fileInput.addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files);
        });
    }

    openFileDialog() {
        this.fileInput.click();
    }

    handleFileSelection(files) {
        if (files.length > 0) {
            this.displayFiles(files);
        }
    }

    displayFiles(files) {
        // Remove "No Files" message
        const noFiles = this.filesContent.querySelector('.no-files');
        if (noFiles) {
            noFiles.remove();
        }

        // Create files list
        const filesList = document.createElement('div');
        filesList.className = 'files-list';

        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-icon">
                    <i class="fas fa-file"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
                <button class="remove-file" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            filesList.appendChild(fileItem);
        });

        this.filesContent.appendChild(filesList);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Save Functionality
class SaveManager {
    constructor() {
        this.saveBtn = document.querySelector('button[class*="bg-qf-green"]');
        this.cancelBtn = document.querySelector('button[class*="bg-qf-gray"]:not([class*="bg-qf-green"])');
        this.init();
    }

    init() {
        this.saveBtn.addEventListener('click', () => {
            this.saveContent();
        });

        this.cancelBtn.addEventListener('click', () => {
            this.cancelChanges();
        });
    }

    saveContent() {
        // Get content from Tiptap editor if available, otherwise fallback
        let editorContent = '';
        const tiptapEditor = window.tiptapEditor;
        if (tiptapEditor && tiptapEditor.getContent) {
            editorContent = tiptapEditor.getContent();
        } else {
            const editorElement = document.querySelector('#tiptap-editor');
            editorContent = editorElement ? editorElement.innerHTML : '';
        }
        
        // Show loading state
        const originalText = this.saveBtn.textContent;
        this.saveBtn.textContent = 'Saving...';
        this.saveBtn.disabled = true;

        // Simulate save operation
        setTimeout(() => {
            this.saveBtn.textContent = originalText;
            this.saveBtn.disabled = false;
            
            // Show success message
            this.showNotification('Content saved successfully!', 'success');
            console.log('Saved content:', editorContent);
        }, 1500);
    }

    cancelChanges() {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            // Reset editor content
            const tiptapEditor = window.tiptapEditor;
            if (tiptapEditor && tiptapEditor.setContent) {
                tiptapEditor.setContent('<p>Please provide your concepting ideas</p>');
            } else {
                const editorElement = document.querySelector('#tiptap-editor');
                if (editorElement) {
                    editorElement.innerHTML = '<p>Please provide your concepting ideas</p>';
                }
            }
            this.showNotification('Changes cancelled', 'info');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: '#ffffff',
            fontWeight: '500',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease-out'
        });

        if (type === 'success') {
            notification.style.background = '#4ade80';
            notification.style.color = '#000000';
        } else if (type === 'info') {
            notification.style.background = '#3b82f6';
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Edit Modal Functionality
class EditManager {
    constructor() {
        this.editBrandFeedbackBtn = document.querySelector('[title="Edit Brand Feedback"]');
        this.editBrandNoteBtn = document.querySelector('[title="Edit Brand Note"]');
        this.modal = document.getElementById('edit-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalContent = document.getElementById('modal-content');
        this.closeModal = document.getElementById('close-modal');
        this.cancelEdit = document.getElementById('cancel-edit');
        this.saveEdit = document.getElementById('save-edit');
        this.currentSection = null;
        this.init();
    }

    init() {
        if (this.editBrandFeedbackBtn) {
            this.editBrandFeedbackBtn.addEventListener('click', () => {
                this.openEditModal('Brand Feedback', this.getBrandFeedbackContent());
            });
        }

        if (this.editBrandNoteBtn) {
            this.editBrandNoteBtn.addEventListener('click', () => {
                this.openEditModal('Brand Note', this.getBrandNoteContent());
            });
        }

        // Modal event listeners
        this.closeModal.addEventListener('click', () => this.closeModalWindow());
        this.cancelEdit.addEventListener('click', () => this.closeModalWindow());
        this.saveEdit.addEventListener('click', () => this.saveContent());
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModalWindow();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModalWindow();
            }
        });
    }

    openEditModal(title, content) {
        this.modalTitle.textContent = `Edit ${title}`;
        this.modalContent.value = content;
        this.modal.classList.remove('hidden');
        this.modalContent.focus();
    }

    closeModalWindow() {
        this.modal.classList.add('hidden');
        this.currentSection = null;
    }

    getBrandFeedbackContent() {
        const feedbackSection = document.querySelector('.border-b.border-gray-500.pb-6:first-of-type');
        if (feedbackSection) {
            const paragraphs = feedbackSection.querySelectorAll('p');
            return Array.from(paragraphs).map(p => p.textContent).join('\n\n');
        }
        return '';
    }

    getBrandNoteContent() {
        const noteSection = document.querySelector('.collapsed');
        if (noteSection) {
            const paragraphs = noteSection.querySelectorAll('p');
            return Array.from(paragraphs).map(p => p.textContent).join('\n\n');
        }
        return '';
    }

    saveContent() {
        const newContent = this.modalContent.value;
        const title = this.modalTitle.textContent.replace('Edit ', '');
        
        if (title === 'Brand Feedback') {
            this.updateBrandFeedback(newContent);
        } else if (title === 'Brand Note') {
            this.updateBrandNote(newContent);
        }
        
        this.closeModalWindow();
        this.showNotification(`${title} updated successfully!`, 'success');
    }

    updateBrandFeedback(content) {
        const feedbackSection = document.querySelector('.border-b.border-gray-500.pb-6:first-of-type');
        if (feedbackSection) {
            const contentDiv = feedbackSection.querySelector('div:not(.flex)');
            if (contentDiv) {
                const paragraphs = content.split('\n\n');
                contentDiv.innerHTML = paragraphs.map(p => 
                    `<p class="text-gray-300 leading-relaxed mb-3">${p}</p>`
                ).join('');
            }
        }
    }

    updateBrandNote(content) {
        const noteSection = document.querySelector('.collapsed');
        if (noteSection) {
            const contentDiv = noteSection.querySelector('div:not(.flex)');
            if (contentDiv) {
                const paragraphs = content.split('\n\n');
                contentDiv.innerHTML = paragraphs.map(p => 
                    `<p class="text-gray-300 leading-relaxed mb-3">${p}</p>`
                ).join('');
            }
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: '#ffffff',
            fontWeight: '500',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease-out'
        });

        if (type === 'success') {
            notification.style.background = '#4ade80';
            notification.style.color = '#000000';
        } else if (type === 'info') {
            notification.style.background = '#3b82f6';
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Tiptap editor and store globally for access
    window.tiptapEditor = new TiptapEditor();
    new TabManager();
    new CollapsibleSections();
    new FileManager();
    new SaveManager();
    new EditManager();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .files-list {
        width: 100%;
    }
    
    .file-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: #333333;
        border-radius: 6px;
        margin-bottom: 8px;
        border: 1px solid #404040;
    }
    
    .file-icon {
        color: #4ade80;
        font-size: 16px;
    }
    
    .file-info {
        flex: 1;
    }
    
    .file-name {
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 2px;
    }
    
    .file-size {
        color: #a0a0a0;
        font-size: 12px;
    }
    
    .remove-file {
        background: transparent;
        border: none;
        color: #a0a0a0;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .remove-file:hover {
        background: #404040;
        color: #ffffff;
    }
`;
document.head.appendChild(style);
