import { getLinkPreview } from "link-preview-js";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.actionToDo) {
            case 'fetchLinkInfo': {
                getLinkPreview(request.url, {
                    headers: { "user-agent": "googlebot" },
                    timeout: 3500
                }).then((data) => sendResponse(data)).catch(error => sendResponse(undefined));
                return true;
            } break;
        }
    }
);