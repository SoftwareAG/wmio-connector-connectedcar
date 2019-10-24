# wmio-connector-connectedcar
This sample demonstrates how to build a custom connector for wmio. It includes as well an E2E scenario, where this connector is used.

The E2E scenario demonstrate how webMethods.io and Cumulocity can be used to build a fleetmanagment. The simulator of the Daimler Connecte Vehicle site simulates a daimer car.
The reference data of the car as as the dynamic data: fuel status, location, mileage can be tramsmitted to Cumulocity IoT. The integration between these two API is achieved using the webMethoods.io platform.
The E2E scenario is as follows: ![E2E](https://github.com/SoftwareAG/wmio-connector-connectedcar/blob/master/resources/E2E_complete_V01.png)  

The connector call the connected vehicleexperimental API. This API is secured with OAuth 2.0. Therefore a oauth2 provider needs to be created. The specific documentation on how this works is availalble under: https://developer.mercedes-benz.com/apis/connected_vehicle_experimental_api/docs#_authentication

## wmio Integration flows

### Create vehicle

The relevant integration flow to create a vehicle in cumulocity IoT looks as follows. This flow uses the following connectors:
1. Cumulocity CreateVehicle:
    1. Step 1: Select Functional Area: Inventory
    2. Step 2: Select the Operation: Select the Operation
2. Cumulocity UpdateExternalId:
    1. Step 1: Select Functional Area: Identity
    2. Step 2: Select the Operation: Create an External ID
3. Connected Car:
    1. Getvehicles
    2. Getvehiclesbyid

![Integration flow](https://github.com/SoftwareAG/wmio-connector-connectedcar/blob/master/resources/E2E_create_car_V01.png)

### Update location

The relevant integration flow to update the location in cumulocity IoT looks as follows. This flow uses the following connectors:
1. Cumulocity GetIdByExternalId :
    1. Step 1: Select Functional Area: Identity
    2. Step 2: Select the Operation: Get An External ID
1. Cumulocity Update Location:
    1. Step 1: Select Functional Area: Events
    2. Step 2: Select the Operation: Create an new event.
2. Connected Car Getlocation:
    1. Getlocation  

![Integration flow](https://github.com/SoftwareAG/wmio-connector-connectedcar/blob/master/resources/E2E_update_location_V01.png)

### Update odometer (mileage)

The relevant integration flow to update the mileage in cumulocity IoT looks as follows. This flow uses the following connectors:
1. Cumulocity GetIdByExternalId :
    1. Step 1: Select Functional Area: Identity
    2. Step 2: Select the Operation: Get An External ID
1. Cumulocity CreateOdometerMeasurement:
    1. Step 1: Select Functional Area: Measurements
    2. Step 2: Select the Operation: Create an new measurement.
2. Connected Car Getodometer:
    1. Getodometer  

![Integration flow](https://github.com/SoftwareAG/wmio-connector-connectedcar/blob/master/resources/E2E_update_odometer_V01.png)

The integration flow is triggered through a webhook:
![Integration flow](https://github.com/SoftwareAG/wmio-connector-connectedcar/blob/master/resources/E2E_update_odometer_webhook_V02.png)

>NOTE: Since the vehicle simulation needs to be updated in a shorter frequency than 5 minutes (minimum for wmio standard scheduled trigger) an external phython script is provided https://github.com/SoftwareAG/wmio-connector-connectedcar/blob/master/resources/trigger_update.py . This script triggers the webhooks every 20 seconds.

## Account for E2E Scenario
1. Register for Cumulocity IoT account: https://www.softwareag.cloud/site/index.html#/
2. Register for webMethods.io integration account: https://www.softwareag.cloud/site/index.html#/
3. Register for an developer account to use the Daimler Connected Vehicle (experimental) API: https://developer.mercedes-benz.com/

## Create App in Daimler API console
1. Login to https://developer.mercedes-benz.com/
2. Open console: https://developer.mercedes-benz.com/console
3. Register your app and `Client ID` and ` Client Secret`. Leave the field ` Redirect URLs` empty. This needs to be filled out whit information generated in a later step.

The following screenshot shows the UI in the daimler developer portal:
![Developer Console](https://github.com/SoftwareAG/wmio-connector-connectedcar/blob/master/resources/E2E_console_app_V02.png)

## Create simulation Daimler car simulator
1. After login access simulator: https://car-simulator.developer.mercedes-benz.com
2. Define simulation for your vehicle, as shown below:
![Integration flow](https://github.com/SoftwareAG/wmio-connector-connectedcar/blob/master/resources/E2E_simulator_V02.png)


## Build an upload connector in webMethods.io

The connector allows the following actions:
1. getlocation: For getting the latest location of an vehicle by id
2. getodometer: For getting the latest mileage of an vehicle by id
3. getvehiclebyid: For getting the reference data (name, model, ...) of an vehicle by id
4. getvehicles: For getting the list of all vehicles (simulator only lets you generate one vehicle)
These actons are to used in the E2E workflow in webmethios.io.

### Install wmio cli
Chech out information for npm modul wmiocli: https://www.npmjs.com/package/@webmethodsio/wmiocli and install modul

```
>npm i @webmethodsio/wmiocli -g
```

### Login to wmio
```
>wmio login
Enter Tenant URL eg: (https://wmiodemo.webmethods.io): https://YOUR:WEBMETHODS.IO-URL
Enter Email: E_MAIL
Enter Developer Key: ************************************
Loading...
[SYSTEM:] Successfully logged in.
```

### Install dependant npm packages locally

```
>cd source
>npm install
```

### Create your authprovider
```
>wmio auth
? Select auth type oauth
? Select one of the type create new
? Select type of Oauth OAuth2
Please provide name for your oauth: mydaimlerprovider
[TENANT:USER] OAuth configuration file created successfully. Kindly populate the oauth.json file
[TENANT:USER] Kindly set redirect url as https://YOUR:WEBMETHODS.IO-URL/auth/oauth/mydaimlerprovider__XXXXXXXX/XXXXXXXXXXXXXXXXXX/return in your Oauth Application
```
The returned URL needs to is written as "redirectURL" in authentication.js. Nothing needs to be modified in this file.
Another file `oauth.json` is generated.
1. Back up this file by renaming `oauth.json` to `oauth.json_gen`.
2. copy the value of `redirectURL` from the newly renamed file `oauth.json_gen` 
3. and place it in  - the by git provided - file `oauth.json_template` in line 49
```
  "redirectURL": "TO_BE_UPDATED"
```
4. update value with the value from the Daimler developer console:
```
  "clientId": "TO_BE_UPDATED",
  "clientSecret": "TO_BE_UPDATED",
```
5. finally save this file as `oauth.json`
6. you need to go back to your app in the Daimler developer portal and add the redirect URL in the web console in the field `Redirect URLs`.

Now you are ready to deploy yor authprovider

### Deploy your authprovider
```
>wmio oauth deploy
```

### Deploy connector

```
>wmio deploy
[TENANT:USER] Registering Connector..
[TENANT:USER] Connector Registered Successfully
...
```

## Create integration flow in webMethods.io
Now that the connector is uploaded you can use it to build an integration flow as shown on the screenshot in the beginning.
______________________
These tools are provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.	

Contact us at [TECHcommunity](mailto:technologycommunity@softwareag.com?subject=Github/SoftwareAG) if you have any questions.

