
/**
 * Created by jjohnson on 12/9/13.
 */

var https = require("https");
var url = require("url");
var request = require("request");
var hostname, apiKey;

function NetworkAbstraction(retrievedApiKey, domain) {
    hostname = domain;
    hostname += ".oomnitza.com";
    apiKey = retrievedApiKey;
    request = request.defaults({
            headers: {'Content-Type': "application/x-www-form-urlencoded"},
            method: "POST",
            strictSSL: false
        }
    );
}

NetworkAbstraction.prototype.post = function(where, what, query, callback) {
    sendHttpReq("POST", where, what, query, callback);
}

NetworkAbstraction.prototype.postRaw = function(where, what, query, callback) {
    var opts = {};
    if(what != undefined) opts.body = what;
    opts.uri = url.parse("http://" + hostname + "/" + where);
    opts.method = "POST";
    opts.strictSSL = false;
    opts.qs = {access_token: apiKey};
    if (query != undefined) for(prop in query) opts.qs[prop] = query[prop];
    var specialRequest = require("request");
    specialRequest(opts, function(error, clientResp, resp) { handleResponse(error, resp, callback) });
}

var sendHttpReq = function(method, where, what, query, callback) {
    var opts = {};
    if(what == undefined) opts.body = "";
    else opts.body = what;
    opts.uri = url.parse(constructURL(where));
    opts.qs = {access_token: apiKey};
    if (query != undefined) for(prop in query) opts.qs[prop] = query[prop];
    request(opts, function(error, clientResp, resp) { handleResponse(error, clientResp, resp, callback) });
}

function handleResponse(error, clientResp, resp, callback) {
    if(callback == undefined) return;
    if(error) {
        callback({error: error, success: false});
    } else {
        var jsonResp;
        try {
            jsonResp = JSON.parse(resp);
        } catch(err) {
            callback({success: false, error: "Returned JSON is invalid", resp: resp});
        }
        if (jsonResp.errors.length > 0) {
            callback({success: false, resp: jsonResp});
        } else {
            callback({success: true, resp: jsonResp});
        }
    }
}

function constructURL(what) {
    return "https://" + hostname + "/api/" + what;
}

module.exports = NetworkAbstraction;