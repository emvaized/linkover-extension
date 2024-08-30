const configs = {
    'transitionDuration': 250,
    'hoverDelay': 1000,
    'enabled': true,
    'debugMode': false,
    'changeCursorToLoading': true,
    'maxCursorSpeed': 1.0,
    'showOnlyForEmbeddedLinks': false,
    'changeColorForProccessedLinks': false,
    'showOnlyUrlWhenNoData': true,
    'adaptToBrowserDarkMode': true,
    'showOnlyWithModifierKey': true,
    'excludedDomains': '',
    'mouseMoveDebounceTimeout': 25,
    'showDescription': true,
    'showThumbnail': true,
    'showOnlyWhenThreeDots': false,
    'whitelistDomains': ''
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

