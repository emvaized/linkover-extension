import { getLinkPreview } from "link-preview-js";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.actionToDo) {
            case 'fetchLinkInfo': {
                getLinkPreview(request.url, {
                    // headers: { "user-agent": "googlebot" },
                    headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
                    timeout: 3500
                }).then((data) => sendResponse(data)).catch(error => sendResponse(undefined));
                return true;
            } break;
        }
    }
);