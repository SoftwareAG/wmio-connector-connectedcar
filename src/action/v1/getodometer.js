/*
* Copyright (c) 2019 Software AG, Darmstadt, Germany and/or its licensors
*
* SPDX-License-Identifier: Apache-2.0
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var request = require("request");
var settings = require('../../settings.json');
var moment = require("moment");

module.exports = {

  name: "getodometer",
  oauth: 'daimler',
  title: "Getodometer",

  description: "",
  version: "v1",

  input:{
    title: "Getlocation",
    type: "object",
    properties: {
      vehicleId:{
        title: "vehicleId",
        displayTitle: "vehicle id",
        type: "string"
      }
    }
  },

  output: {
    title: "output",
  	type: "object",
    properties: {
      location : {
        title: "odometer",
        type: "object",
        properties: {
          value:{
            title: "value",
            displayTitle: "value",
            type: "double"
          },
          unit:{
            title: "unit",
            displayTitle: "unit",
            type: "string"
          },
          timestamp:{
            title: "timestamp",
            displayTitle: "timestamp",
            type: "number"
          },
          time:{
            title: "time",
            displayTitle: "time",
            type: "string"
          }
        }
      }
    }
  },

  mock_input:{},

  execute: function(input, output){
    // to access auth info use input.auth , eg: input.auth.username
    // and to return output use output callback like this output(null, { 'notice' : 'successful'})
    // your code here
    var options = {
      "method": "get",
      "url": settings.api_base_url + "/vehicles/" + input.vehicleId + "/odometer",
      "headers": {
          "Accept": "application/json",
          "Authorization": "Bearer " + input.auth.access_token
      }
     }
    request(options, function(err, response, body) {
        if (err) {
            return output(err);
        }
        try {
            if (body && typeof(body) === "string") {
                body = JSON.parse(body);
            }
        } catch (e) {
            return output(body);
        };
        if (response.statusCode === 401) {
            return output("Invalid access token");
        }
        if (response.statusCode !== 200) {
            return output(body.status.errorDetails);
        }
        if (response.statusCode === 200) {
            //var result;
            //result = JSON.stringify(body);
            var timeRS = moment.unix(body.odometer.timestamp).format("YYYY-MM-DDTHH:mm:ss.SSS+00:00") 
            return output(null, {
              value : body.odometer.value,
              unit : body.odometer.unit,
              timestamp : body.odometer.timestamp,
              time : timeRS,
            });
        }
        output(body);

      })
    }

}
