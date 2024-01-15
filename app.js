//
//  @author Emre Deniz
//

let SERVER_NAME = "clinic-api";
let PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");
const fs = require("fs");

// MongoDB Local Database URL and Host
let uristring = "mongodb://127.0.0.1:27017/CLINIC";
let HOST = "127.0.0.1";

// Connect to MongoDB
mongoose.connect(uristring, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("**** Connected to db: " + uristring);
});

// Create patient schema
const patientSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    address: String,
    date_of_birth: String,
    department: String,
    doctor: String,
    status: String,
});

// Create test record schema
const testSchema = new mongoose.Schema({
    patient_id: String,
    date: String,
    nurse_name: String,
    type: String,
    category: String,
    readings: Number,
});

// Compiles schemas into models, opening (or creating, if nonexistent) the 'patients' and 'tests' collections in the MongoDB database
let PatientsModel = mongoose.model("patients", patientSchema);
let TestsModel = mongoose.model("tests", testSchema);

let errors = require("restify-errors");

// Create the restify server
let restify = require("restify"),
server = restify.createServer({ name: SERVER_NAME });

server.listen(PORT, HOST, function () {
  console.log("Server %s listening at %s", server.name, server.url);
  console.log("**** Resources: ****");
  console.log(" /patients");
  console.log(" /patients/:id");
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all patients
server.get("/patients", function (req, res, next) {
  console.log("GET /patients params=>" + JSON.stringify(req.params));

  // Find every entity in db
  PatientsModel.find({})
    .then((patients) => {
      // Return all of the patients
      res.send(patients);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Adding a new patient
server.post("/patients", function (req, res, next) {
  console.log("POST /patients params=>" + JSON.stringify(req.params));
  console.log("POST /patients body=>" + JSON.stringify(req.body));

  // Validation using the patients model structure
  if (req.body.first_name === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the First Name!!")
    );
  }
  if (req.body.last_name === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Last Name!!")
    );
  }
  if (req.body.address === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Home Address!!")
    );
  }
  if (req.body.date_of_birth === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Date of Birth!!")
    );
  }
  if (req.body.department === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Department visited!!")
    );
  }
  if (req.body.doctor === undefined) {
    return next(
      new errors.BadRequestError(
        "You did not provide the name of the Doctor attending!!"
      )
    );
  }

  // Create a new patient model from the values entered in the body
  let newPatient = new PatientsModel({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address: req.body.address,
    date_of_birth: req.body.date_of_birth,
    department: req.body.department,
    doctor: req.body.doctor,
    status: "Normal",
  });

  // Save the new patient to the database
  newPatient
    .save()
    .then((patient) => {
      console.log("Saved Patient: " + patient);
      // Send the patient if no issues
      res.send(201, patient);
      return next();
    })
    .catch((error) => {
      console.log("Error Saving the Patient: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Get a single patient by id
server.get("/patients/:id", function (req, res, next) {
  console.log("GET /patients/:id params=>" + JSON.stringify(req.params));

  // Find a single patient by their id in db
  PatientsModel.findOne({ _id: req.params.id })
    .then((patient) => {
      console.log("Found patient: " + patient);
      if (patient) {
        // Send the patient if found
        res.send(patient);
      } else {
        // Send 404 statu code if the patient doesn't exist
        res.send(404);
      }
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Get a single test by id
server.get("/tests/:id", function (req, res, next) {
  console.log("GET /tests/:id params=>" + JSON.stringify(req.params));

  // Find a single test by their id in db
  TestsModel.findOne({ _id: req.params.id })
    .then((test) => {
      console.log("Found test: " + test);
      if (test) {
        // Send the test if found
        res.send(test);
      } else {
        // Send 404 statu code if the test doesn't exist
        res.send(404);
      }
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Update the details for a patient
server.put("/patients/:id", function (req, res, next) {
  console.log("PUT /patients/:id params=>" + JSON.stringify(req.params));
  console.log("PUT /patients/:id body=>" + JSON.stringify(req.body));

  //validation using the patients model structure
  if (req.body.first_name === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the First Name!!")
    );
  } else if (req.body.last_name === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Last Name!!")
    );
  } else if (req.body.address === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Home Address!!")
    );
  } else if (req.body.date_of_birth === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Date of Birth!!")
    );
  } else if (req.body.department === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Department visited!!")
    );
  } else if (req.body.doctor === undefined) {
    return next(
      new errors.BadRequestError(
        "You did not provide the name of the Doctor attending!!"
      )
    );
  } else {
    PatientsModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          address: req.body.address,
          date_of_birth: req.body.date_of_birth,
          department: req.body.department,
          doctor: req.body.doctor,
        },
      }
    )
      .then((patient) => {
        console.log("Updated Patient: " + patient);
        res.send(200, req.body);
      })
      .catch((error) => {
        console.log("Error Updating the Patient: " + error);
        return next(new Error(JSON.stringify(error.errors)));
      });
  }
});

// Add test record & Update patient status
server.post("/patients/:id/tests", function (req, res, next) {
  console.log("POST /test params=>" + JSON.stringify(req.params));
  console.log("POST /test body=>" + JSON.stringify(req.body));

  // Validation using the patients model structure
  if (req.body.patient_id === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Patient ID!!")
    );
  }
  if (req.body.date === undefined) {
    return next(new errors.BadRequestError("You did not provide the Date!!"));
  }
  if (req.body.nurse_name === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Nurse Name!!")
    );
  }
  if (req.body.type === undefined) {
    return next(new errors.BadRequestError("You did not provide the Type!!"));
  }
  if (req.body.category === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Category!!")
    );
  }
  if (req.body.readings === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Readings!!")
    );
  }

  // Create a new patient model from the values entered in the body
  let newTest = new TestsModel({
    patient_id: req.body.patient_id,
    date: req.body.date,
    nurse_name: req.body.nurse_name,
    type: req.body.type,
    category: req.body.category,
    readings: req.body.readings,
  });

  // Check if the readings is in a critical status
  var status = "Normal";
  var category = req.body.category;
  var readings = req.body.readings;

  if (category == "Blood Pressure") {
    if (readings < 80 || readings > 120) {
      status = "Critical";
    }
  } else if (category == "Respiratory Rate") {
    if (readings < 12 || readings > 18) {
      status = "Critical";
    }
  } else if (category == "Blood Oxygen Level") {
    if (readings < 95 || readings > 100) {
      status = "Critical";
    }
  } else if (category == "Heart Beat Rate") {
    if (readings < 60 || readings > 100) {
      status = "Critical";
    }
  }

  // Update status of patient
  newTest
    .save()
    .then((test) => {
      console.log("Saved Test: " + test);

      // Update patient status after inserting new test if required
      PatientsModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((patient) => {
          res.send(201, test);
        })
        .catch((error) => {
          console.log("Error Updating the Patient: " + error);
          return next(new Error(JSON.stringify(error.errors)));
        });
    })
    .catch((error) => {
      console.log("Error Saving the Test: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// List all test records for the patient
server.get("/patients/:id/tests", function (req, res, next) {
  console.log("GET /tests params=>" + JSON.stringify(req.params));

  // Find every tests that belongs to the patient
  TestsModel.find({ patient_id: req.params.id })
    .then((tests) => {
      console.log("Found tests: " + tests);
      if (tests) {
        // Send tests if found
        res.send(tests);
      } else {
        // Send 404 statu code if tests don't exist
        res.send(404);
      }
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Delete a test record
server.del("/tests/:test_id", function (req, res, next) {
  console.log(
    "DELETE /tests params=>" + JSON.stringify(req.params)
  );
  // Delete the test in db
  TestsModel.findOneAndDelete({ _id: req.params.test_id })
    .then((deletedTest) => {
      console.log("deleted test: " + deletedTest);
      if (deletedTest) {
        res.send(200, deletedTest);
      } else {
        res.send(404, "Test not found");
      }
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Delete patient (first delete all tests, then delete patient)
server.del("/patients/:id", function (req, res, next) {
  console.log("DELETE /patients/:id params=>" + JSON.stringify(req.params));

  // Delete tests that belongs to this patient in db
  TestsModel.deleteMany({ patient_id: req.params.id })
    .then(() => {
      console.log("deleted tests");

      // Delete the patient in db
      PatientsModel.findOneAndDelete({ _id: req.params.id })
        .then((deletedTest) => {
          console.log("deleted patient: " + deletedTest);
          if (deletedTest) {
            res.send(200, deletedTest);
          } else {
            res.send(404, "Patient not found");
          }
          return next();
        })
        .catch(() => {
          console.log("error: " + error);
          return next(new Error(JSON.stringify(error.errors)));
        });
    })
    .catch(() => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Filter patients by matching search name to first or last name
server.get("/patients/search/:name", function (req, res, next) {
  console.log(
    "GET /patients/search/:name params=>" + JSON.stringify(req.params)
  );
  let regex = new RegExp(req.params.name, "i");
  PatientsModel.find({ $or: [{ first_name: regex }, { last_name: regex }] })
    .then((results) => {
      console.log("found patients: " + results);
      if (!results || results.length == 0) {
        res.send(404, "No patients found");
      } else {
        res.json(results);
      }
      return next();
    })
    .catch((err) => {
      console.log("Error: " + err);
      return next(err);
    });
});

// Filter patients by filtering those whose status is critical
server.get("/patients/critical", function (req, res, next) {
  console.log("GET /patients/critical");
  const queryObj = { status: "Critical" };
  PatientsModel.find(queryObj)
    .then((result) => {
      if (!result || result.length ==0) {
        res.send(404, "No Critical patients Found");
      } else {
        res.json(result);
      }
      return next();
    })
    .catch((err) => next(err));
});

// Update a test record for a certain patient, and thus update the patient status accordingly
server.put("/patients/:patientID/tests/:testID", function (req, res, next) {
  console.log(
    "PUT /patients/:patientID/tests/:testID params=>" +
      JSON.stringify(req.params)
  );
  console.log(
    "PUT /patients/:patientID/tests/:testID body=>" + JSON.stringify(req.body)
  );

  // Validation using the patients model structure
  if (req.body.patient_id === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Patient ID!!")
    );
  } else if (req.body.date === undefined) {
    return next(new errors.BadRequestError("You did not provide the Date!!"));
  } else if (req.body.nurse_name === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Nurse Name!!")
    );
  } else if (req.body.type === undefined) {
    return next(new errors.BadRequestError("You did not provide the Type!!"));
  } else if (req.body.category === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Category!!")
    );
  } else if (req.body.readings === undefined) {
    return next(
      new errors.BadRequestError("You did not provide the Readings!!")
    );
  } else {
    // Check if the readings is in a critical status
    var status = "Normal";
    var category = req.body.category;
    var readings = req.body.readings;

    if (category == "Blood Pressure") {
      if (readings < 80 || readings > 120) {
        status = "Critical";
      }
    } else if (category == "Respiratory Rate") {
      if (readings < 12 || readings > 18) {
        status = "Critical";
      }
    } else if (category == "Blood Oxygen Level") {
      if (readings < 95 || readings > 100) {
        status = "Critical";
      }
    } else if (category == "Heart Beat Rate") {
      if (readings < 60 || readings > 100) {
        status = "Critical";
      }
    }

    TestsModel.findByIdAndUpdate(
      { _id: req.params.testID },
      {
        $set: {
          patient_id: req.body.patient_id,
          date: req.body.date,
          nurse_name: req.body.nurse_name,
          type: req.body.type,
          category: req.body.category,
          readings: req.body.readings,
        },
      }
    )
      .then((test) => {
        console.log("Updated test " + test);

        // Update patient status after inserting new test if required
        PatientsModel.findByIdAndUpdate(
          { _id: req.params.patientID },
          {
            $set: {
              status: status,
            },
          }
        )
          .then((patient) => {
            res.send(201, test);
          })
          .catch((error) => {
            console.log("Error Updating the Patient: " + error);
            return next(new Error(JSON.stringify(error.errors)));
          });
      })
      .catch((error) => {
        console.log("Error Saving the Test: " + error);
        return next(new Error(JSON.stringify(error.errors)));
      });
  }
});
