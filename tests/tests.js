/**
 * Created by jjohnson on 12/13/13.
 */

var should = require("should");
var OomnitzaNode = require("../lib/oomnitza-node.js");
var oom = new OomnitzaNode("domain", "user", "pass");
var checking = function(str) {
    process.stdout.write("Checking " + str + "() ");
}
var log = function(str) {
    process.stdout.write(str + "\n");
}

var ok = function() {
    process.stdout.write("OK!" + "\n");
}

log("Starting test suite...");

var now = new Date().valueOf();
var newUserId, newLocationId;

var newProfile = {
    user: "tmcgee",
    password: "superPass1",
    first_name: "Timothy",
    last_name: "McGee",
    email: "tmcgee@ncis.navy.mil",
    phone: "123-456-7890",
    address: "6 Navy Yard, Washington DC",
    position: "Field Agent",
    permissions_id: 30
};

var newLocation = {
    location_id: "T" + now,
    label: "Test Label " + now,
    "781D57E806F311E39B9C525400385B84": "California",
    asset_total: 100
}

function main() {
    oom.addUser(newProfile, function(d) {
        checking("addUser");
        d.should.have.property("success", true);
        newUserId = d.resp.id;
        ok();
        doStuffWithNewUser();
    });
    oom.addLocation(newLocation, function(d) {
        checking("addLocation");
        d.should.have.property("success", true);
        var resp = d.resp;
        resp.should.have.property("id");
        newLocationId = d.resp.id;
        ok();
        doStuffWithLocation();
    });
    oom.getLocationFields(function(d) {
        checking("getLocationFields");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("info").instanceof(Array);
        ok();
    });
    oom.getPerms(function(d) {
        checking("getPerms");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("rows");
        ok();
    });
}

function doStuffWithNewUser() {
    
}

function doStuffWithLocation() {
    oom.getLocation(newLocationId, function(d) {
        checking("getLocation");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("info").instanceof(Array);
        ok();
    });
    
}

function deleteEverything() {
    oom.delLocation(newLocationId, function(d) {
        checking("delLocation");
        d.should.have.property("success", true);
        ok();
    });
    
    oom.delUser(newUserId, function(d) {
        checking("delUser");
        d.should.have.property("success", true);
        ok();
    });
}

oom.on("initialized", function() {
	main();
});
setTimeout(deleteEverything, 5000);
