import React, { Component } from "react";
import "./app.css";
import ReactChartkick, { LineChart, PieChart } from "react-chartkick";
import Chart from "chart.js";

ReactChartkick.addAdapter(Chart);

export default class App extends Component {
  state = {
    transcribed: null,
    positivity: null,
    keyPhrases: [],
    audioLength: null,
    WPM: null,
    positivityA: null,
    positivityB: null,
    positivityC: null,
    fillNum: null,
    clicked: false
  };

  componentDidMount() {
    // LOL
    // runs at the beginning
  }

  //Call API (user inputted text)
  ///////////////////////////////////////////////////////

  //Transcribe Audio
  getAudioText() {
    console.log(3);
    fetch("/api/transcribeSample")
      .then(res => res.json())
      .then(user => this.setState({ transcribed: user.transcribed }))
      .then(console.log("ah"));
    console.log(4);
  }

  //Get Audio Length
  getAudioLength() {
    fetch("/api/getAudioLength")
      .then(res => res.json())
      .then(user => this.setState({ audioLength: user.audioLength }));
  }

  //Get WPM
  getWPM(text) {
    fetch(`/api/getWPM/${text}`)
      .then(res => res.json())
      .then(user => this.setState({ WPM: user.WPM }));
  }

  //Get Key Phrases
  getKeyPhrases(text) {
    fetch(`/api/getKeyPhrases2/${text}`)
      .then(res => res.json())
      .then(user => this.setState({ keyPhrases: user.keyPhrases }));
  }

  //Get Sentiment Analysis
  getPositivity(text) {
    fetch(`/api/getPositivity/${text}`)
      .then(res => res.json())
      .then(user => this.setState({ positivity: user.positivity }));
  }

  //Call mini API (segmental sentiment)
  getMiniPositivity(text) {
    var temp = text;
    var length = Math.floor(temp.length / 3);

    var a = temp.substring(length * 0, length * 1);
    var b = temp.substring(length, length * 2);
    var c = temp.substring(length * 2, length * 3);

    fetch(`/api/getPositivity/${b}`)
      .then(res => res.json())
      .then(user => this.setState({ positivityB: user.positivity }));
    fetch(`/api/getPositivity/${c}`)
      .then(res => res.json())
      .then(user => this.setState({ positivityC: user.positivity }));
    fetch(`/api/getPositivity/${a}`)
      .then(res => res.json())
      .then(user => this.setState({ positivityA: user.positivity }));
  }

  //Submit Button
  ///////////////////////////////////////////////////////////

  handleSubmitTranscriptionAnalyze = event => {
    event.preventDefault();

    this.getPositivity(this.state.transcribed, this.state.positivity);
    this.getKeyPhrases(this.state.transcribed);
    this.getWPM(this.state.transcribed);
    this.getMiniPositivity(this.state.transcribed);
    this.countFillers();
  };

  //Transcribes speak.wav
  ///////////////////////////////////////////////////////////
  handleSubmitTranscribe = event => {
    if (this.state.clicked) return;
    event.preventDefault();
    console.log("transcript submition");
    //Transcribe speak.wav
    this.setState({ clicked: true });
    this.getAudioText();
    console.log("2");
  };

  //Count the filler words
  countFillers = event => {
    var temp = this.state.transcribed;
    var tempArray = temp.split(" ");
    var num = 0;
    for (var i = 0; i < tempArray.length; i++) {
      if (tempArray[i] == "um" || tempArray[i] == "uh") {
        num++;
      }
    }
    console.log(num);
    this.setState({ fillNum: num });
  };

  // test(event) {
  //   console.log("hello world!!!!");

  //   var file = event.target.files[0];
  //   // Do something with the audio file.
  //   var url = URL.createObjectURL(file);
  //   var au = document.createElement("audio");
  //   var li = document.createElement("li");
  //   au.src = url;

  //   li.appendChild(au);

  //   var filename = new Date().toISOString();
  //   var upload = document.createElement("a");

  //   console.log(file.name);

  //   fetch("/api/audio", {
  //     method: "POST", // or 'PUT'
  //     body: file, // data can be `string` or {object}!
  //     headers: {
  //       "Content-Type": "audio/wav"
  //     }
  //   });
  // }
  ////

  ////
  //What it actually returns - JSX code (combination of html and javascript)
  ///////////////////////////////////////////////////////////
  render() {
    //Define the prefix ahead of time. Usually we have to call this.state.inputText
    //but if we call it at the beggining, it saves a lot of space
    const { inputText } = this.state;
    const { transcribed } = this.state;
    const { positivity } = this.state;
    const { keyPhrases } = this.state;
    const { WPM } = this.state;
    const { positivityA } = this.state;
    const { positivityB } = this.state;
    const { positivityC } = this.state;
    const { fillNum } = this.state;

    return (
      <div>
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1 className="display-4">Speech Teech</h1>
            <h6 className="lead">
              {(transcribed === null &&
                "Giving You The Best Feedback Ever! Click transcribe and your audio will appear here!") ||
                transcribed}
            </h6>
          </div>
        </div>
        <input
          onClick={this.handleSubmitTranscribe}
          type="submit"
          className="btn btn-primary btn-lg btn-block"
          value="Transcribe Audio"
        />
        <input
          onClick={this.handleSubmitTranscriptionAnalyze}
          type="submit"
          className="btn btn-success btn-lg btn-block"
          value="Analyze Audio Transcriptions"
        />
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Words Per Minute</h5>
            <span className="btn btn-primary">
              {WPM} {WPM === null && "TBA"} WPM
            </span>
            <p className="card-text">
              Although it varies, the average speaker can have a 130 wpm
              conversation. However, this does not mean it will translate to a
              130 wpm presentation. Nervousness sometimes make people go faster
              and forgetfullness makes people go slower. Ensure you practice
              thouroughly to control your pace.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Overall Positivity</h5>
            <button className="btn btn-primary">
              {positivity}
              {positivity === null && "TBA"}% Positive
            </button>
            <p className="card-text">
              In most scenarios, it is important to have a positive outlook to
              keep your audience engaged. Although it is perfectly fine to start
              off with negative statements, you should strive to end off on a
              positive note.
            </p>
            <ul>
              <li>
                Beginning: {positivityA}
                {positivity === null && "TBA"}% Positivity
              </li>
              <li>
                Middle: {positivityB}
                {positivity === null && "TBA"}% Positivity
              </li>
              <li>
                End: {positivityC}
                {positivity === null && "TBA"}% Positivity
              </li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Filler Words</h5>
            <span className="btn btn-primary">
              {fillNum}
              {fillNum === null && "TBA"} Stutters
            </span>
            <p className="card-text">
              Uh... um... uh... everyone hates filler words. You can solve these
              by practicing more. Even silence is better than filler words! To
              be safe, you can always bring a waterbottle and take a sip when
              you forget what you wanted to say.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Major Topics</h5>
            <span className="btn btn-primary">
              {keyPhrases.length} main topics
            </span>
            <p className="card-text">
              According to you, what are the major aspects of your presentation?
              How does it compare to the list below? Are you ensuring you're
              staying on topic? (list below sorted in order of significance)
            </p>
            <ul>
              {this.state.keyPhrases.map(keyPhrases => (
                <li key={keyPhrases}>{keyPhrases}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* <input
          type="file"
          accept="audio/*"
          capture
          id="recorder"
          onChange={this.test}
        /> */}
      </div>
    );
  }
}
