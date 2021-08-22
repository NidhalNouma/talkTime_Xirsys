import React from "react";
import Audio from "./component/Audio";
import Call from "./hooks/Call";

function App() {
  const { state, click, btnText, answer } = Call();

  return (
    <div className="App">
      <div className="logo">
        <h4>TalkTime</h4>
      </div>
      <div>
        <h5>Find someone to talk to.</h5>
      </div>
      <div className="audio-animation">
        <Audio type={state} answer={answer} />
      </div>
      <div className="button">
        <button onClick={click} className={btnText}>
          {btnText}
        </button>
      </div>
      <div className="footer">
        <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms</a>
      </div>

      {/* <section id="share-view" class="row">
        <h3 id="share-title">Copy and Share this URL:</h3>
        <div id="callIDView" class="input-group col-sm-8 col-sm-offset-2">
          <input
            id="callID"
            type="text"
            class="form-control"
            aria-label="..."
            readonly
          />
          <div class="input-group-btn">
            <span id="isTURN" class="input-group-addon">
              <input id="isTURNcb" type="checkbox" aria-label="..." />
              <label for="isTURN"> Force TURN</label>
            </span>
          </div>
        </div>
      </section> */}
    </div>
  );
}

export default App;
