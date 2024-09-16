const configs = {
    "changeColorForProccessedLinks": true,
    "changeCursorToLoading": true,
    "debugMode": false,
    "descriptionBelowUrl": false,
    "enabled": true,
    "excludedDomains": "",
    "followRedirects": false,
    "hoverDelay": 1000,
    "keepShownOnMouseOut": false,
    "maxCursorSpeed": 1,
    "mouseMoveDebounceTimeout": 80,
    "preventTooltipFromCoverLink": true,
    "showDescription": true,
    "showOnlyForEmbeddedLinks": false,
    "showOnlyUrlWhenNoData": true,
    "showOnlyWhenThreeDots": false,
    "showOnlyWithModifierKey": true,
    "showSiteNameInsteadOfUrl": false,
    "showThumbnail": true,
    "thumbnailOnSide": false,
    "tooltipPosition": "overLink", /// <- variants: overLink, bottomLeft, bottomRight
    "transitionDuration": 300,
    "whitelistDomains": "",
    "windowsEventsDebounceTimeout": 30,
    "popupTriggerMethod": "onHover" /// <- variants: onHover, onLongClick
};

function loadUserConfigs(callback) {
    const keys = Object.keys(configs);
    chrome.storage.local.get(
        keys, (cfg)=>{
            if (cfg) {
                const l = keys.length;
                for (let i = 0; i < l; i++) {
                    const key = keys[i];
                    if (cfg[key] !== undefined) configs[key] = cfg[key];
                }
            }

            if (callback) callback(configs);
        }
    );
}

function saveAllSettings(){
    chrome.storage.local.set(configs)
}

