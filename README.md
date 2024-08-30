# Linkover browser extension – tooltip with link info on hover

Fetch info about any link on hover! 
This extension is able to fetch tab title, favicon, short description and thumbnails for many links you see over the internet. It uses [link-preview-js](https://www.npmjs.com/package/link-preview-js) under the hood.

> [!WARNING]\
> Fetching info about link using this extension will act as if actually visited the page! It is recommended to not prefetch any suspicious links

## Building
- `npm install` to install all dependencies
- `npm run build` to generate `dist` folder with minimized code of the extension
