import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import WaveAudio from "./WaveAudio";

import Main from "../hooks/Main1";

function Audio({ type = 0, answer }) {
  const { onLoad, lstream, rstream, setRStream, setLStream, onStopCall } =
    Main();

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

    if (rstream) {
      answer();
    }
  }, [type, rstream]);

  return type === 1 ? (
    <Loader
      type="ThreeDots"
      color="rgba(102, 193, 113, 1)"
      height={100}
      width={100}
    />
  ) : type === 2 ? (
    <WaveAudio stream={rstream} lstream={lstream} />
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
