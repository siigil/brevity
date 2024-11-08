// script.js
document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("editor");
    const sidebar = document.createElement("div");
    sidebar.id = "sidebar";
    document.body.appendChild(sidebar);

    // Create word and character count elements
    const wordCountElement = document.createElement("div");
    wordCountElement.id = "word-count";
    sidebar.appendChild(wordCountElement);

    const charCountElement = document.createElement("div");
    charCountElement.id = "char-count";
    sidebar.appendChild(charCountElement);

    const divider = document.createElement("hr");
    divider.id = "sidebar-divider";
    sidebar.appendChild(divider);

    const messageElement = document.createElement("div");
    messageElement.id = "message";
    sidebar.appendChild(messageElement);

    // Create theme switcher and add it to the bottom of the sidebar
    const themeSwitcher = document.createElement("select");
    themeSwitcher.id = "theme-switcher";
    const themes = ["Default", "Dark"];
    themes.forEach(theme => {
        const option = document.createElement("option");
        option.value = theme.toLowerCase();
        option.textContent = theme;
        themeSwitcher.appendChild(option);
    });
    sidebar.appendChild(themeSwitcher);

    themeSwitcher.addEventListener("change", (event) => {
        setTheme(event.target.value);
    });

    let typingTimeout;

    editor.addEventListener("input", () => {
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            updateWordAndCharCount();
            highlightText();
        }, 500);
    });

    editor.addEventListener("mouseover", (event) => {
        if (event.target.classList.contains("highlight-adverb")) {
            showSidebarMessage("Avoid adverbs for more concise writing.");
        } else if (event.target.classList.contains("highlight-passive")) {
            showSidebarMessage("Consider using active voice instead of passive.");
        } else if (event.target.classList.contains("highlight-complex")) {
            showSidebarMessage("Simplify complex words for better readability.");
        } else if (event.target.classList.contains("highlight-hard")) {
            showSidebarMessage("This sentence is hard to read. Consider splitting it or simplifying.");
        } else if (event.target.classList.contains("highlight-very-hard")) {
            showSidebarMessage("This sentence is very hard to read. Consider revising significantly.");
        } else {
            clearSidebarMessage();
        }
    });

    editor.addEventListener("mouseout", (event) => {
        if (!event.relatedTarget || (!event.relatedTarget.classList.contains("highlight-adverb") && !event.relatedTarget.classList.contains("highlight-passive") && !event.relatedTarget.classList.contains("highlight-complex") && !event.relatedTarget.classList.contains("highlight-hard") && !event.relatedTarget.classList.contains("highlight-very-hard"))) {
            clearSidebarMessage();
        }
    });

    function highlightText() {
        // Save the current cursor position
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        let cursorPosition = null;
        if (range) {
            cursorPosition = range.endOffset;
        }

        // Remove all existing highlights before reapplying
        editor.querySelectorAll(".highlight-adverb, .highlight-passive, .highlight-complex, .highlight-hard, .highlight-very-hard").forEach(span => {
            const textNode = document.createTextNode(span.textContent);
            span.parentNode.replaceChild(textNode, span);
        });

        // Regular expressions for identifying writing issues
        const adverbsRegex = /\b(\w+ly)\b/g;
        const passiveVoiceRegex = /\b(is|are|was|were|be|been|being)\b\s+\b(\w+ed)\b/g;
        const complexWordsRegex = /\b(?:utilize|commence|ascertain|ameliorate)\b/g;
        const sentenceRegex = /[^.!?]+[.!?]?/g;

        const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null, false);
        const nodesToReplace = [];

        let node;
        while ((node = walker.nextNode())) {
            let match;
            while ((match = sentenceRegex.exec(node.textContent)) !== null) {
                const sentence = match[0];
                const wordCount = sentence.split(/\s+/).filter(word => word.length > 0).length;
                let span = null;

                if (wordCount > 14) {
                    span = document.createElement("span");
                    span.className = "highlight-very-hard";
                    span.textContent = sentence;
                } else if (wordCount >= 10) {
                    span = document.createElement("span");
                    span.className = "highlight-hard";
                    span.textContent = sentence;
                }

                if (span) {
                    nodesToReplace.push({ node, match, span });
                }
            }
        }

        nodesToReplace.forEach(({ node, match, span }) => {
            const range = document.createRange();
            range.setStart(node, match.index);
            range.setEnd(node, match.index + match[0].length);
            range.deleteContents();
            range.insertNode(span);
        });

        // Apply additional highlights for adverbs, passive voice, and complex words
        applyHighlight(adverbsRegex, "highlight-adverb");
        applyHighlight(passiveVoiceRegex, "highlight-passive");
        applyHighlight(complexWordsRegex, "highlight-complex");

        // Restore the cursor position at the end of the text input
        if (cursorPosition !== null) {
            const newRange = document.createRange();
            const lastNode = editor.lastChild;
            if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
                newRange.setStart(lastNode, lastNode.textContent.length);
            } else if (lastNode) {
                newRange.setStart(lastNode, lastNode.childNodes.length);
            }
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    }

    function applyHighlight(regex, className) {
        const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null, false);
        const nodesToReplace = [];

        let node;
        while ((node = walker.nextNode())) {
            let match;
            while ((match = regex.exec(node.textContent)) !== null) {
                nodesToReplace.push({ node, match });
            }
        }

        nodesToReplace.forEach(({ node, match }) => {
            const range = document.createRange();
            range.setStart(node, match.index);
            range.setEnd(node, match.index + match[0].length);

            const span = document.createElement("span");
            span.className = className;
            span.textContent = match[0];

            range.deleteContents();
            range.insertNode(span);
        });
    }

    function showSidebarMessage(message) {
        messageElement.textContent = message;
    }

    function clearSidebarMessage() {
        messageElement.textContent = "";
    }

    function updateWordAndCharCount() {
        const text = editor.textContent.trim();
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        const charCount = text.length;

        wordCountElement.textContent = `Word count: ${wordCount}`;
        charCountElement.textContent = `Character count: ${charCount}`;
    }

    // Initial count update
    updateWordAndCharCount();

    // Function to set theme styles by switching CSS files
    function setTheme(theme) {
        let themeLink = document.getElementById("theme-link");
        if (!themeLink) {
            themeLink = document.createElement("link");
            themeLink.id = "theme-link";
            themeLink.rel = "stylesheet";
            document.head.appendChild(themeLink);
        }
        switch (theme) {
            case "dark":
                themeLink.href = "dark.css";
                break;
            default:
                themeLink.href = "styles.css";
                break;
        }
    }

    // Set initial theme
    setTheme("default");

    // Move the theme switcher to the bottom of the sidebar
    sidebar.appendChild(themeSwitcher);
});