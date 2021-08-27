import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import WaveAudio from "./WaveAudio";

import Main from "../hooks/Main1";

function Audio({ type = 0, answer }) {
  const { onLoad, lstream, rstream, onStopCall, startCall } = Main();

  useEffect(() => {
    console.log("Type is ==> ", type, startCall);
    if (type === 0) {
      stopAudioOnly(lstream);
      stopAudioOnly(rstream);
      if (startCall) onStopCall();
    }
    if (type === 1) {
      onLoad();
    }
  }, [type]);

  useEffect(() => {
    if (startCall) {
      answer();
    }
  }, [startCall]);

  // useEffect(() => {
  //   console.log("r ===>> ", rstream);
  //   if (rstream.active) {
  //     answer();
  //   }
  // }, [rstream]);

  const [interval, setInter] = useState(null);
  const [cnt, setCnt] = useState(0);

  const intervalAnswer = () => {
    // console.log("set cnt ", cnt);
    setCnt((c) => c + 1);
  };

  useEffect(() => {
    if (type === 1) setInter(setInterval(intervalAnswer, 1000));
    else if (interval) {
      clearInterval(interval);
      setInter(null);
    }
  }, [type, rstream]);

  useEffect(() => {
    console.log("rstream s ===>> ", rstream);
    if (rstream) {
      if (rstream.active) {
        console.log("answer call");
        // setStream(rstream);
        answer();
      } else if (!rstream.active) {
        // setCnt((c) => c + 1);
      }
    }
    // console.log("cntttt ", cnt);
    // if (cnt === 4) {
    //   onStopCall();
    // } else if (cnt === 5) {
    //   setCnt(0);
    //   onLoad();
    // }
  }, [cnt]);

  return type === 1 ? (
    <Loader type="Bars" color="rgba(102, 193, 113, 1)" height={80} width={80} />
  ) : type === 2 && rstream ? (
    <WaveAudio stream={rstream} lstream={lstream} />
  ) : (
    <div></div>
  );
}

export default Audio;

function stopAudioOnly(stream) {
  if (stream) {
    stream.getTracks().forEach(function (track) {
      track.stop();
      console.log("st", stream);
    });
  }
}
