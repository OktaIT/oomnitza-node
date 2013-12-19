oomnitza-node
=============

A small NodeJS framework for working with the [Oomnitza](http://www.oomnitza.com/) API

# Overview
This API is a small layer that handles talking to the Oomnitza API. Primarily:
- Maps function calls to their correct Oomnitza endpoints
- Formats the body and queries of arguments passed to the Oomnitza endpoint
- Aids in creating or updating entities in the format the Oomnitza endpoint expects

This document will refer to itself as "this API" and the Oomnitza API as simply, "Oomnitza".

# Usage
To get started, you MUST have an already existing account with Oomnitza.  Currently a [trial account](https://wiki.oomnitza.com/wiki/Signing_Up_for_Trial_Access) will suffice. 
You should also need to familiarize yourself with how Oomnitza responds to programmatic requests. You can do so [here](https://wiki.oomnitza.com/wiki/REST_API).

```node
var OomnitzaNode = require("oomnitza-node");
var oom = new OomnitzaNode("yourDomain", "yourUser", "yourPass");
```

Note that all calls to Oomnitza are returned in the following format:
```JSON
{
    success: true
    resp: {
        <json object from Oomnitza>
    }
}
```

If something went wrong while attempting to make a request to Oomnitza, success will be false.
The errors will be inside of resp.errors array, provided by Oomnitza.

The "resp" property MAY NOT exist if this API is unable to contact Oomnitza. If this is the case,
the "error" property will be set to a string with the error message.

# Disclaimer & License
Please be aware that all material published under the [OktaIT](https://github.com/OktaIT/) project have been written by the [Okta](http://www.okta.com/) IT Department but are NOT OFFICAL software release of Okta Inc.  As such, the software is provided "as is" without warranty or customer support of any kind.

This project is licensed under the MIT license, for more details please see the LICENSE file.
