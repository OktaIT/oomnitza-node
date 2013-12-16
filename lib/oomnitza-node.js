/**
 * Created by jjohnson on 12/12/13.
 */

module.exports = OomnitzaNode;

var NetworkAbstraction = require("./NetworkAbstraction.js");
var StringBuilder = require("OktaCommons").StringBuilder;
var EventEmitter = require("events").EventEmitter;
require('util').inherits(OomnitzaNode, EventEmitter);

function OomnitzaNode(domain, user, pass) {

    /*
     * Private fields
     */
    this.request = undefined; // Will house the NetworkAbstraction once we set it up
    /*
     * Private methods for setup of the API
     */
    this.initialize = function(domain, user, pass) {
        var request = require('request');
        var url = require('url').parse('https://' + domain + '.oomnitza.com/api/request_token');
        var opts = {};
        opts.method = "POST";
        opts.url = url;
        opts.qs = {login: user, password: pass};
        opts.form = true;
        opts.strictSSL = false;
        var that = this;
        request(opts, function(error, clientResp, resp) {
            if(error) throw new Error("Unable to initialize Oomnitza API: " + error);
            var jsonResp;
            try {
                jsonResp = JSON.parse(resp);
            } catch (error) {
                // Rethrow since we can't really save ourselves
                throw new Error("Unable to initialize Oomnitza API: Invalid JSON from Oomnitza\nInvalid JSON: " + resp);
            }
            that.bake(jsonResp.token);
        });
    }

    this.bake = function(apiKey) {
        this.request = new NetworkAbstraction(apiKey, domain);
        this.emit("initialized");
    }

    /*
     * Constructor code
     */

    this.initialize(domain, user, pass);
}

/**
 * Log out of the Oomnitza service
 * TODO: Figure out what effect this has on the API key, if any
 * @method logout
 * @param callback
 */
OomnitzaNode.prototype.logout = function(callback) {
    this.request.postRaw("service/logout", null,  null, callback);
}

/*
 * Oomnitza User Management
 * https://wiki.oomnitza.com/wiki/REST_API#User_Management @ Dec 13, 2013
 */
/**
 * Get this token's access from Oomnitza
 * @method getPerms
 * @param callback
 */
OomnitzaNode.prototype.getPerms = function(callback) {
    this.request.post("people/permissions/blocks", null, null, callback);
}

/**
 * Add a user to your Oomnitza
 * @method addUser
 * @param profile a key->value map of fields in your Oomnitza. Required fields varies per Oomnitza instance
 * @param callback
 */
OomnitzaNode.prototype.addUser = function(profile, callback) {
    if(profile == undefined) throw new Error("Profile mustn't be empty when creating a new user");
    var sb = new StringBuilder("&");
    for(prop in profile) sb.append("output[" + prop.toUpperCase() + "]=" + profile[prop]);
    this.request.post("people/individuals/add", sb.toString(), null, callback);
}

/**
 * Delete a user from Oomnitza
 * @method delUser
 * @param username
 * @param callback
 */
OomnitzaNode.prototype.delUser = function(username, callback) {
    if(username == undefined) throw new Error("Username is required when deleting a user");
    var body = "ids[]=" + username;
    this.request.post("people/individuals/delete", body, null, callback);
}

/*
 * Oomnitza Location Management
 * https://wiki.oomnitza.com/wiki/REST_API#Location_Management @ Dec 13, 2013
 */
/**
 * Get a list of locations in Oomnitza
 * @method getLocationFields
 * @param callback
 */
OomnitzaNode.prototype.getLocationFields = function(callback) {
    this.request.post("assets/locations/empty_location", null, null, callback);
}

/**
 * Adds a location to your Oomnitza
 * @method addLocation
 * @param profile a key->value store of the required fields to add a location
 * @param callback
 */
OomnitzaNode.prototype.addLocation = function(profile, callback) {
    if(profile == null) throw new Error("Location profile must not be empty when creating a new location entry");
    var sb = new StringBuilder("&");
    for(prop in profile) sb.append("output[" + prop.toUpperCase() + "]=" + profile[prop]);
    this.request.post("assets/locations/add_location", sb.toString(), null, callback);
}

/**
 * Gets a location by ID
 * @method getLocation
 * @param id the ID of the location we want
 * @param callback
 */
OomnitzaNode.prototype.getLocation = function(id, callback) {
    if(id == undefined) throw new Error("ID required when getting a location");
    this.request.post("assets/locations/get_info", "id=" + id, null, callback);
}

/**
 * Not yet implemented
 * @method findLocation
 */
OomnitzaNode.prototype.findLocation = function() {
    // TODO Oomnitza does not have any documentation in this respect; figure it out
    throw new Error("Not yet implemented");
}

OomnitzaNode.prototype.delLocation = function(id, callback) {
    // Note: I'm aware that this appears to support multiple deletions in one, Oomnitzas docs don't specify it -JJ
    if(id == undefined) throw new Error("ID is required when removing a location");
    this.request.post("assets/locations/delete_location", "ids[]=" + id, null, callback);
}
/*
 * Oomnitza Field Management
 * https://wiki.oomnitza.com/wiki/REST_API#Field_Management @ Dec 13, 2013
 */
OomnitzaNode.prototype.addField = function(profile, callback) {
    if(profile == undefined) throw new Error("Profile required to add a field");
    var sb = new StringBuilder("&");
    for(prop in profile) sb.append("output[" + prop.toUpperCase() + "]=" + profile[prop]);
    this.request.post("assets/customization/add_field", sb.toString(), null, callback);
}

OomnitzaNode.prototype.delField = function(id, callback) {
    if(id == undefined) throw new Error("ID required when deleting a field");
    this.request.post("assets/customization/delete_fields", "ids[]=" + id, null, callback);
}

/*
 * Oomnitza Asset Management
 * https://wiki.oomnitza.com/wiki/REST_API#Asset_Management @ Dec 13, 2013
 */

OomnitzaNode.prototype.getAssetFields = function(callback) {
    this.request.post("assets/assets/empty", null, null, callback);
}

OomnitzaNode.prototype.addAsset = function(profile, callback) {
    if(profile == undefined) throw new Error("A profile is required when adding an asset");
    var sb = new StringBuilder("&");
    for(prop in profile) sb.append("output[" + prop.toUpperCase() + "]=" + profile[prop]);
    this.request.post("assets/assets/add", body, null, callback);
}

OomnitzaNode.prototype.getAsset = function(id, callback) {
    if(id == undefined) throw new Error("ID is required when getting an asset");
    this.request.post("assets/assets/info", "id=" + id, null, callback);
}

OomnitzaNode.prototype.findAsset = function() {
    // TODO Oomnitza does not have any documentation in this respect; figure it out
    throw new Error("Not yet implemented");
}

OomnitzaNode.prototype.delAsset = function(id, callback) {
    if(id == undefined) throw new Error("ID is required when removing an asset");
    this.request.post("assets/assets/delete", "ids[]=" + id, null, callback);
}