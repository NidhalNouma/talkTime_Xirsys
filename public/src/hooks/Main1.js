import Xirsys from "./Xirsys";
import { useState, useEffect } from "react";
import { set } from "express/lib/application";

function Main() {
  // const location = {};

  //custom: check URL for "ch" var, and set the channel accourdingly
  var channelPath = ""; //set this variable to specify a channel path
  // var ch = decodeURI(
  //   (RegExp("ch" + "=" + "(.+?)(&|$)").exec(location.search) || [, null])[1]
  // );
  // if (ch != "null") channelPath = ch;
  // console.log("channel path: ", channelPath);

  const [lstream, setLStream] = useState(null);
  const [rstream, setRStream] = useState(new MediaStream());
  const [username, setUsername] = useState(null);
  const [remoteCallID, setRemoteCallID] = useState(null);

  const [startCall, setStartCall] = useState(false);

  const [peer, setPeer] = useState(null);
  const [sig, setSig] = useState(null);
  // const [media, setMedia] = useState(null);
  const [ice, setIce] = useState(null);

  const [call, setCall] = useState(false);
  const [inCall, setInCall] = useState(false);

  const { xirsys } = Xirsys(setRemoteCallID, rstream);

  const [$xirsys, setXirsys] = useState(null);

  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (reload) {
      // onLoad();
      setXirsys(xirsys);
      console.log("reload ....");
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    if ($xirsys) {
      onLoad();
    }
  }, [$xirsys]);

  useEffect(() => {
    if (lstream) {
      //create signal if null
      if (!sig)
        setSig(
          new $xirsys.signal("/webrtc", username, { channel: channelPath })
        );
      //if the peer is created, update our media
      if (!!peer) peer.updateMediaStream(lstream);
    }
  }, [lstream]);

  useEffect(() => {
    if (peer) {
      peer.on(peer.peerConnSuccess, onStartCall);
      console.log("peer ", peer);
    }
    console.log("peer ", peer);
  }, [peer]);

  useEffect(() => {
    if (call) {
      callRemotePeer();
      setCall(false);
    }
  }, [call]);

  useEffect(() => {
    if (sig) doSignal();
  }, [sig]);

  useEffect(() => {
    if (ice) ice.on(ice.onICEList, onICE);
  }, [ice]);

  // const [interval, setInter] = useState(null);
  // const intervalIce = () => {
  //   ice.on(ice.onICEList, onICE);
  // };

  // useEffect(() => {
  //   if (ice) {
  //     if (rstream && !rstream.active) setInter(setInterval(intervalIce, 1000));
  //     else if (interval && rstream && rstream.active) {
  //       clearInterval(interval);
  //       setInter(null);
  //     }
  //   }
  // }, [rstream, ice]);

  useEffect(() => {
    console.log("remote Id == ", remoteCallID);

    if (sig && remoteCallID && remoteCallID !== username) doSignal();
  }, [remoteCallID]);
  //if there is no remoteCallID show sharable link to call user.

  function callRemotePeer() {
    if (!!remoteCallID) {
      console.log("Calling " + remoteCallID);
      peer.callPeer(remoteCallID);
    } else {
      console.log("Error", "A remote peer was not found!");
    }
  }

  // Get Xirsys ICE (STUN/TURN)
  function doICE() {
    console.log("doICE ");
    if (!ice) {
      setIce(new $xirsys.ice("/webrtc", { channel: channelPath }));
      //   ice.on(ice.onICEList, onICE);
    }
  }

  function onICE(evt) {
    console.log("onICE ", evt);
    if (evt.type === ice.onICEList) {
      getMyMedia();
      // setMedia(new $xirsys.media());
    }
  }

  //Get local user media
  function getMyMedia() {
    console.log("getMyMedia()");

    var mediaConstraints = {
      audio: true,
    };

    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((str) => {
        setLocalStream(str);
      })
      .catch((err) => {
        console.log("Could not get Media: ", err);
        alert("Could not get Media!! Please check your camera and mic...");
      });
  }

  //Get Xirsys Signaling service
  function doSignal() {
    sig.on("message", (msg) => {
      let pkt = JSON.parse(msg.data);

      console.log("message log ,", msg, $xirsys);

      let payload = pkt.p; //the actual message data sent
      let meta = pkt.m; //meta object
      let msgEvent = meta.o; //event label of message
      // let toPeer = meta.t; //msg to user (if private msg)
      let fromPeer = meta.f; //msg from user
      //remove the peer path to display just the name not path.
      if (!!fromPeer) {
        let p = fromPeer.split("/");
        fromPeer = p[p.length - 1];
      }
      switch (msgEvent) {
        //first Connect Success!, list of all peers connected.
        case "peers":
          //this is first call when you connect,
          onReady();
          // if we are connecting to a remote user and remote
          // user id is found in the list then initiate call
          if (!!remoteCallID) {
            let users = payload.users;
            if (users.indexOf(remoteCallID) > -1) {
              setCall(true);
            }
          }
          break;
        //peer gone.
        case "peer_removed":
          if (fromPeer === remoteCallID) onStopCall();
          break;

        // new peer connected
        //case "peer_connected":
        // 	addUser(fromPeer);
        // 	break;
        // message received. Call to display.
        //case 'message':
        // 	onUserMsg(payload.msg, fromPeer, toPeer);
        // 	break;
        default:
          break;
      }
    });
  }

  //Ready - We have our ICE servers, our Media and our Signaling.
  function onReady() {
    console.log("* onReady!");
    // setup peer connector, pass signal, our media and iceServers list.
    let isTURN = getURLParameter("isTURN") === "true"; //get force turn var.
    console.log("isTURN ", isTURN);
    setPeer(
      new $xirsys.p2p(
        sig,
        lstream,
        !ice ? {} : { iceServers: ice.iceServers },
        { forceTurn: isTURN }
      )
    );
    //add listener when a call is started.
  }
  // A peer call started udpate the UI to show remote video.
  function onStartCall(evt) {
    console.log("*main*  onStartCall ", evt);
    let remoteId = evt.data;
    console.log("peer scall ", peer);
    setRemoteStream(peer.getLiveStream(remoteId));
    //   shareTitleEl.innerHTML = "In call with user:";
    setRemoteCallID(remoteId);
    setInCall(true);
  }

  function onStopCall() {
    console.log("*main*  onStopCall ");
    if (inCall) {
      peer.hangup(remoteCallID);
    }

    console.log($xirsys);

    // setXirsys(null);
  }

  function reset() {
    setXirsys(null);
    setInCall(false);
    setRemoteCallID(null);
    setStartCall(false);
    setIce(null);
    setSig(null);
    setPeer(null);
    // setMedia(null);
    // setLStream(null);
    // setRStream(new MediaStream());
  }

  /* UI METHODS */

  //sets local user media to video object.
  function setLocalStream(str) {
    console.log("*main*  setLocalStream & Video obj ", str);
    // localStream = str;
    setLStream(str);
    // localVideoEl.srcObject = str;
  }
  //sets remote user media to video object.
  function setRemoteStream(str) {
    console.log("*main*  setRemoteStream & Video obj ", str);
    // remoteStream = str;
    console.log($xirsys.pc, "PC");
    // $xirsys.pc.ontrack = (event) => {
    //   event.streams[0].getTracks().forEach((track) => {
    //     rstream.addTrack(track);
    //   });
    // };
    // setRStream(str);
    setStartCall(true);
  }

  //gets URL parameters
  function getURLParameter(name) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get(name);

    return c ? c : null;
  }
  //makes unique userid
  function guid(s = "user") {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s + s4() + s4();
  }

  const onLoad = () => {
    console.log("pretty loaded!!");

    // getMyMedia();

    setSig(null);
    if (!username) setUsername(guid()); //create random local username
    let urlName = getURLParameter("callid"); //get call id if exists from url
    if (!!urlName) {
      setRemoteCallID(urlName);
    }

    //get Xirsys service
    doICE();
    if (reload) setReload((r) => !r);
  };

  return {
    onLoad,
    lstream,
    rstream,
    onStopCall,
    startCall,
    setReload,
    reset,
  };
}
export default Main;
