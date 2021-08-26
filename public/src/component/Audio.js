import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import WaveAudio from "./WaveAudio";

import Main from "../hooks/Main1";

function Audio({ type = 0, answer }) {
  const {
    onLoad,
    lstream,
    rstream,
    setRStream,
    setLStream,
    onStopCall,
    startCall,
  } = Main();

  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (type === 0) {
      setLStream(null);
      setRStream(null);
      stopAudioOnly(lstream);
      stopAudioOnly(rstream);
      onStopCall();
    } else if (type === 1) {
      onLoad();
    }

    if (type !== 2) setStream(null);
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

  useEffect(() => {
    const interval = setInterval(() => {
      const s = rstream;
      if (s) {
        // console.log("rstream s ===>> ", s);
        if (s.active) {
          console.log("answer call");
          setStream(s);
          answer();
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return type === 1 ? (
    <Loader type="Bars" color="rgba(102, 193, 113, 1)" height={80} width={80} />
  ) : type === 2 && stream ? (
    <WaveAudio stream={stream} lstream={lstream} />
  ) : (
    <div></div>
  );
}

export default Audio;

function stopAudioOnly(stream) {
  if (stream)
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live" && track.kind === "audio") {
        track.stop();
      }
    });
}
