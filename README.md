# ☕️ brevity
An offline, single-page app to improve your writing.

![Brevity](/app/img/brevity.png)

## Purpose
Brevity is an offline web application that checks your writing for common complexity, such as:
- Adverbs
- Complex words
- Lengthy sentences

When Brevity detects a source of complexity, it will highlight that text. You can hover over the highlighted text to see what Brevity detected:
![Demo: Brevity detecting text issues](/app/img/demo.gif)

Brevity challenges you to condense and clarify your writing.


## Usage
1. Download or `git clone` this repository;
2. Double-click `index.html`;
3. *(Optional)* Select your theme;
3. That's it!! You're ready to write.

Text in the Editor pane will persist in `localStorage`, and should be available to you on your next visit. (Even if you accidentally close the tab!)


## Structure
Code is structured as follows:
- `index.html`: Launch the site, & load `script.js`
- `script.js`: Load user text, switch themes, and evaluate/highlight complexity
- `/css`: Theme files
- `/img`: Theme + readme images


## Background
I created Brevity as a creative jaunt to see how building a personal local app with AI could go. While it's not perfect, I think it still came out nice!

My writeup on this process (and why I love what it means for home cooked apps) is here:
- [Home cooking apps with AI](https://kknowl.es/posts/key-vault-access-policies/)

Code in this repository is heavily co-authored in ChatGPT Canvas, and primarily intended as a personal editor. It may be a little sloppy.