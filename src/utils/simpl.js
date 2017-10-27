const config = require('../config');

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

function getRootDomain(url) {
    // from https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 1].length === 2 && splitArr[arrLen - 1].length === 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

function createSlug(storyId, hashtag){
    var crypto = require('crypto');
    var hash = crypto.createHash('md5').update('hindustani'+storyId).digest("hex");
    var slug = '#'+hashtag+hash;
    return slug;
}

function getShareUrl(urlSlug){
    var url = encodeURIComponent(config.apiRoot + '/view/' + urlSlug);
    return url;
}

module.exports.getRootDomain = getRootDomain;
module.exports.extractHostname = extractHostname;
module.exports.createSlug = createSlug;
module.exports.getShareUrl = getShareUrl;