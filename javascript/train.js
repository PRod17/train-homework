// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAnOzc6KI0lRdnQwbhP0R930cuKmZuKzBQ",
    authDomain: "class-activities-7fb0a.firebaseapp.com",
    databaseURL: "https://class-activities-7fb0a.firebaseio.com",
    projectId: "class-activities-7fb0a",
    storageBucket: "class-activities-7fb0a.appspot.com",
    messagingSenderId: "943012495839"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var routeName = $("#destination-input").val().trim();
    var startTime = moment($("#start-time-input").val().trim(), "HH:mm").format("X");
    var freqMins = $("#frequency-input").val().trim();
    // Creates local "temporary" object for holding employee data
    var newTrain = {
        train: trainName,
        route: routeName,
        start: startTime,
        freq: freqMins
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.train);
    console.log(newTrain.route);
    console.log(newTrain.start);
    console.log(newTrain.freq);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-time-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().train;
    var routeName = childSnapshot.val().route;
    var startTime = childSnapshot.val().start;
    startTime = moment.unix(startTime).format("HH:mm");
    var freqMins = childSnapshot.val().freq;

    // Employee Info
    console.log(trainName);
    console.log(routeName);
    console.log(startTime);
    console.log(freqMins);

    // // Calculate the mimutes worked using hardcore math
    // // To calculate the minutes worked
    var times = calculateTimes(freqMins, startTime);
    // console.log(empMonths);

    // // Calculate the total billed rate
    // var minsAway = (curTime - startTime) / freqMins;
    // console.log(empBilled);

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(routeName),
        $("<td>").text(freqMins),
        $("<td>").text(times.nextTrain),
        $("<td>").text(times.minutesTillTrain),

    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case
// Assumptions
function calculateTimes(frequency, startTime) {

    var tFrequency = frequency;

    // Time is 3:30 AM
    var firstTime = startTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    // var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    // console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes")
        .format("hh:mm");

    return {
        minutesTillTrain: tMinutesTillTrain,
        nextTrain: nextTrain
    }
};