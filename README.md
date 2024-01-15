# NodeJS-Healthcare-Api-Server
Healthcare API server in Node.js using Restify and MongoDB

 ### HOW TO RUN:
**1.** Install required packages and run HTTP server
```console
npm install
node app.js
```
**2.** Run Chai unit tests
```console
mocha chai-http-test.js
```
**3.** Import https://github.com/EmreDenizz/NodeJS-Healthcare-API-Server/blob/main/postman_collection.json to your Postman
   
**4.** Available methods:
- **getPatients**
- **getPatient**
- **getCriticalPatients**
- **filterPatientsByName**
- **createPatient**
- **updatePatient**
- **deletePatient**
- **getTestRecords**
- **getTestRecord**
- **createTestRecords**
- **updateTestRecords**
- **deleteTestRecord**
