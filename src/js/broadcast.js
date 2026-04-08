/*******************************************************************************

    uBlock Origin - a comprehensive, efficient content blocker
    Copyright (C) 2014-present Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

// Service Worker fallback: Ensure vAPI exists before any code uses it
(function() {
    if (globalThis.vAPI instanceof Object && globalThis.vAPI.uBO === true) {
        // OK
    } else {
        globalThis.vAPI = { 
            uBO: true, 
            chrome: true,
            tabs: { query: () => Promise.resolve([]) },
            net: { handlerBehaviorChanged: () => {} },
            Net: { canSuspend: () => false },
            storage: { QUOTA_BYTES: 10485760 },
            webRequest: { MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES: 20 },
            defer: {
                create: (callback) => {
                    const fns = [];
                    const flush = () => { for (const fn of fns) { fn(); } fns.length = 0; };
                    return { now: fns.push(callback) !== 0, on: () => { flush(); }, off: () => { flush(); } };
                }
            }
        };
    }
})();

import webext from './webext.js';
import { makeCloneable } from './adn/adn-utils.js'; // ADN

/******************************************************************************/

// Broadcast a message to all uBO contexts

let broadcastChannel;

export function broadcast(message) {
    if (message.what === 'notifications') { // ADN
        makeCloneable(message.notifications); // #1163
    }
    if ( broadcastChannel === undefined ) {
        broadcastChannel = new self.BroadcastChannel('uBO'); // AdNauseam change (uBO -> ADN)
    }
    broadcastChannel.postMessage(message);
}

/******************************************************************************/

// Broadcast a message to all uBO contexts and all uBO's content scripts

export async function broadcastToAll(message) {
    broadcast(message);
    const tabs = await globalThis.vAPI.tabs.query({
        discarded: false,
    });
    const bcmessage = Object.assign({ broadcast: true }, message);
    for ( const tab of tabs ) {
        webext.tabs.sendMessage(tab.id, bcmessage).catch(( ) => { });
    }
}

/******************************************************************************/

export function onBroadcast(listener) {
    const bc = new self.BroadcastChannel('uBO'); // AdNauseam change (uBO -> ADN)
    bc.onmessage = ev => listener(ev.data || {});
    return bc;
}

/******************************************************************************/

export function filteringBehaviorChanged(details = {}) {
    if ( typeof details.direction !== 'number' || details.direction >= 0 ) {
        filteringBehaviorChanged.throttle.offon(727);
    }
    broadcast(Object.assign({ what: 'filteringBehaviorChanged' }, details));
}

// Guard: Ensure vAPI.defer exists (may not be set up yet in Service Worker)
if (globalThis.vAPI && globalThis.vAPI.defer === undefined) {
    globalThis.vAPI.defer = {
        create: (callback) => {
            const fns = [];
            const flush = () => { for (const fn of fns) { fn(); } fns.length = 0; };
            return { now: fns.push(callback) !== 0, on: () => { flush(); }, off: () => { flush(); } };
        }
    };
}

filteringBehaviorChanged.throttle = globalThis.vAPI.defer.create(( ) => {
    const { history, max } = filteringBehaviorChanged;
    const now = (Date.now() / 1000) | 0;
    if ( history.length >= max ) {
        if ( (now - history[0]) <= (10 * 60) ) { return; }
        history.shift();
    }
    history.push(now);
    globalThis.vAPI.net.handlerBehaviorChanged();
});
filteringBehaviorChanged.history = [];
filteringBehaviorChanged.max = Math.min(
    (globalThis.vAPI.webRequest && globalThis.vAPI.webRequest.MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES) - 1 ||
    (browser.webRequest && browser.webRequest.MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES) - 1 ||
    19,
    19
);

/******************************************************************************/
