/*******************************************************************************

    AdNauseam Lite - a comprehensive, MV3-compliant content blocker
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

// adnauseam

// Important!
// Isolate from global scope
(function uBOL_cssGenericImport() {

/******************************************************************************/

const genericSelectorMap = [[3609,"#gwd-ad"],[2947,"ins.adsbygoogle"],[281,".mv-ad-box"],[3022,".bstn-ad-rail--expanded.bstn-ad-rail"],[2228,"#google_image_div"],[682,"#mys-content"],[3872,".premium-promo--wrapper"],[3123,".GoogleActiveViewClass"],[2820,".promotion-carousel"],[2091,".home-page.has-ad-space.container-fluid > .upper.row > .hidden-print.vertical-offset-5 > .mtseventwentyeight > a[href^=\"/en/p/plans\"] > img[src=\"/img/upper_02.gif\"]"],[1719,".AdBanner,\n#psadbox"],[901,"#pnlStripBanner"],[2292,".carbon-wrap"],[3232,".carbon-poweredby"],[937,".head-ad"],[647,".sinaad-toolkit-box"],[1020,".ad-imax"],[2834,".search-aside-adWrap"],[2444,"bing.com"],[1492,".gqsvbds-single"],[2034,".imgBannerLink"],[2532,".compound-ad-unit"],[944,".ad-top-banner"],[3673,".ad-container"],[3258,".collapsed-ad"],[78,".image_block[href*=\"https://shapelcounset.xyz\"]"],[385,".product-box:has(.cropped-image-intermedia-box)"],[1522,"#paidPostDriver-Container"],[2135,".posterImage-link"],[799,".ads-column-container"],[1225,".ad .contentImg"],[2628,".alignClickable[onclick*=\"adclick\"]:has(.imageholder)"],[1986,".mediago-placement-track:has(#mg-img)"]];
const genericExceptionSieve = [3597,3757,715,2773,371,1855,75,185,1971,1319,1018];
const genericExceptionMap = [["si.com",".mobile-ad\n.cm-ad"],["stackoverflow.com",".adsbox"],["mac-torrent-download.net",".ad-box"],["myip.com",".ads_1"],["youtube.com",".sparkles-light-cta"],["bluemedialink.online","#ads-left\n#ads-right\n#ads-center"],["dailymotion.com",".ad_box"],["old.reddit.com","a.outbound[data-outbound-url]"]];

if ( genericSelectorMap ) {
    const map = self.genericSelectorMap =
        self.genericSelectorMap || new Map();
    if ( map.size !== 0 ) {
        for ( const entry of genericSelectorMap ) {
            const before = map.get(entry[0]);
            if ( before === undefined ) {
                map.set(entry[0], entry[1]);
            } else {
                map.set(entry[0], `${before},\n${entry[1]}`);
            }
        }
    } else {
        self.genericSelectorMap = new Map(genericSelectorMap);
    }
    genericSelectorMap.length = 0;
}

if ( genericExceptionSieve ) {
    const hashes = self.genericExceptionSieve =
        self.genericExceptionSieve || new Set();
    if ( hashes.size !== 0 ) {
        for ( const hash of genericExceptionSieve ) {
            hashes.add(hash);
        }
    } else {
        self.genericExceptionSieve = new Set(genericExceptionSieve);
    }
    genericExceptionSieve.length = 0;
}

if ( genericExceptionMap ) {
    const map = self.genericExceptionMap =
        self.genericExceptionMap || new Map();
    if ( map.size !== 0 ) {
        for ( const entry of genericExceptionMap ) {
            const before = map.get(entry[0]);
            if ( before === undefined ) {
                map.set(entry[0], entry[1]);
            } else {
                map.set(entry[0], `${before}\n${entry[1]}`);
            }
        }
    } else {
        self.genericExceptionMap = new Map(genericExceptionMap);
    }
    genericExceptionMap.length = 0;
}

/******************************************************************************/

})();

/******************************************************************************/
