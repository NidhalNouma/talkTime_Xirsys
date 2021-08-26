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
      // setRStream(new MediaStream());
      stopAudioOnly(lstream);
      stopAudioOnly(rstream);
      stopAudioOnly(stream);
      onStopCall();
    }
    if (type === 1) {
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

  const [interval, setInter] = useState(null);
  const [cnt, setCnt] = useState(0);

  const intervalAnswer = () => {
    const s = rstream;
    console.log("rstream s ===>> ", rstream);
    if (s) {
      if (s.active) {
        console.log("answer call");
        setStream(s);
        answer();
      } else if (!s.active) {
        // setCnt((c) => c + 1);
      }
    }
  };

  // useEffect(() => {
  //   console.log("cntttt ", cnt);
  //   if (cnt === 4) {
  //     onStopCall();
  //   } else if (cnt === 5) {
  //     setCnt(0);
  //     onLoad();
  //   }
  // }, [cnt]);

  useEffect(() => {
    if (type === 1 && rstream) setInter(setInterval(intervalAnswer, 5000));
    else if (interval) {
      clearInterval(interval);
      setInter(null);
    }
  }, [type, rstream]);

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
