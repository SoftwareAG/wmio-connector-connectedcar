#
# this script deletes all location events and odometer measurements
# and triggers every 20 seconds the webhooks for the flow to update the location & mileage
#
import requests
import time 
import datetime
import json

# update the following parameter
BASIC_AUTH_CREDENTIALS = ('CUMULOCITY_USER', 'CUMULOCITY_PASSWORD')
HEADERS_POST = {
    'Content-type': 'application/json', 
    'Accept': 'application/vnd.com.nsn.cumulocity.measurement+json'
}
YOUR_C8Y_TENANT = "YOUR_C8Y_TENANT"
YOUR_WMIO_TENANT = "YOUR_WMIO_TENANT"
YOUR_WMIO_WEBHOOKURL_UPDATE_LOCATION = "WEBHOOK1" # something like https://my-tenant.webmethods.io/runflow/run/2Fr9mlTI6u
YOUR_WMIO_WEBHOOKURL_UPDATE_ODOMETER = "WEBHOOK2"
AUTHTOKEN = "AUTHTOKEN" # something like d666szdd2bdbaf81aad359ba4444456477118
C8Y_SOURCE_ID_OF_CREATED_VEHICLE = "YOUR_DEVICE_ID"

def initialize_demo():
    # api-endpoint 
    URL1 = "https://"+ YOUR_C8Y_TENANT + "/event/events?type=c8y_LocationUpdate"
    URL2 = "https://"+ YOUR_C8Y_TENANT + "/measurement/measurements"
    URL3 = "https://"+ YOUR_C8Y_TENANT + "/measurement/measurements?type=c8y_OdometerMeasurement"

    # sending get request and saving the response as response object 
    r1 = requests.delete(url = URL1, auth=BASIC_AUTH_CREDENTIALS)
    r3 = requests.delete(url = URL3, auth=BASIC_AUTH_CREDENTIALS)

    #YYYY-MM-DDTHH:mm:ss.SSSZ
    from datetime import datetime as dt
    current_C8Y_time = dt.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + "+02:00"

    payload = {
            "time": current_C8Y_time,
            "source": {
                "id": C8Y_SOURCE_ID_OF_CREATED_VEHICLE
            },
            "type": "c8y_DistanceMeasurement",
            "c8y_DistanceMeasurement": {
    	        "distance": { 
                    "value": 3000,
                    "unit": "KILOMETERS" }
        },
    }

  
    # sending post request and saving response as response object 
    r2 = requests.post(url = URL2, auth=BASIC_AUTH_CREDENTIALS, data=json.dumps(payload), headers=HEADERS_POST)
    print("Request reset odometer:%s" %(payload))
    # printing the output 
    print("Deleted all location events:%s and reset odometer:%s" %(r1.status_code, r2.status_code))

    keyPressed  = input("Press Key to contine ...")

def update_measurements():
    iteration = 20
    duration = 0
    URL1 = YOUR_WMIO_WEBHOOKURL_UPDATE_LOCATION + "?authtoken=" + AUTHTOKEN
    URL2 = YOUR_WMIO_WEBHOOKURL_UPDATE_ODOMETER + "?authtoken=" + AUTHTOKEN
    
     # Try to convert it to a float
    try:
        iteration = float(iteration)
    except ValueError:
        print('Please enter in a number.\n')
        # continue

    while duration < 330:
        # Run our time.sleep() command,
        # and show the before and after time
        # sending get request and saving the response as response object 
        r1 = requests.get(url = URL1)
        r2 = requests.get(url = URL2)
        print('Next location update: %s with result1: %s, result2: %s  ' % (time.ctime(), r1.status_code, r2.status_code ))
        time.sleep(iteration)
        duration = duration + iteration
 
 
try:
    initialize_demo()
    update_measurements()
except KeyboardInterrupt:
    print('\n\nKeyboard exception received. Exiting.')
    exit()