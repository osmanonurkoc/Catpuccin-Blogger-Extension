/* ==========================================================
 CATPPUCCIN BLOGGER TOOLBAR INJECTOR    *
 ========================================================== */

if (!document.getElementById('tabler-icons-ext')) {
    const link = document.createElement('link');
    link.id = 'tabler-icons-ext';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css';
    document.head.appendChild(link);
}

const customButtons = [
    { icon: 'ti ti-code', tooltip: 'Inline Code Highlight (<code>)', start: '<code>', end: '</code>', isHtml: true },
    { icon: 'ti ti-file-code', tooltip: 'Code Box [code]', tagBase: 'code', start: '<br>[code]<br>', end: '<br>[/code]<br>', isHtml: false },
{ icon: 'ti ti-carousel-horizontal', tooltip: 'Slideshow [slideshow]', tagBase: 'slideshow', start: '<br>[slideshow=3]<br>', end: '<br>[/slideshow]<br>', isHtml: false },
{ icon: 'ti ti-layout-grid', tooltip: 'Masonry Gallery [gallery]', tagBase: 'gallery', start: '<br>[gallery=3]<br>', end: '<br>[/gallery]<br>', isHtml: false },
{ icon: 'ti ti-layers-difference', tooltip: 'Image Compare [compare]', tagBase: 'compare', start: '<br>[compare]<br>', end: '<br>[/compare]<br>', isHtml: false },
{ icon: 'ti ti-link', tooltip: 'Catppuccin Link [link]', tagBase: 'link', start: '<br>[link]<br>', end: '<br>[/link]<br>', isHtml: false }
];

// Helper function to safely delete specific text using native commands to preserve Undo history
function deleteTagInNode(editorDoc, textNode, regex) {
    const match = textNode.nodeValue.match(regex);
    if (match) {
        const r = editorDoc.createRange();
        r.setStart(textNode, match.index);
        r.setEnd(textNode, match.index + match[0].length);
        const sel = editorDoc.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        editorDoc.execCommand('delete', false, null);
        return true;
    }
    return false;
}

function insertTags(btnInfo) {
    const iframes = document.querySelectorAll('iframe');
    let editorDoc = null;

    for (let i = 0; i < iframes.length; i++) {
        try {
            if (iframes[i].contentDocument && iframes[i].contentDocument.body.contentEditable === "true") {
                editorDoc = iframes[i].contentDocument;
                break;
            }
        } catch(e) {}
    }

    if (!editorDoc) {
        alert("Please switch to 'Compose view' to use Catppuccin tags.");
        return;
    }

    const selection = editorDoc.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    // ==========================================
    // LOGIC 1: INLINE HTML TAG TOGGLE (e.g., <code>)
    // ==========================================
    if (btnInfo.isHtml) {
        let parentNode = range.commonAncestorContainer;
        let targetNode = null;

        while (parentNode && parentNode !== editorDoc.body) {
            if (parentNode.nodeName === 'CODE') { targetNode = parentNode; break; }
            parentNode = parentNode.parentNode;
        }

        if (targetNode) {
            // Unwrap: Safely move contents out of the <code> tag and remove the tag
            const frag = editorDoc.createDocumentFragment();
            while (targetNode.firstChild) frag.appendChild(targetNode.firstChild);
            targetNode.parentNode.replaceChild(frag, targetNode);
        } else {
            const fragment = range.cloneContents();
            const div = document.createElement('div');
            div.appendChild(fragment);
            let htmlContent = div.innerHTML || "TEXT";
            editorDoc.execCommand('insertHTML', false, `${btnInfo.start}${htmlContent}${btnInfo.end}&#8203;`);
        }
    }
    // ==========================================
    // LOGIC 2: TREEWALKER BRACKET TOGGLE (e.g., [slideshow])
    // ==========================================
    else {
        const openRegex = new RegExp(`\\[${btnInfo.tagBase}(?:=[^\\]]*)?\\]`, 'i');
        const closeRegex = new RegExp(`\\[\\/${btnInfo.tagBase}\\]`, 'i');

        let openNode = null;
        let closeNode = null;

        // Setup TreeWalker to scan only Text Nodes
        const walker = editorDoc.createTreeWalker(editorDoc.body, NodeFilter.SHOW_TEXT, null, false);

        // 1. Search Backwards for the Opening Tag
        walker.currentNode = range.startContainer;

        // Check if the current node itself has the opening tag
        if (walker.currentNode.nodeType === 3 && openRegex.test(walker.currentNode.nodeValue)) {
            openNode = walker.currentNode;
        } else {
            while (walker.previousNode()) {
                if (openRegex.test(walker.currentNode.nodeValue)) {
                    openNode = walker.currentNode;
                    break;
                }
                // If we hit a closing tag while going backwards, we are trespassing another block!
                if (closeRegex.test(walker.currentNode.nodeValue)) break;
            }
        }

        // 2. Search Forwards for the Closing Tag
        walker.currentNode = range.endContainer;

        if (walker.currentNode.nodeType === 3 && closeRegex.test(walker.currentNode.nodeValue)) {
            closeNode = walker.currentNode;
        } else {
            while (walker.nextNode()) {
                if (closeRegex.test(walker.currentNode.nodeValue)) {
                    closeNode = walker.currentNode;
                    break;
                }
                // If we hit an opening tag while going forwards, we are trespassing another block!
                if (openRegex.test(walker.currentNode.nodeValue) && walker.currentNode !== openNode) break;
            }
        }

        // 3. Execution Phase
        if (openNode && closeNode) {
            // TOGGLE OFF: We found the boundaries!
            // Crucial: Delete the closing tag first so string index offsets of the opening tag don't shift.
            deleteTagInNode(editorDoc, closeNode, closeRegex);
            deleteTagInNode(editorDoc, openNode, openRegex);
        } else {
            // TOGGLE ON: Boundaries not found, wrap the current selection
            const fragment = range.cloneContents();
            const div = document.createElement('div');
            div.appendChild(fragment);
            let htmlContent = div.innerHTML;

            if (!htmlContent) htmlContent = "TEXT"; // Fallback if clicked on empty space

            editorDoc.execCommand('insertHTML', false, `${btnInfo.start}${htmlContent}${btnInfo.end}`);
        }
    }
}

function injectToolbar() {
    const toolbar = document.querySelector('.Wdqgzf');
    if (!toolbar) return;
    if (document.getElementById('cat-toolbar-extension')) return;

    const extContainer = document.createElement('div');
    extContainer.id = 'cat-toolbar-extension';

    customButtons.forEach(btnInfo => {
        const btn = document.createElement('div');
        btn.className = 'cat-ext-btn';

        btn.innerHTML = `<i class="${btnInfo.icon}"></i>`;
        btn.title = btnInfo.tooltip;

        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            insertTags(btnInfo);
        });

        extContainer.appendChild(btn);
    });

    toolbar.appendChild(extContainer);
}

const observer = new MutationObserver((mutations, obs) => {
    const toolbar = document.querySelector('.Wdqgzf');
    if (toolbar) {
        injectToolbar();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
