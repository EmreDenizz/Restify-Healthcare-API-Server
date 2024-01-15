//
//  @author Emre Deniz (301371047)
//

let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
chai.use(chaiHttp);

// Define base uri for the deployed REST API
const api_uri = '127.0.0.1:3000';

// Get all patients
describe("getPatients -> 'GET' to /patients", function(){
    it("should return list of all patients", function(done) {
        chai.request(api_uri)
            .get('/patients')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Get a patient
describe("getPatient -> 'GET' to /patients:id", function(){
    it("should return the patient", function(done) {
        chai.request(api_uri)
            .get('/patients/652eba48af46030cc7a28d45')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Filter patients by name
describe("filterPatientsByName -> 'GET' to patients/search/:name", function(){
    it("should return the patient", function(done) {
        chai.request(api_uri)
            .get('/patients/search/Eddi')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Filter critical patients
describe("getCriticalPatients -> 'GET' to /patients/critical", function(){
    it("should return the critical patients", function(done) {
        chai.request(api_uri)
            .get('/patients/critical')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Create a patient
describe("createPatient -> 'POST' to /patients", function(){
    it("should return response with user created", function(done) {
        chai.request(api_uri)
            .post('/patients')
            .field('first_name', 'John')
            .field('last_name', 'Doe')
            .field('address', '123 Queen Street, Toronto, ON')
            .field('date_of_birth', '16/8/1998')
            .field('department', 'Cardiology')
            .field('doctor', 'Luke White')
            .end(function(req, res){
                expect(res.status).to.equal(201);
                done();
            });
    });
});

// Check patient created
describe("checkPatientCreated -> 'GET' to patients/search/:name", function(){
    it("should return the patient", function(done) {
        chai.request(api_uri)
            .get('/patients/search/John')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Update a patient
describe("updatePatient -> 'PUT' to /patients", function(){
    it("should return response with user updated", function(done) {
        chai.request(api_uri)
            .put('/patients/652ec257908065efd0e5b792')
            .field('first_name', 'Lisa')
            .field('last_name', 'Miles')
            .field('address', '1234 Warden Avenue, Toronto, ON')
            .field('date_of_birth', '16/7/1998')
            .field('department', 'Oncology')
            .field('doctor', 'Melinda Binder')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                done();
            });
    });
});

// Check patient updated
describe("checkPatientUpdated -> 'GET' to patients/search/:name", function(){
    it("should return the patient", function(done) {
        chai.request(api_uri)
            .get('/patients/search/Lisa')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Delete patient
describe("deletePatient -> 'DELETE' to patients/", function(){
    it("should return the patient", function(done) {
        chai.request(api_uri)
            .delete('/patients/655f70eb1899ee771dc75421')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                done();
            });
    });
});

// Check patient deleted
describe("checkPatientDeleted -> 'GET' to patients/", function(){
    it("should return status 404", function(done) {
        chai.request(api_uri)
            .get('/patients/655f70eb1899ee771dc75421')
            .end(function(req, res){
                expect(res.status).to.equal(404);
                done();
            });
    });
});

// Get all tests of a patient
describe("getTests -> 'GET' to /patients/:id/tests", function(){
    it("should return the all tests of the patient", function(done) {
        chai.request(api_uri)
            .get('/patients/652eba48af46030cc7a28d45/tests')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                expect(res.text).not.to.equal('[]');
                done();
            });
    });
});

// Get a test
describe("getTest -> 'GET' to /tests/:id", function(){
    it("should return the all tests a the patient", function(done) {
        chai.request(api_uri)
            .get('/tests/6556c9d351906bb82cea5c26')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                done();
            });
    });
});

// Create a test
describe("createTest -> 'POST' to /patients/:id/tests", function(){
    it("should return response with test created", function(done) {
        chai.request(api_uri)
            .post('/patients/652eba48af46030cc7a28d45/tests')
            .field('patient_id', '652eba48af46030cc7a28d45')
            .field('date', '16/11/2023')
            .field('nurse_name', 'Megan Jennings')
            .field('type', 'Test')
            .field('category', 'Blood Oxygen Level')
            .field('readings', 93)
            .end(function(req, res){
                expect(res.status).to.equal(201);
                done();
            });
    });
});

// Update a test
describe("updateTest -> 'PUT' to /patients/patient_id/tests/test_id", function(){
    it("should return response with test updated", function(done) {
        chai.request(api_uri)
            .put('/patients/652eba48af46030cc7a28d45/tests/655f70171899ee771dc75416')
            .field('patient_id', '652eba48af46030cc7a28d45')
            .field('date', '16/11/2023')
            .field('nurse_name', 'Megan Jennings')
            .field('type', 'Test')
            .field('category', 'Blood Oxygen Level')
            .field('readings', 99)
            .end(function(req, res){
                expect(res.status).to.equal(201);
                done();
            });
    });
});

// Delete test
describe("deleteTest -> 'DELETE' to tests/", function(){
    it("should return the patient", function(done) {
        chai.request(api_uri)
            .delete('/tests/655f70171899ee771dc75416')
            .end(function(req, res){
                expect(res.status).to.equal(200);
                done();
            });
    });
});

// Check test deleted
describe("checkTestDeleted -> 'GET' to tests/", function(){
    it("should return status 404", function(done) {
        chai.request(api_uri)
            .get('/tests/655f70171899ee771dc75416')
            .end(function(req, res){
                expect(res.status).to.equal(404);
                done();
            });
    });
});
