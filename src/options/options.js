document.addEventListener("DOMContentLoaded", init);

function init(){
    loadUserConfigs(function(userConfigs){

        const keys = Object.keys(configs);

        for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i];

            /// set corresponing input value
            let input = document.getElementById(key.toString());

            /// Set input value
            if (input !== null && input !== undefined) {
                if (input.type == 'checkbox') {
                    if ((userConfigs[key] !== null && userConfigs[key] == true) || (userConfigs[key] == null && configs[key] == true))
                        input.setAttribute('checked', 0);
                    else input.removeAttribute('checked', 0);
                } else if (input.tagName == 'SELECT') {
                    let options = input.querySelectorAll('option');
                    if (options)
                        options.forEach(function (option) {
                            let selectedValue = userConfigs[key] ?? configs[key];
                            if (option.value == selectedValue) option.setAttribute('selected', true);
    
                            try {
                                // if (chrome.i18n.getMessage(option.innerHTML) != '')
                                //     option.innerHTML = chrome.i18n.getMessage(option.innerHTML);
                                // else if (chrome.i18n.getMessage(option['value']) != '')
                                    option.innerHTML = chrome.i18n.getMessage(option['value']);
                            } catch (e) { }
    
                        });
                } else {
                    input.setAttribute('value', userConfigs[key] ?? configs[key]);
                }

                /// Set translated label for input
                const label = chrome.i18n.getMessage(key) ?? key;
                if (!input.parentNode.innerHTML.includes(label)) {
                    if (input.type == 'text') {
                        input.parentNode.innerHTML = label + ' ' + input.parentNode.innerHTML;
                    } else if (input.type == 'checkbox'){
                        input.parentNode.innerHTML += ' ' + label;
                    } else {
                        input.parentNode.innerHTML = label + ' ' + input.parentNode.innerHTML;
                    }
                }

                /// Check if needs tooltip
                const hintMark = document.querySelector(`.option:has(#${key}) .hint`);
                if (hintMark) {
                    const hintText = chrome.i18n.getMessage(key + 'Hint');
                    if (hintText) hintMark.title = hintText;
                }

                input = document.querySelector('#' + key.toString());

                /// Set event listener
                input.addEventListener("input", function (e) {
                    let id = input.getAttribute('id');
                    let inputValue = input.getAttribute('type') == 'checkbox' ? input.checked : input.value;
                    configs[id] = inputValue;

                    saveAllSettings();
                    updateDisabledOptions();
                });
            }
        }
        updateDisabledOptions();
        translateHeaders();
        setVersionLabel();
        setFooterButtons();
    });
}

function translateHeaders(){
    const headerIds = [
        'extensionSettingsHeader',
        'activationHeader',
        'appearanceHeader',
        'behaviorHeader',
        'advancedSettingsHeader',
    ];
    headerIds.forEach(id => document.getElementById(id).innerText = chrome.i18n.getMessage(id))
}

function updateDisabledOptions() {
    /// Grey out unavailable optoins
    document.getElementById("thumbnailOnSide").parentNode.className = document.getElementById("showThumbnail").checked ? 'enabled-option' : 'disabled-option';
    document.getElementById("descriptionBelowUrl").parentNode.className = document.getElementById("showDescription").checked ? 'enabled-option' : 'disabled-option';
}

function setVersionLabel() {
    const label = document.getElementById('extensionVersion');
    const manifestData = chrome.runtime.getManifest();
    label.innerHTML = 'v' + manifestData.version + ` (<a target='_blank' href='https://github.com/emvaized/linkover-extension/blob/main/CHANGELOG.md'>${(chrome.i18n.getMessage("changelog") ?? "Changelog").toLowerCase()}</a>)`;
}

function setFooterButtons(){
    translateFooterButtons();

    document.querySelector("#donateButton").addEventListener("click", function (val) {
        window.open('https://github.com/emvaized/linkover-extension?tab=readme-ov-file#support', '_blank');
    });
    
    document.querySelector("#githubButton").addEventListener("click", function (val) {
        window.open('https://github.com/emvaized/linkover-extension', '_blank');
    });
    // document.querySelector("#writeAReviewButton").addEventListener("click", function (val) {
    
    //     const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
    //     window.open(isFirefox ? 'https://addons.mozilla.org/firefox/addon/open-in-popup-window/' : 'https://chrome.google.com/webstore/detail/open-in-popup-window/gmnkpkmmkhbgnljljcchnakehlkihhie/reviews', '_blank');
    // });
}

function translateFooterButtons(){
    document.getElementById('donateButton').innerHTML += chrome.i18n.getMessage('donateButton');
    document.getElementById('githubButton').innerHTML += chrome.i18n.getMessage('githubButton');
    // document.getElementById('writeAReviewButton').innerHTML += chrome.i18n.getMessage('writeAReviewButton');
}