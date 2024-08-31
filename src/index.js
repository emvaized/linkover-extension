let timeoutToShowPopup, timeoutDebounceMousemove, timeoutDebounceWindowListeners;
let tooltipShown = false, lastMouseMoveDx, lastHoveredLink;
const cachedData = {};
const faviconFetchUrl = 'https://s2.googleusercontent.com/s2/favicons?domain=';

loadUserConfigs(function(cfg){
    if (!configs.enabled) return;

    configs.excludedDomains.split(',').forEach((domain) => {
        if (window.location.href.includes(domain.trim().toLowerCase())) return;
    });
    setPageListeners();  
})
chrome.storage.onChanged.addListener((changes) => loadUserConfigs());


function setPageListeners() {
    /// prevent unwanted tooltip appear
    ['mousedown', 'scroll', 'selectstart', 'visibilitychange', 'keyup']
        .forEach(e => document.addEventListener(e, function(){
            window.clearTimeout(timeoutDebounceWindowListeners);
            timeoutDebounceWindowListeners = window.setTimeout(function(){
                onHideTooltip();
            }, configs.windowsEventsDebounceTimeout)
        }));

    /// set listener on mouse move
    // let prevHoveredEl; /// cache previously hovered element
    // document.addEventListener('mousemove', function (e) {
    document.addEventListener('mouseover', function (e) {
        window.clearTimeout(timeoutDebounceMousemove); 
        timeoutDebounceMousemove = window.setTimeout(function(){
            if (configs.showOnlyWithModifierKey && (!e.ctrlKey && !e.shiftKey && !e.altKey)) return;
            const el = e.target;
            // if (el == prevHoveredEl) return;
            // prevHoveredEl = el;
    
            if (el.tagName == 'A' || (el.parentNode && el.parentNode.tagName == 'A')) {
                lastMouseMoveDx = e.clientX;
                if (el == lastHoveredLink) return;
                if (configs.changeColorForProccessedLinks && lastHoveredLink) 
                    unhighlightProccessedLink(lastHoveredLink);
                lastHoveredLink = el;
                 
                /// check when 'show only if three dots' enabled
                if (configs.showOnlyWhenThreeDots && !el.innerText.includes('...')) return;
    
                /// reject if too big cursor speed
                const cursorSpeed = (Math.abs(e.movementX) + Math.abs(e.movementY)) / 2;
                if (configs.debugMode) console.log('cursor speed: ' + cursorSpeed);
                if (cursorSpeed > configs.maxCursorSpeed) {
                    if (configs.debugMode) console.log('cursor speed is too big, rejected');
                    return;
                } 
    
                if (configs.debugMode) console.log('hovered link!');
    
                /// don't show for non embedded links
                if (configs.showOnlyForEmbeddedLinks
                    && el.parentNode.textContent.trim() == el.textContent.trim())
                        return;
               
                 /// add color for proccessed links
                 if (configs.changeColorForProccessedLinks)
                    highlightProccessedLink(el)

                timeoutToShowPopup = setTimeout(function () {
                    if (!lastHoveredLink) return;
    
                    if (configs.debugMode) console.log('trying to get info for ' + hoveredUrl);

                    /// check url
                    let hoveredUrl = el.getAttribute('href') || el.getAttribute('data-url') || (el.parentNode && (el.parentNode.getAttribute('href') || el.parentNode.getAttribute('data-url')));
                    if (hoveredUrl[0] == '#') hoveredUrl = window.location.href + hoveredUrl;
                    if (!hoveredUrl.includes('://') && !hoveredUrl.includes('mailto:')) hoveredUrl = 'https://' + window.location.href.split('/')[2] + hoveredUrl;
    
                    if (cachedData[hoveredUrl]) {
                        /// Grab previously cached reponse
                        hideTooltip();
                        tooltipShown = true;
                        showTooltip(el, cachedData[hoveredUrl], lastMouseMoveDx);
                    } else {
                        /// Set loading cursor
                        if (configs.changeCursorToLoading)
                            setLoadingCursor(el)
    
                        /// Fetch response via JavaScript
                        chrome.runtime.sendMessage({ actionToDo: 'fetchLinkInfo', url: hoveredUrl }, (response) => {
                            if (!lastHoveredLink) return;
    
                            if (configs.changeCursorToLoading) disableLoadingCursor(el)
    
                            if (!response) {
                                if (configs.showOnlyUrlWhenNoData == false) return;
    
                                /// When no result, show dummy tooltip only with favicon and url
                                const dummyData = {
                                    'url': hoveredUrl,
                                    'favicons': [
                                        faviconFetchUrl + hoveredUrl.split('/')[2]
                                    ]
                                };
    
                                cachedData[hoveredUrl] = dummyData;
                                showTooltip(el, dummyData, lastMouseMoveDx);
                                tooltipShown = true;
                                return;
                            }
    
                            if (configs.debugMode) {
                                console.log('fetched link info:');
                                console.log(response);
                            }
    
                            cachedData[hoveredUrl] = response;
                            hideTooltip();
                            tooltipShown = true;
                            showTooltip(el, response, lastMouseMoveDx);
                        });
                    }
                }, configs.hoverDelay);
            } else {
                if (configs.debugMode && lastHoveredLink) console.log('leaved link');
                onHideTooltip(el);
            }
        }, configs.mouseMoveDebounceTimeout)
    }, false);
}

function showTooltip(linkEl, data, dx) {
    const tooltip = document.createElement('div');
    tooltip.className = 'link-tooltip';

    /// prepare reveal animation when position set over link
    const showTooltipOverLink = configs.tooltipPosition == 'overLink';
    if (showTooltipOverLink) {
        tooltip.classList.add('initial-tooltip');
    }

    /// show tooltip on side
    if (configs.thumbnailOnSide) {
        tooltip.classList.add('thumbnail-on-side');
    }

    /// thumbnail
    let thumbnail;
    if (configs.showThumbnail && data.images && data.images[0]) {
        thumbnail = document.createElement('img');
        thumbnail.className = 'thumbnail top-thumbnail';
        thumbnail.height = '150px';
        thumbnail.src = data.images[0];
        tooltip.appendChild(thumbnail);

        thumbnail.addEventListener('load', function (ev) {
            if (thumbnail.naturalWidth > thumbnail.naturalHeight && thumbnail.naturalWidth / thumbnail.naturalHeight > 1.5)
                thumbnail.classList.add('stretched-thumbnail');
        });

        thumbnail.addEventListener('error', function () {
            thumbnail.remove();
        });
    }

    /// title
    const header = document.createElement('div');
    header.className = 'tooltip-header';

    if (data.title && data.title[0] && data.title !== 'Blocked') {
        const title = document.createElement('p');
        title.className = 'title limited-lines-text';
        title.innerText = data.title.trim();
        header.appendChild(title);
    }

    /// add favicon
    if (data.favicons && data.favicons[0]) {
        const favicon = document.createElement('img');
        favicon.className = 'page-favicon';
        favicon.height = '16px';
        favicon.src = data.favicons[0];
        header.appendChild(favicon);

        /// placeholder icon
        favicon.addEventListener('error', function () {
            // favicon.src = 'link.svg';
            favicon.src = faviconFetchUrl + data.url.split('/')[2];
        });
    }

    /// add page url
    const url = document.createElement('p');
    url.className = 'url limited-lines-text';

    let fullUrl = data.url.replace('https://', '').replace('http://', '');
    if (fullUrl.slice(-1) == '/') fullUrl = fullUrl.slice(0, -1);
    const domainText = fullUrl.split('/')[0];
    const domain = document.createElement('span');
    domain.className = 'domain';
    domain.innerText = domainText;
    url.appendChild(domain);

    const restOfurl = document.createElement('span');
    restOfurl.innerText = fullUrl.replace(domainText, '');
    restOfurl.className = 'sub-url';
    url.appendChild(restOfurl);
    header.appendChild(url);

    /// add description
    if (configs.showDescription && data.description) {
        const description = document.createElement('p');
        description.className = 'description limited-lines-text';
        description.textContent = data.description.trim();
        header.appendChild(description);
    }

    tooltip.appendChild(header);

    /// calculate position
    const linkRect = linkEl.getBoundingClientRect();
    const screenEdgeMargin = '10px';
    
    switch(configs.tooltipPosition){
        case 'overLink': {
            tooltip.style.top = `${linkRect.top - 8.5}px`;
            tooltip.style.left = dx ? `${dx}px` : `${linkRect.left + (linkRect.width / 2)}px`;
        } break;
        case 'bottomLeft': {
            tooltip.style.bottom = '20px'; /// more padding because of browser's url tooltip
            tooltip.style.left = screenEdgeMargin;
        } break;
        case 'bottomRight': {
            tooltip.style.bottom = screenEdgeMargin;
            tooltip.style.right = screenEdgeMargin;
        } break;
        case 'topRight': {
            tooltip.style.top = screenEdgeMargin;
            tooltip.style.right = screenEdgeMargin;
        } break;
        case 'topLeft': {
            tooltip.style.top = screenEdgeMargin;
            tooltip.style.left = screenEdgeMargin;
        } break;
    }

    /// add tooltip arrow
    const arrow = document.createElement('div');
    if (showTooltipOverLink){
        arrow.setAttribute('class', 'tooltip-arrow arrow-on-top');
        tooltip.appendChild(arrow);
    }

    /// reveal tooltip
    tooltip.style.opacity = 0;
    document.body.appendChild(tooltip);

    /// check if tooltip will go off-screen on top – if yes, move below link
    const dyOverflowed = linkRect.top - 7.5 - tooltip.clientHeight < 0;
    if (showTooltipOverLink){
        if (dyOverflowed) {
            tooltip.style.top = `${linkRect.top + linkRect.height + 11}px`;
            tooltip.classList.remove('initial-tooltip');
            tooltip.classList.add('initial-tooltip-bottom');
    
            arrow.classList.remove('arrow-on-top');
            arrow.classList.add('arrow-on-bottom');
    
            if (thumbnail && !configs.thumbnailOnSide) {
                const newThumbnail = thumbnail.cloneNode();
                thumbnail.remove();
                newThumbnail.classList.remove('top-thumbnail');
                newThumbnail.classList.add('bottom-thumbnail');
                tooltip.appendChild(newThumbnail);
            }
        }
    
        /// Check tooltip to overflow on the left
        const tooltipRect = tooltip.getBoundingClientRect();
        if (tooltipRect.left < 0) {
            tooltip.style.left = `${dx + (-1 * tooltipRect.left) + 5}px`;
            arrow.style.marginLeft = `${tooltipRect.left}px`;
        }
    }
   
    setTimeout(function () {
        tooltip.style.transition = `transform ${configs.transitionDuration}ms ease, opacity ${configs.transitionDuration}ms ease`;
        tooltip.style.opacity = 1;

        if (showTooltipOverLink){
            tooltip.classList.add(dyOverflowed ? 'revealed-tooltip-bottom' : 'revealed-tooltip');
        }
    }, 1);
    return tooltip;
}

function onHideTooltip(el){
    if (tooltipShown) {
        tooltipShown = false;
        hideTooltip();  
    }

    if (lastHoveredLink){
        if (configs.changeColorForProccessedLinks)
            unhighlightProccessedLink(lastHoveredLink)
        lastHoveredLink = false;
    }

    clearTimeout(timeoutToShowPopup);
    if (configs.changeCursorToLoading) disableLoadingCursor(el ?? lastHoveredLink)
}

function hideTooltip() {
    document.querySelectorAll('.link-tooltip').forEach(function (tooltip) {
        tooltip.style.opacity = 0;

        setTimeout(function () {
            tooltip.remove();
        }, configs.transitionDuration);
    });
}

function setLoadingCursor(el){
    if (el && el.classList)
        el.classList.add('loading-cursor');
}

function disableLoadingCursor(el){
    if (el && el.classList)
        el.classList.remove('loading-cursor');
}

function highlightProccessedLink(el){
    if (el && el.classList)
        el.classList.add('link-tooltip-processing');
}

function unhighlightProccessedLink(el){
    if (el && el.classList)
        el.classList.remove('link-tooltip-processing');
}