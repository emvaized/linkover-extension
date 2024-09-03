# <sub><img src="./src/assets/icon.png" height="40" width="40"></sub> Linkover – info tooltip on hover for links!

This browser extension shows info about any link on mouse hover.
It can load page titles, favicons, short description and thumbnails for many links you see over the internet and show it as a tooltip on hover. It currently uses [link-preview-js](https://www.npmjs.com/package/link-preview-js) under the hood.

> [!WARNING]\
> Fetching info about link using this extension will act as if actually visited the page! It is recommended to not prefetch suspicious links. Although browser history will not get populated with these pages, no worries.

## Screenshots
| ![Screenshot 1](./screenshots/2.png) |
|-|

<details>
    <summary>More screenshots...</summary>
        <table><tr><td><img src="./screenshots/1.png" /></td></tr></table> 
        <table><tr><td><img src="./screenshots/3.png" /></td></tr></table> 
        <table><tr><td><img src="./screenshots/4.png" /></td></tr></table> 
</details>


## Support
If you really enjoy this project, please consider supporting its further development by making a small donation using one of the services below! 

<a href="https://ko-fi.com/emvaized"><img src="https://cdn.prod.website-files.com/5c14e387dab576fe667689cf/64f1a9ddd0246590df69ea0b_kofi_long_button_red%25402x-p-800.png" alt="Support on Ko-fi" height="40"></a> &nbsp; <a href="https://liberapay.com/emvaized/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg" height="40"></a> &nbsp; <a href="https://emvaized.github.io/donate/bitcoin/"><img src="https://github.com/emvaized/emvaized.github.io/blob/main/donate/bitcoin/assets/bitcoin-donate-button.png?raw=true" alt="Donate Bitcoin" height="40" /></a>

## Building
- Verify that [npm](https://nodejs.org/en/download/prebuilt-installer) is installed and configured on your system
- Open terminal in the project's root directory
- Run `npm install` to install all it's dependencies
- Run `npm run build` to generate `dist` folder with minimized code of the extension

## Links to my other browser extensions
* [Selecton](https://github.com/emvaized/selecton-extension) – smart text selection popup
* [Circle Mouse Gestures](https://github.com/emvaized/circle-mouse-gestures) – mouse gestures with visual representation of all available actions
* [Google Tweaks](https://github.com/emvaized/google-tiles-extension) – set of tweaks for Google search page to make it easier to use
* [Open in Popup Window](https://github.com/emvaized/open-in-popup-window-extension) – quickly open link or image in a popup window with no browser controls