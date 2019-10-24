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
module.exports = {

  name: "getvehiclebyid",
  oauth: "mydaimlerprovider",
  title: "Getvehiclebyid",

  description: "",
  version: "v1",

  input:{
    title: "Getvehiclebyid",
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
      vehicle : {
        title: "vehicle",
        type: "object",
        properties: {
          id:{
            title: "id",
            displayTitle: "vehicle id",
            type: "string"
            },
          licenseplate:{
            title: "licenseplate",
            displayTitle: "The license plate of the vehicle.",
            type: "string"
            },
          salesdesignation:{
            title: "salesdesignation",
            displayTitle: "The sales designation of the vehicle.",
            type: "string"
            },
          finorvin:{
            title: "finorvin",
            displayTitle: "The FIN or VIN of the vehicle.",
            type: "string"
            },
          nickname:{
            title: "nickname",
            displayTitle: "Name of the vehicle.",
            type: "string"
            },
          modelyear:{
            title: "modelyear",
            displayTitle: "The model year.",
            type: "string"
            },
          colorname:{
            title: "colorname",
            displayTitle: "The color name.",
            type: "string"
            },
          fueltype:{
            title: "fueltype",
            displayTitle: "The type of fuel.",
            type: "string"
            },
          powerhp:{
            title: "powerhp",
            displayTitle: "The power of the vehicle in HP unit.",
            type: "string"
            },
          powerkw:{
            title: "powerkw",
            displayTitle: "The power of the vehicle in KW unit.",
            type: "string"
            },
          numberofdoors:{
            title: "numberofdoors",
            displayTitle: "The number of doors the vehicle has.",
            type: "string"
            },
          numberofseats:{
            title: "numberofseats",
            displayTitle: "The number of seats the vehicle has.",
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
	var request = require("request");
	var settings = require('../../settings.json');
    var options = {
      "method": "get",
      "url": settings.api_base_url + "/vehicles/" + input.vehicleId,
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
            body.vehicle = body.data;
            delete body.data;
            delete body.success;;
            delete body.status;
            return output(null, body);
            //return output(null, { data : "OK_Version02"});
        }
        output(body);

      })
      //output(null, { data : "OK_Version01"});
    }

}
