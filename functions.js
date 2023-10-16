

//change which page is displayed
function swapPage(oldPage, newPage){
  let pages_w_sliders = ["question1", "question2", "question3"]
let pageno = oldPage.slice(-1);

if(newPage== "user"){
    document.getElementById(oldPage).style.display = "none";
    document.getElementById(newPage).style.display = "block";
    activepage = newPage;
}else if(pages_w_sliders.indexOf(oldPage) != -1 && user_values[pageno] == undefined ){
    alert("It looks like you have not reported a value for this question. Please give a response before proceeding.");
}else if(oldPage == "question4" && user_values[4] == undefined){
  alert("It looks like you have not reported a value for this question. Please give a response before proceeding.");
}else if(oldPage == "question5" && user_values[5] == undefined){
  alert("It looks like you have not reported a value for this question. Please give a response before proceeding.");
}else if(oldPage == "overview" && user_values[6] == undefined){
  alert("It looks like you have not reported a value for this question. Please give a response before proceeding.");

}else{
  document.getElementById(oldPage).style.display = "none";
  document.getElementById(newPage).style.display = "block";
  activepage = newPage;
}



// if(newPage == "landing"){
//   user_id = undefined;
//   user_data = undefined;
//   document.getElementById("picker").style.backgroundColor = "white";
//   resetPam();
//   active_user = {};
//   user_values = [];
// }

if(activepage == "overview"){
  let composite_stress = compositeStress();
  updateSlider(composite_stress);
}

if(newPage == "recorded_result"){
  console.log("result! " + user_values[6]);
  document.getElementById("percent_stress").innerHTML = user_values[6];
  console.log(hexToRGB(user_values[4]));
  let fcolor = hexToRGB(user_values[4]);
  let fopen = String(user_values[6]);
  let flower = String(Math.floor(Math.random()*8));
  flower = String(0);
  let flowercolor = "[" + flower + "," + String(fcolor[0]) + "," + String(fcolor[1]) + "," + String(fcolor[2]) + "]";
  let flowermotor = "[" + flower + "," + fopen + "]";
  var enc = new TextEncoder(); // always utf-8
    // let data = enc.encode(flowercolor);
    // // const data = "<1>";
    // // const data = "<1>";
    //   writeserial(data).then(writer =>{
    //     console.log("releasing lock");
    //     writer.releaseLock();
    //   });

    data = enc.encode(flowermotor);
    console.log(flowermotor);
    writeserial(data).then(writer =>{
      console.log("releasing lock");
      writer.releaseLock();
    });

  setTimeout(function(){
    data = enc.encode(flowermotor);
    console.log(flowermotor);
    writeserial(data).then(writer =>{
      console.log("releasing lock");
      writer.releaseLock();
    });
},100);
}

if(pages_w_sliders.indexOf(newPage) != -1 ){
  console.log("new page has a slider");
  updateSlider(0);
  // document.getElementById(oldPage).style.display = "none";
  // document.getElementById(newPage).style.display = "block";
}



}

swapPage('landing', 'start_assessment');

function hexToRGB(h){
  const r = parseInt(h.slice(1,3), 16);
  const g = parseInt(h.slice(3,5), 16);
  const b = parseInt(h.slice(5,7), 16);

  return [r,g,b];
}


//*******GENERATE DATE FOR USER HISTORY***********
//for testing: add your own date month/day/year
// let d = new Date("11/1/2022");
//for production: use today's date: let d = new Date();
let d = new Date();

//*******RFID***********
function daysSince(date){
  var diff = Math.abs(new Date() - date);
  diff = Math.floor(diff/86400000);
  console.log(diff);
  return diff;
}

async function openPort(){
  console.log("serial menu opening");
  port = await navigator.serial.requestPort();
  // Wait for the serial port to open.
  await port.open({ baudRate: 9600 });
  console.log(port);

  while (port.readable) {
    document.getElementById("open_port").style.display = "none";
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    console.log(reader);
    try {
      while (true) {

        const { value, done } = await reader.read();

        if (done) {
          // |reader| has been canceled.

          break;
        }
        // Do something with |value|…
        console.log("serial reading:" + value);
        console.log(String(value).slice(0, 5) == "start");
        if(String(value).slice(0, 5) == "start" && document.getElementById("r_data").style.display == "block"){
          console.log("switching page");
          swapPage("r_data", "r_inprogress");


        }

        if(value==25 && document.getElementById("r_inprogress").style.display == "block"){
          console.log("switching page");
          swapPage("r_inprogress", "r_complete");
        }
      }
    } catch (error) {
      // Handle |error|…
    } finally {
      reader.releaseLock();
    }
  }
}

async function writeserial(message) {
  while(port.writable){
  const writer = port.writable.getWriter();
  await writer.write(message);
  return writer;
}
}


//*******RFID***********

//rfid input
let user_id = undefined;

function scanRFID(){
  console.log("running scanRFID");
  document.addEventListener('keydown', function(event) {
    //each time a key is pressed, add it to the userID
    //end input on return key (13)
    if(document.getElementById("landing").style.display == "block"){

      if(event.key== "Enter"){
        console.log(event.key);
        console.log("user id is: " + user_id);
        if(user_id != undefined){
        const user_data = get_id(user_id);
        console.log("data: " + user_data);
        }
        user_id = undefined;
      }else{
        if(user_id == undefined){
          user_id = String.fromCharCode(event.keyCode)
        }else{
      user_id += String.fromCharCode(event.keyCode);
        }
    }
    }
  });
}

//******SUBMIT USER REGISTRATION********
function submitUserReg(){
  verifyRegForm();
}

function verifyRegForm(){
  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;
  const email = document.getElementById('email').value;
  var radioButtonGroup = document.getElementsByName("degree");
  var checkedRadio = Array.from(radioButtonGroup).find((radio) => radio.checked);
  const isemail = isEmail(email);
  let user_data = {"name": [fname, lname], "email": email, "degree": checkedRadio.value, "last_login": d};
  if("string" == typeof fname && "string" == typeof lname && isemail){
    console.log("form completed " + fname + " " + lname);
    populateUserPage(fname, d, true);
    create_user(user_id, user_data);
    swapPage("user_reg", "user");
  }else{
    alert("email is invalid, please try again!");
  }
}

function isEmail(email){
  if(email.indexOf("@") >0 && email.indexOf("@") != -1 && email.indexOf(".")> 0 && email.indexOf(".")!=-1){
    return true;
  }else{
    return false;
  }
}


//*******POPULATE USER PAGE**********
//user landing page populated with name and days since last visit
function populateUserPage(name, date, first_visit){
  console.log(date);

  if(first_visit != true){
    let days = new Date(date);
    days = daysSince(days).toString();
    console.log('days since ' + daysSince(days));
    add_date(user_id, {"last_login": d});
    document.getElementById("uname").innerHTML = "Back "+ name;
    //to-do: add math for weeks/months?
    document.getElementById("itsbeen").innerHTML = "It's been " + days + " days since we last saw you.";

  }else{

    document.getElementById("uname").innerHTML = name;
    document.getElementById('itsbeen').innerHTML = "This is your first visit! Click here for a tutorial and information about the project.";
  }
}



//*******SLIDER**********
//use .slider to use this code for styling sliders

function initSliders(){
for(let i=0; i<document.querySelectorAll(".slider").length;i++){
  const range = document.querySelectorAll('.slider')[i];
  const thumb = document.querySelectorAll('.thumb')[i];
  const track = document.querySelectorAll('.track-inner')[i];

  //update slider value when user interacts with slider
  range.oninput = (e) =>{
    updateSlider(e.target.value);

    if(activepage == "overview"){
      user_values[6] = e.target.value;
      console.log(user_values);
    }else{
    let pageno = activepage.slice(-1);
    user_values[pageno] = e.target.value;
    console.log(user_values);
    }
    //updateSlider(50) // Init value
  }
}
}

//this is a requirement of the current slider styling
const updateSlider = (value) => {
  console.log(activepage);
  let thumb;
  let track;
  if(activepage == "overview"){
    thumb = document.querySelectorAll('.thumb')[document.querySelectorAll('.thumb').length-1];
    track = document.querySelectorAll('.track-inner')[document.querySelectorAll('.track-inner').length-1];  
  }else{
  let pageno = activepage.slice(-1);
  pageno = parseInt(pageno)-1;
  thumb = document.querySelectorAll('.thumb')[pageno];
  track = document.querySelectorAll('.track-inner')[pageno];
  }
  thumb.style.left = `${value}%`;
  thumb.style.transform = `translate(-${value}%, -50%)`;
  track.style.width = `${value}%`;
  
}

//*******Color Picker**********
//I'm using an external API to build a prettier color picker

function initColorPicker(){
var colorPicker = new iro.ColorPicker("#picker", {
  width:150,
  height:150,
  layout: [
    {
      component: iro.ui.Wheel
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: "value"
      }
    },
  ]
});

colorPicker.on('color:change', function(color) {
  // log the current color as a HEX string
  
  document.getElementById("picker").style.backgroundColor = color.hexString;
  user_values[4] = color.hexString;
  console.log(user_values);
});
}


//*******API CaLLS**********




//get id for user from server
function get_id(id){
  $(document).ready(function () {
  console.log("api call");
    let endpoint = "http://127.0.0.1:3001/users/" + id;
          $.ajax({
            //beforeSend: function (jqXHR, settings) { jqXHR.setRequestHeader("Access-Control-Allow-Origin", "*");},
              type: "get",
              url: endpoint,
          }).done(
          function(data){
            console.log("data returned");
            console.log(data);
            if(data.name === undefined){
              swapPage("landing", "user_reg");
            }else{
            const fname = data.name[0];
            const date = data.last_login;
            populateUserPage(fname, date, false);
            swapPage("landing", "user");
            return data;
          }

    });
      });
}


function create_user(id, user_data){
    $(document).ready(function () {
      let endpoint = "http://127.0.0.1:3001/users/";
      let userID = id;
      let data = user_data;
            $.ajax({
                type: "put",
                data: data,
                url: endpoint + userID,
            }).done(
            function(data){
        console.log("Data: " + JSON.stringify(data));
      });
        });
      }

function add_date(id, user_data){
  $(document).ready(function () {
    let endpoint = "http://127.0.0.1:3001/users/";
    let userID = id;
    let data = user_data;
    console.log(data);
          $.ajax({
              type: "post",
              data: data,
              url: endpoint + userID,
          }).done(
          function(data){
      console.log("Data: " + JSON.stringify(data));
    });
      });
}


//*******Populate PAM Images**********
//using the images from the PAM project
//populate the div #pam with 16 images
const img_folders = ["1_afraid", "2_tense", "3_excited", "4_delighted", "5_frustrated", "6_angry", "7_happy", "8_glad", "9_miserable", "10_sad", "11_calm", "12_satisfied", "13_gloomy", "14_tired", "15_sleepy", "16_serene"];


function populatePAM(){
  console.log("populating PAM");
  for(i=0; i<img_folders.length; i++){
  let img_number = Math.floor(Math.random()*3);
  img_number +=1;
  let folder_number = i+1;
  document.getElementById("pam").innerHTML += "<img src='pam_images/" + img_folders[i] + "/" + folder_number + "_" + img_number + ".jpg" + "' id='pam_" +folder_number + "'>";
  console.log("pam_" + folder_number);
  

  }
  for(i=1; i<=img_folders.length; i++){
  document.getElementById("pam_" + i).addEventListener("click", pamClicked);
  }
}

function pamClicked(e){
  
  //identify the number of the image clicked
  let target = e.target.id.slice(-2);
  if(target.slice(0,1) == "_"){
    target = target.slice(-1);
  }else{
    target = target;
  }

  //identify whether the clicked image has negative or positive valence
  let lowvalence1 = ["1","5","9","13"];
  let lowvalence2 = ["2", "6", "10", "14"];
  if(lowvalence1.indexOf(target) != -1){
    console.log("negative valence 1");
  }else if(lowvalence2.indexOf(target) != -1){
    console.log("negative valence 2");
  }else{
    console.log("negative valence");
  }

  //identify whether the clicked image has low or high arousal
  let lowarousal1 = ["13","14","15","16"];
  let lowarousal2 = ["9","10","11","12"]
  if(lowarousal1.indexOf(target) != -1){
    console.log("low arousal 1");
  }else if(lowarousal2.indexOf(target) != -1){
    console.log("low arousal 2");
  }else{
    console.log("high arousal");
  }
  console.log("pam clicked " + target);
  for(i=1; i<=img_folders.length; i++){
    document.getElementById("pam_" + i).classList.remove("selected_pam");
    }
  document.getElementById(e.target.id).classList.add("selected_pam");
    user_values[5] = target;
    console.log(user_values);
}

function resetPam(){
  for(i=1; i<=img_folders.length; i++){
    document.getElementById("pam_" + i).classList.remove("selected_pam");
    }
}

//*******Calculate Composite Stress**********
//Compile all answers to the stress assessment and calculate a composite stress score
//Weight the first two questions (how stressed are you?) with 80% weight (40% per question)
//Weight the PAM assessment and the energy question with 20% weight (10% per question)

//pam valence to stress by column
//100, 75, 0, 0

function compositeStress(){
  let stressed_q = parseFloat(user_values[1]) + parseFloat(user_values[2]);
  let ambiguous_q;
  let total_stress;
  let lowvalence1 = ["1","5","9","13"];
  let lowvalence2 = ["2", "6", "10", "14"];
  if(lowvalence1.indexOf(user_values[5]) != "-1"){
    ambiguous_q = 100;
  }else if(lowvalence2.indexOf(user_values[5]) != "-1"){
    ambiguous_q = 75;
  }else{
    ambiguous_q = 0;
  }
  console.log("ambiguous value = " + ambiguous_q);

  let energy_level = 100- parseFloat(user_values[3]);

  console.log("energy value = " + energy_level);
  ambiguous_q += energy_level;

  console.log("a value = " + ambiguous_q);
  console.log(stressed_q);
  total_stress = (ambiguous_q * .2) + (stressed_q * .8);
  let potential_stress = (200*.2) + (200*.8);
  total_stress = (total_stress/potential_stress)*100;
  return total_stress;
  
}