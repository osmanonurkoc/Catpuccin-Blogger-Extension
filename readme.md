# Catppuccin Blogger Editor Tools

![Toolbar Preview](/pictures/preview.png)

A companion Chrome Extension designed exclusively for the [Catppuccin Portfolio Theme for Blogger](https://github.com/osmanonurkoc/Catpuccin-Portfolio-Blogger). 

Blogger's native editor doesn't support custom shortcodes or inline code formatting out of the box. This extension bridges that gap by seamlessly injecting **Tabler Icons** directly into your Blogger Compose toolbar, allowing you to wrap text and images with custom theme tags in a single click.

## ✨ Features

* **Native Integration:** Blends perfectly into Blogger's standard toolbar height and gray color scheme.
* **Smart Context Toggle:** Powered by the `TreeWalker` API. If you select text/images already wrapped in tags, clicking the button again will intelligently strip the tags without harming your content.
* **Zero-Width Escapes:** Inline code blocks (`<code>`) automatically insert invisible escape spaces so you don't get trapped typing inside the highlighted box.
* **Supported Shortcodes:**
  * `</>` - Inline `<code>` highlighting
  * `< >` - Mac-style `[code]` syntax boxes
  * 🖼️ - Interactive `[slideshow]` carousels
  * 🔲 - Masonry `[gallery]` grids
  * 📸 - Before/After `[compare]` image sliders
  * 🔗 - Themed `[link]` separators

---

## 🛠️ How to Install (Chrome/Edge/Brave)

Since this is a custom developer tool, it is installed directly from your local folder.

1. **Download** or clone this repository to your computer.
2. Open your browser and go to the extensions page:
   * Chrome/Brave: Type `chrome://extensions/` in your address bar.
   * Edge: Type `edge://extensions/`
3. Turn on **Developer mode** (usually a toggle switch in the top right corner).
4. Click the **Load unpacked** button (top left).
5. Select the folder where you extracted this extension.

*Done! The extension is now active.*

---

## 🚀 How to Use

1. Open Blogger and create a new post or page. Ensure you are in the **Compose view** (not HTML view).
2. Highlight the text or images you want to format.
3. Click the desired icon on the far right of your Blogger toolbar.
4. The extension will safely inject the corresponding tags (e.g., `[gallery] ... [/gallery]`) around your selection without breaking the "Undo" (Ctrl+Z) history.
5. To remove the tags, simply place your cursor inside the block (or select the items again) and click the same button to toggle it off.

---

## 🎨 Associated Theme

This extension is built specifically to trigger the CSS and JavaScript parsers within the **Catppuccin Portfolio Theme**. 

If you haven't installed the theme yet, grab it here:
👉 **[Catppuccin Portfolio Theme for Blogger](https://github.com/osmanonurkoc/Catpuccin-Portfolio-Blogger)**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

----------

_Created by [@osmanonurkoc](https://github.com/osmanonurkoc)_
