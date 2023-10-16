//to do: add email option for water garden
//add data recording feature?
//test whether there the user has interacted with the sliders, prevent moving on without answer
//add back buttons to assessment
//reset selection of pam images for next user
//add low/high on sliders
//the server is not registering a new login time for some reason

//add data recording for most recent interactions with garden (for garden health and watering)



//id of acive page (page being displayed)
let activepage = "start_assessment";





//start by displaying the landing page
document.getElementById(activepage).style.display = 'block';



let active_user = {};
let user_values = [];
scanRFID();

initSliders();
initColorPicker();
populatePAM();

//open serial port
document.getElementById("open_port").addEventListener("click", openPort);

// welcome page buttons
document.getElementById("water").addEventListener("click", function(){swapPage("user", "w_garden")});
document.getElementById("record").addEventListener("click", function(){swapPage("user", "r_data")});

document.getElementById("water").addEventListener("touchstart", function(){swapPage("user", "w_garden")});
document.getElementById("record").addEventListener("touchstart", function(){swapPage("user", "r_data")});

document.getElementById("log_out").addEventListener("click", function(){swapPage("user", "landing")});
document.getElementById("log_out").addEventListener("touchstart", function(){swapPage("user", "landing")});

//place hand on sensor
document.getElementById("cancel_sensor").addEventListener("click", function(){swapPage("r_data", "user")});
document.getElementById("cancel_sensor").addEventListener("touchstart", function(){swapPage("r_data", "user")});

document.getElementById("hand_sensor").addEventListener("click", function(){swapPage("r_data", "r_inprogress")});
document.getElementById("hand_sensor").addEventListener("touchstart", function(){swapPage("r_data", "r_inprogress")});


//assessment buttons
document.getElementById("continue_to_assessment").addEventListener("click", function(){swapPage("r_complete", "start_assessment")});
document.getElementById("continue_to_assessment").addEventListener("touchstart", function(){swapPage("r_complete", "start_assessment")});

document.getElementById("to_question1").addEventListener("click", function(){swapPage("start_assessment", "question1")});
document.getElementById("to_question1").addEventListener("touchstart", function(){swapPage("start_assessment", "question1")});

document.getElementById("to_question2").addEventListener("click", function(){swapPage("question1", "question2")});
document.getElementById("to_question2").addEventListener("touchstart", function(){swapPage("question1", "question2")});

document.getElementById("to_question3").addEventListener("click", function(){swapPage("question2", "question3")});
document.getElementById("to_question3").addEventListener("touchstart", function(){swapPage("question2", "question3")});

document.getElementById("to_question4").addEventListener("click", function(){swapPage("question3", "question4")});
document.getElementById("to_question4").addEventListener("touchstart", function(){swapPage("question3", "question4")});

//registration form buttons
document.getElementById("continue_to_user").addEventListener("click", submitUserReg);
document.getElementById("continue_to_user").addEventListener("touchstart", submitUserReg);

document.getElementById("cancel_registration").addEventListener("click", function(){swapPage("user_reg", "landing")});
document.getElementById("cancel_registration").addEventListener("touchstart", function(){swapPage("user_reg", "landing")});


document.getElementById("to_question5").addEventListener("click", function(){swapPage("question4", "question5")});

document.getElementById("to_complete").addEventListener("click", function(){swapPage("question5", "assessment_complete")});

document.getElementById("to_overview").addEventListener("click", function(){swapPage("assessment_complete", "overview")});

document.getElementById("to_record_result").addEventListener("click", function(){swapPage("overview", "recorded_result")});

document.getElementById("complete").addEventListener("click", function(){swapPage("recorded_result", "landing")});

document.getElementById("test").addEventListener("click", function(){swapPage("r_inprogress", "r_complete")});

//cancel buttons
for(i=0; i<document.querySelectorAll(".cancel").length; i++){
    document.querySelectorAll(".cancel")[i].addEventListener("click", function(){swapPage(activepage, "user")});

}



