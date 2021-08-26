import $ from "jquery";
import { useState, useEffect } from "react";

// Media

function Xirsys(setRandomUser, rstream) {
  const [$xirsys] = useState(new Object());

  useEffect(() => {
    let _md = ($xirsys.media = function (info) {
      if (!info) info = {};
      console.log("*media*  info: ", info);
      //internal values
      this.info = info;
      this.evtListeners = {};
      this.getLocalDevices().then((devices) => {
        this.updateDevices(devices);
      });
    });

    _md.prototype.localDevices = null;
    _md.prototype.localStream = null;

    //events
    _md.prototype.DEVICES_UPDATED = "devicesUpdated";
    _md.prototype.ON_LOCAL_STREAM = "onLocalStream";

    /* PUBLIC */

    _md.prototype.getUserMedia = function (constraints, cbSuccess, cbFail) {
      if (!constraints) constraints = { audio: true, video: true };
      //return promise
      var own = this;
      return navigator.mediaDevices.getUserMedia(constraints).then((str) => {
        own.localStream = str;
        own.emit(own.ON_LOCAL_STREAM, str);
        return str;
      });
      /* .catch(err => { 
              console.log('Could not get Media: ', err);
              throw err;
          }); */
    };

    _md.prototype.getLocalDevices = function () {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log(
          "Error: Could not get list of media devices!  This might not be supported by this browser."
        );
        return;
      }
      let d = navigator.mediaDevices.enumerateDevices();
      return d;
    };

    /* PRIVATE */

    _md.prototype.updateDevices = function (list) {
      console.log("*media*  updateDevices ", list);
      if (arguments.length === 0) return;
      //set local list. dispatch event that list is updated.
      let items = { audioin: [], videoin: [] };

      list.forEach((device) => {
        //console.log('device: ',device);
        if (device.deviceId === "default") {
          if (!items.defaults) items.defaults = [];
          items.defaults.push(device);
          return;
        }
        switch (device.kind) {
          case "audioinput":
            if (device.deviceId !== "default") {
              items.audioin.push(device);
            }
            break;
          case "videoinput":
            if (device.deviceId !== "default") {
              items.videoin.push(device);
            }
            break;
          default:
            break;
        }
      });
      //console.log('Items list: ',items);
      this.localDevices = items;
      this.emit(this.DEVICES_UPDATED, this.localDevices);
    };

    //UTILS

    /* EVENTS */

    _md.prototype.on = function (sEvent, cbFunc) {
      //console.log('*p2group*  on ',sEvent,', func: '+cbFunc);
      if (!sEvent || !cbFunc) {
        console.log('error:  missing arguments for "on" event.');
        return false;
      }
      //if event does not exist create it and give it an array for listeners.
      if (!this.evtListeners[sEvent]) this.evtListeners[sEvent] = [];
      //add listener to event.
      this.evtListeners[sEvent].push(cbFunc);
    };
    _md.prototype.off = function (sEvent, cbFunc) {
      if (!this.evtListeners.hasOwnProperty(sEvent)) return false; //end

      let index = this.evtListeners[sEvent].indexOf(cbFunc);
      if (index !== -1) {
        this.evtListeners[sEvent].splice(index, 1);
        return true; //else end here.
      }
      return false; //else end here.
    };

    _md.prototype.emit = function (sEvent, data) {
      let handlers = this.evtListeners[sEvent];
      if (!!handlers) {
        let l = handlers.length,
          i;
        for (i = 0; i < l; i++) {
          let item = handlers[i];
          item.apply(this, [{ type: sEvent, data: data }]);
        }
      }
    };

    console.log("$xirsys.media Loaded Successfuly!!!");
    _md = null;

    //Ice

    var _ice = ($xirsys.ice = function (apiUrl, info) {
      if (!info) info = {};
      this.info = info;
      this.apiUrl = !!apiUrl ? apiUrl : "/webrtc";
      this.evtListeners = {};

      //path to channel we are sending data to.
      this.channelPath = !!info.channel ? this.cleanChPath(info.channel) : "";

      this.iceServers = null;
      if (!!this.apiUrl) {
        if (this.info.ident && this.info.secret) {
          this.doICE(this.info.ident, this.info.secret); //first get our token.
        } else {
          this.doICE();
        }
      }
    });

    _ice.prototype.onICEList = "onICEList";

    _ice.prototype.doICE = function (ident, secret) {
      console.log("*ice*  doICE: ", this.apiUrl + "/_turn" + this.channelPath);
      var own = this;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function ($evt) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var res = JSON.parse(xhr.responseText);
          console.log("*ice*  response: ", res);
          own.iceServers = own.filterPaths(res.v.iceServers);

          own.emit(own.onICEList);
        }
      };
      var path = this.apiUrl + "/_turn/" + this.channelPath;
      xhr.open("PUT", path, true);
      if (ident && secret)
        xhr.setRequestHeader(
          "Authorization",
          "Basic " + btoa(`${ident}:${secret}`)
        );
      xhr.send();
    };

    //check for depricated RTCIceServer "url" property, needs to be "urls" now.
    _ice.prototype.filterPaths = function (arr) {
      var l = arr.length,
        i;
      var a = [];
      for (i = 0; i < l; i++) {
        var item = arr[i];
        var v = item.url;
        if (!!v) {
          item.urls = v;
          delete item.url;
        }
        a.push(item);
      }
      return a;
    };

    //formats the custom channel path how we need it.
    _ice.prototype.cleanChPath = function (path) {
      //has slash at front
      console.log("cleanChPath path recv: " + path);
      if (path.indexOf("/") !== 0) path = "/" + path;
      if (path.lastIndexOf("/") === path.length - 1)
        path = path.substr(0, path.lastIndexOf("/"));
      console.log("cleanChPath new path: " + path);
      return path;
    };

    _ice.prototype.on = function (sEvent, cbFunc) {
      //console.log('*ice*  on ',sEvent);
      if (!sEvent || !cbFunc) {
        console.log("error:  missing arguments for on event.");
        return false;
      }
      if (!this.evtListeners[sEvent]) this.evtListeners[sEvent] = [];
      this.evtListeners[sEvent].push(cbFunc);
    };
    _ice.prototype.off = function (sEvent, cbFunc) {
      if (!this.evtListeners.hasOwnProperty(sEvent)) return false; //end

      var index = this.evtListeners[sEvent].indexOf(cbFunc);
      if (index !== -1) {
        this.evtListeners[sEvent].splice(index, 1);
        return true; //else end here.
      }
      return false; //else end here.
    };

    _ice.prototype.emit = function (sEvent, data) {
      var handlers = this.evtListeners[sEvent];
      if (!!handlers) {
        var l = handlers.length;
        for (var i = 0; i < l; i++) {
          var item = handlers[i];
          item.apply(this, [{ type: this.onICEList }]);
        }
      }
    };

    console.log("$xirsys.ice Loaded Successfuly!!!");
    _ice = null;

    // Signal

    var _sig = ($xirsys.signal = function (apiUrl, userName, info) {
      if (!info) info = {};
      this.info = info;
      //internal values
      this.sig = null; //local signal object.
      this.tmpToken = null; //authorized token for signal calls
      this.sigHostPath = null; //full authorized path to signaling service.
      this.pendListeners = []; //event listener - hold until init.
      this.heartbeat = null; //interval that keeps the signal open.
      this.evtListeners = {};

      //path to channel we are sending data to.
      //this.channelPath = !!info.channel ? this.cleanChPath(info.channel) : '';

      this.userName = !!userName ? userName : null;
      this.apiUrl = !!apiUrl ? apiUrl : "/webrtc";
      //console.log('*signal*  constructed');
      this.connectTo(!!info.channel ? info.channel : "");
    });

    _sig.prototype.ver = "v2";
    _sig.prototype.keepAliveInt = 800;
    _sig.prototype.connected = false;

    _sig.prototype.close = function () {
      console.log("close ", this.sig);
      if (this.heartbeat) this.stopHeart();
      if (this.sig) this.sig.close();
    };

    _sig.prototype.connectTo = function (channel) {
      this.channelPath = !!channel ? this.cleanChPath(channel) : "";
      console.log("connectTo: ", this.channelPath);
      //if connected stop current, then do new.
      if (!!this.sig) {
        this.close();
        var own = this;
        setTimeout(() => {
          own.doToken();
        }, 800);
      } else if (!!this.apiUrl) {
        //!!this.userName &&
        if (this.info.ident && this.info.secret) {
          this.doToken(this.info.ident, this.info.secret); //first get our token.
        } else {
          this.doToken();
        }
      } else {
        console.log("Error: Could connect signal!");
      }
      return true;
    };

    _sig.prototype.doToken = function (ident, secret) {
      var path =
        this.apiUrl + "/_token" + this.channelPath + "?k=" + this.userName;
      console.log("*signal*  PUT doToken to " + path);
      var own = this;
      var _headers = {};
      if (ident && secret) {
        _headers["Authorization"] = "Basic " + btoa(ident + ":" + secret);
      }
      $.ajax({
        url: path,
        type: "PUT",
        dataType: "json",
        headers: _headers,
        error: function (data) {
          console.log("*signal*  error: ", data);
        },
        success: function (data) {
          own.tmpToken = data.v;
          if (own.tmpToken === "no_namespace") {
            console.log("*signal*  fail: ", own.tmpToken);
            return;
          }
          console.log("*signal*  token: ", own.tmpToken);
          if (own.info.ident && own.info.secret) {
            own.doSignal(own.info.ident, own.info.secret); //first get our token.
          } else {
            own.doSignal();
          }
        },
      });
    };

    _sig.prototype.doSignal = function (ident, secret) {
      console.log(
        "*signal*  GET doSignal to " +
          this.apiUrl +
          "/_host" +
          this.channelPath +
          "?type=signal&k=" +
          this.userName
      );
      var own = this;
      var path = this.info.channel
        ? this.apiUrl +
          "/_host" +
          this.channelPath +
          "?type=signal&k=" +
          this.userName
        : this.apiUrl + "/_host?type=signal&k=" + this.userName;
      var _headers = {};
      if (ident && secret) {
        _headers["Authorization"] = "Basic " + btoa(ident + ":" + secret);
      }
      $.ajax({
        url: path,
        type: "GET",
        dataType: "json",
        headers: _headers,
        error: function (data) {
          console.log("*signal*  error: ", data);
        },
        success: function (data) {
          own.host = data.v + "/" + own.ver + "/" + own.tmpToken;
          console.log("KKKKKKKKK ", data);
          if (data.randomUser) {
            own.randomUser = data.randomUser;
            setRandomUser(data.randomUser);
          }

          if (data.users) own.users = data.users;

          console.log("signal host: ", own.host);
          own.setupSocket();
        },
      });
    };

    //setup socket to signaling server.
    _sig.prototype.setupSocket = function () {
      console.log("*signal*  setupSocket to " + this.host);
      var own = this;
      this.sig = new WebSocket(this.host);
      //notify when connection is open
      this.sig.addEventListener("open", (evt) => {
        own.startHeart();
        own.connected = true;
      });
      //notify when connection closed
      this.sig.addEventListener("close", (evt) => {
        if (this.heartbeat) own.stopHeart();
        own.connected = false;
        this.sig = null;
      });

      //add pending listeners to signaling object.
      var l = this.pendListeners.length;
      if (l > 0) {
        for (var i = 0; i < l; i++) {
          var item = this.pendListeners[i];
          this.on(item.event, item.f);
        }
        this.pendListeners = [];
      }
      //notify when a message is received from signal network.
      this.sig.addEventListener("message", (msg) => {
        var pkt = JSON.parse(msg.data);
        console.log("*signal*  signal message! ", pkt);
        var payload = pkt.p; //the actual message data sent
        var meta = pkt.m; //meta object
        var msgEvent = meta.o; //event label of message
        // var toPeer = meta.t; //msg to user (if private msg)
        var fromPeer = meta.f; //msg from user
        if (!!fromPeer) {
          //remove the peer path to display just the name not path.
          var p = fromPeer.split("/");
          fromPeer = p[p.length - 1];
        }
        switch (msgEvent) {
          //first connect, list of all peers connected.
          case "peers":
            //this is first call when you connect,
            //  so we can check for channelPath here dynamically.
            var sysNum = meta.f.lastIndexOf("__sys__");
            if (sysNum > -1 && !this.channelPath) {
              own.channelPath = meta.f.substring(0, sysNum); //save message path for sending.
              console.log("*signal*  channelPath ", this.channelPath);
            }
            //setUsers(payload.users);
            break;
          //new peer connected
          case "peer_connected":
            //addUser(fromPeer);
            break;
          //peer left.
          case "peer_removed":
            //removeUser(fromPeer);
            break;
          //message received. Call to display.
          case "message":
            //onUserMsg(payload.msg, fromPeer, toPeer);
            var data = payload.msg;
            data.f = fromPeer;
            if (
              data.type === "candidate" ||
              data.type === "offer" ||
              data.type === "answer" ||
              data.type === "custom"
            ) {
              own.emit(data.type, data);
            }
            break;
          default:
            break;
        }
        own.emit("message", msg.data);
      });
      //console.log('sig:  ',this.sig);
    };
    // User event, sends user message.
    _sig.prototype.sendMessage = function (msg, toPeer, info) {
      if (!info) info = {};
      console.log(
        "*signal*  sendMessage: ",
        msg,
        ", to: ",
        toPeer,
        " info: ",
        info
      );
      if (msg === undefined || msg.length < 1) return;
      var pkt = {
        t: "u", // user message service
        m: {
          f: this.channelPath + this.userName,
          o: !!info.m_event ? info.m_event : "message",
        },
        p: { msg: msg },
      };
      //if its to a peer, add direct message var (t) to meta object.
      if (!!toPeer) pkt.m.t = toPeer;
      //console.log('*signal*  sendMessage pkt: ',pkt);
      this.sig.send(JSON.stringify(pkt));

      return pkt;
    };

    //formats the custom channel path how we need it.
    _sig.prototype.cleanChPath = function (path) {
      //has slash at front
      if (path.indexOf("/") !== 0) path = "/" + path;
      if (path.lastIndexOf("/") === path.length - 1)
        path = path.substr(0, path.lastIndexOf("/"));
      //console.log('cleanChPath new path: '+path);
      return path;
    };

    //Keeps pinging signal server to keep connection alive.
    _sig.prototype.startHeart = function () {
      //console.log('*signal*  startHeart ',this.keepAliveInt);
      if (!!this.heartbeat) clearInterval(this.heartbeat);
      var own = this;
      this.heartbeat = setInterval(function () {
        own.sig.send("ping");
      }, $xirsys.signal.keepAliveInt);
    };
    _sig.prototype.stopHeart = function () {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
      //this.sig = null;
      console.log("signal closed!");
    };

    //events
    _sig.prototype.on = function (sEvent, cbFunc) {
      //console.log('*signal*  on ',sEvent,', func: '+cbFunc);
      if (!sEvent || !cbFunc) {
        console.log('error:  missing arguments for "on" event.');
        return false;
      }
      //if event does not exist create it and give it an array for listeners.
      if (!this.evtListeners[sEvent]) this.evtListeners[sEvent] = [];
      //add listener to event.
      this.evtListeners[sEvent].push(cbFunc);
    };
    _sig.prototype.off = function (sEvent, cbFunc) {
      if (!this.evtListeners.hasOwnProperty(sEvent)) return false; //end

      var index = this.evtListeners[sEvent].indexOf(cbFunc);
      if (index !== -1) {
        this.evtListeners[sEvent].splice(index, 1);
        return true; //else end here.
      }
      return false; //else end here.
    };

    _sig.prototype.emit = function (sEvent, data) {
      //console.log('*signal*  emit ',sEvent,', func: '+data);
      var handlers = this.evtListeners[sEvent];
      if (!!handlers) {
        var l = handlers.length;
        for (var i = 0; i < l; i++) {
          var item = handlers[i];
          item.apply(this, [{ type: sEvent, data: data }]);
        }
      }
    };
    console.log("$xirsys.signal Loaded Successfuly!!!");
    _sig = null;

    // p2p

    var _p2p = ($xirsys.p2p = function (signal, mediaStream, servers, info) {
      if (!info) info = {};
      //info can have TURN only filter.
      console.log(
        "*p2p*  servers: ",
        servers,
        ", mediaStream: ",
        mediaStream,
        ", sig: ",
        signal,
        ", info: ",
        info
      );
      this.evtListeners = {};
      this.pc = null; //peer connection

      var own = this;
      this.sig = signal;
      if (!!this.sig) {
        this.sig.on("candidate", (evt) => {
          own.receiveCandidate(evt);
        });
        this.sig.on("offer", (evt) => {
          own.receiveOffer(evt);
        });
        this.sig.on("answer", (evt) => {
          own.receiveAnswer(evt);
        });
      }
      this.servers = !!servers ? servers : {};
      this.forceTurn = info.forceTurn != null ? info.forceTurn : false;
      this.stream = mediaStream;
      this.remotePeerID = null;
      this.remoteStreams = {};

      this.isCaller = null; //true / false
      this.autoAnswer = info.autoAnswer != null ? info.autoAnswer : true;
    });

    _p2p.prototype.peerConnSuccess = "peer.connect.success";
    _p2p.prototype.peerConnRequest = "peer.connect.request";
    _p2p.prototype.iceDisconnected = "peer.connect.disconnected";

    _p2p.prototype.close = function () {
      if (this.pc) {
        this.pc.close();
      }
      this.remoteStreams = {};
      this.remotePeerID = null;
      this.isCaller = null;
    };
    //used to update the media and renegociate p2p connection.
    _p2p.prototype.updateMediaStream = function (mediaStream) {
      console.log("*p2p*  updateMediaStream ", mediaStream);

      this.stream = mediaStream;
      if (!!this.pc && this.stream) {
        this.isCaller = true;
        const own = this;
        // this.pc.addStream(this.stream);`
        this.stream.getTracks().forEach((track) => {
          own.pc.addTrack(track, own.stream);
        });
        this.pc
          .createOffer()
          .then((desc) => {
            own.setLocalAndSendMessage(desc);
          }) // success
          .catch((err) => {
            own.onCreateSessionDescriptionError(err);
          }); // error
      }
      return true;
    };
    //calls peer @custID and estblishes a p2p connection.
    _p2p.prototype.callPeer = function (custID) {
      console.log("*p2p*  callPeer ", custID);
      if (this.createPeerConnection() && this.stream) {
        //this flag tells our code we are doing the calling.
        console.log("this pc =>> ", this.pc, this);
        this.isCaller = true;
        const own = this;
        this.remotePeerID = custID;
        // this.pc.addStream(this.stream);
        this.stream.getTracks().forEach((track) => {
          own.pc.addTrack(track, own.stream);
        });
        this.pc
          .createOffer()
          .then((desc) => {
            own.setLocalAndSendMessage(desc);
          }) // success
          .catch((err) => {
            own.onCreateSessionDescriptionError(err);
          }); // error
      }
    };

    _p2p.prototype.receiveCandidate = function (evt) {
      if (!this.pc) return false;
      var iceCandidate = evt.data;
      //console.log('*p2p*  receiveCandidate ',iceCandidate);
      var rtcIceCandidate = new RTCIceCandidate(iceCandidate);
      this.pc.addIceCandidate(rtcIceCandidate);
    };

    //user calles to accept offer when this has autoAnswer false
    _p2p.prototype.acceptRequest = function (offer) {
      //Pass offer to method with true which tells method offer was accepted.
      this.receiveOffer(offer, true);
    };

    _p2p.prototype.receiveOffer = function (evt, isVerfied) {
      var verified = isVerfied === true;
      var desc = evt.data;
      console.log(
        "*p2p*  receiveOffer ",
        desc,
        " remotePeerID = ",
        this.remotePeerID,
        "autoAnswer",
        this.autoAnswer
      );
      //if autoAnser is false, and this has not been verified, stop and emit request event.
      if (!this.autoAnswer && !verified) {
        console.log("needs verification!");
        this.emit(this.peerConnRequest, evt.data);
        return;
      }
      var own = this;
      //if autoAnser is false and has been verfied, OR autoAnswer is true then connect us.
      if (!this.remotePeerID && !!desc.f) this.remotePeerID = desc.f;
      console.log("*p2p*  !pc ", this.pc, ", !iscaller: ", this.isCaller);
      if (!this.pc && !this.isCaller) {
        if (this.createPeerConnection() && this.stream) {
          // this.pc.addStream(this.stream);
          this.stream.getTracks().forEach((track) => {
            own.pc.addTrack(track, own.stream);
          });
        }
      }

      try {
        this.pc.setRemoteDescription(new RTCSessionDescription(desc));
      } catch (e) {
        console.error("**P2p** setRemoteDescription offer ,", e);
      }

      this.pc
        .createAnswer()
        .then((desc) => {
          own.setLocalAndSendMessage(desc);
        }) // success
        .catch((err) => {
          own.onCreateSessionDescriptionError(err);
        }); // error
    };

    _p2p.prototype.receiveAnswer = function (evt) {
      var desc = evt.data;
      console.log("*p2p*  receiveAnswer ", desc);
      if (this.remotePeerID !== desc.f) return; //not the droid were looking for.
      try {
        this.pc.setRemoteDescription(new RTCSessionDescription(desc));
      } catch (e) {
        console.error("**P2p** setRemoteDescription answer ,", e);
      }
    };

    _p2p.prototype.createPeerConnection = function () {
      console.log("*p2p*  createPeerConnection ");
      //if(!!this.pc) return true;
      try {
        var own = this;
        console.log("RTCPeerConnection servers:  ", this.servers);
        this.pc = new RTCPeerConnection(this.servers);

        this.pc.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            console.log(rstream, "rstreeeeem");
            rstream.addTrack(track);
          });
        };

        this.pc.onicecandidate = function (evt) {
          //send to peer
          var cand = evt.candidate;
          if (!cand) return;
          if (own.forceTurn && cand.candidate.indexOf("typ relay") === -1) {
            cand = null;
          } else {
            //console.log('Is Turn: ',own.forceTurn,' Candidate: ',cand);
            own.sig.sendMessage(
              {
                type: "candidate",
                candidate: cand.candidate,
                sdpMid: cand.sdpMid,
                sdpMLineIndex: cand.sdpMLineIndex,
              },
              own.remotePeerID
            );
          }
        };
        // this.pc.onaddstream = (evt) => {
        //   console.log("*p2p*  onaddstream ", evt);
        //   own.addRemoteStream(evt.stream); //remoteStreams
        // };
        this.pc.onremovestream = (evt) =>
          console.log("*p2p*  onremovestream ", evt);
        this.pc.onconnectionstatechange = (evt) =>
          console.log(
            "*p2p*  onconnectionstatechange: " + own.pc.connectionState
          );
        this.pc.oniceconnectionstatechange = (evt) => {
          console.log(
            "*p2p*  oniceconnectionstatechange: " + own.pc.iceConnectionState
          );

          // this.pc.ontrack = (event) => {
          //   event.streams[0].getTracks().forEach((track) => {
          //     own.addTrack(track);
          //   });
          // };

          switch (own.pc.iceConnectionState) {
            case "checking":
              break;
            case "connected":
              break;
            case "disconnected":
              own.emit(own.iceDisconnected, own.remotePeerID);
              break;
            case "failed":
              break;
            case "closed":
              own.pc = null;
              console.log("pc: ", own.pc);
              break;
            default:
              break;
          }
        };
        return true;
      } catch (e) {
        console.log("Failed to create PeerConnection, exception: " + e.message);
        return false;
      }
    };

    _p2p.prototype.hangup = function (callId) {
      console.log("*p2p*  hangup", callId);
      //var stream = this.remoteStreams[callId];
      this.pc.close();
      this.remoteStreams[callId] = null;
      this.remotePeerID = null;
      this.isCaller = false;
      //if no streams close and nulify pc.
      //this.pc = null;
    };

    _p2p.prototype.addTrack = function (track) {
      this.remoteStreams[this.remotePeerID] = track;
      this.emit(this.peerConnSuccess, this.remotePeerID);
      this.isCaller = false;
    };

    _p2p.prototype.addRemoteStream = function (remoteStream) {
      this.remoteStreams[this.remotePeerID] = remoteStream;
      this.emit(this.peerConnSuccess, this.remotePeerID);
      this.isCaller = false;
    };

    _p2p.prototype.getLiveStream = function (remotePeerID) {
      return this.remoteStreams[remotePeerID];
    };

    _p2p.prototype.setLocalAndSendMessage = function (sessionDescription) {
      console.log(
        "*p2p*  setLocalAndSendMessage sending message",
        sessionDescription
      );
      this.pc.setLocalDescription(sessionDescription);
      //sendMessage(sessionDescription);
      console.log("sendMessage for: ", this.remotePeerID);
      this.sig.sendMessage(sessionDescription, this.remotePeerID);
    };

    _p2p.prototype.onCreateSessionDescriptionError = function (error) {
      console.log("Failed to create session description: ", error);
    };

    /* EVENTS */

    _p2p.prototype.on = function (sEvent, cbFunc) {
      //console.log('*p2p*  on ',sEvent,', func: '+cbFunc);
      if (!sEvent || !cbFunc) {
        console.log("error:  missing arguments for on event.");
        return false;
      }
      if (!this.evtListeners[sEvent]) this.evtListeners[sEvent] = [];
      this.evtListeners[sEvent].push(cbFunc);
    };
    _p2p.prototype.off = function (sEvent, cbFunc) {
      console.log("off");
      this.evtListeners.push(cbFunc);
    };

    _p2p.prototype.emit = function (sEvent, data) {
      var handlers = this.evtListeners[sEvent];
      if (!!handlers) {
        var l = handlers.length;
        for (var i = 0; i < l; i++) {
          var item = handlers[i];
          item.apply(this, [{ type: sEvent, data: data }]);
        }
      }
    };

    console.log("$xirsys.p2p Loaded Successfuly!!!");
    _p2p = null;
  }, []);

  return { xirsys: $xirsys };
}

export default Xirsys;
