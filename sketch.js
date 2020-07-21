var myRec = new p5.SpeechRec(); // new P5.SpeechRec object
var transcript = "click the button and say something!";
var status = "idle";
var finished = false;

function setup()
{
    // graphics stuff:
    createCanvas(windowWidth, windowHeight);
    fill(0, 0, 0, 255);
    // instructions:
    textAlign(CENTER,TOP);
    rectMode(CENTER);
    fill(0);
    myRec.onResult = generateText
}

function draw()
{
    background("#C2F970");

    fill(255);
    ellipse(width/2, height/2+height/6, 400, 400);

    fill(0);

    textSize(32);
    text("status: " + status,width/2,height/2+height/6);

    textSize(15);
    text(transcript, width/2, 0, width,height);
}

function generateText()
{
    if(myRec.resultValue==true && status == "finished") {
        fill(0);
        transcript = myRec.resultString
        console.log(myRec.resultString);
    }
}

function mousePressed(){

    if(status !== "recording"){
        transcript = "";
        myRec.start();  
        status = "recording"
    }
 
    else{
        status = "finished";
    }
}