/*! For license information please see main.08acf3bc.chunk.js.LICENSE.txt */
(this.webpackJsonpreactapp=this.webpackJsonpreactapp||[]).push([[0],{13:function(e,t,n){},40:function(e,t,n){"use strict";n.r(t);var s=n(0),o=n.n(s),i=n(7),r=n.n(i),a=(n(13),n(2)),c=n(8),l=n.n(c),u=n(6),h=n.n(u),p=n(1);var f=function(e){var t=e.stream,n=e.lstream,o=Object(s.useState)(new h.a),i=Object(a.a)(o,1)[0],r=Object(s.useState)(new h.a),c=Object(a.a)(r,1)[0],l=Object(s.useState)(0),u=Object(a.a)(l,2),f=u[0],d=u[1],g=Object(s.useRef)(null);return Object(s.useEffect)((function(){var e=setTimeout((function(){d((function(e){return e+1}))}),1e3);return function(){return clearTimeout(e)}}),[f]),Object(s.useEffect)((function(){return i.stopStream(),c.stopStream(),t&&t.active&&i.fromStream(t,"wave",{type:"shine",colors:["rgba(149, 54, 64,1)","white","blue"]}),n&&n.active&&c.fromStream(n,"lwave",{type:"shine",colors:["rgba(45, 134, 233, 1)","white","blue"]}),console.log("Start streaming audio ...,",t),g.current.srcObject=t,function(){i.stopStream(),c.stopStream()}}),[n,t,f]),Object(p.jsxs)("div",{children:[Object(p.jsx)("canvas",{id:"wave"}),Object(p.jsx)("br",{}),Object(p.jsx)("canvas",{id:"lwave"}),Object(p.jsx)("audio",{ref:g,style:{display:"none"},volume:"true",autoPlay:!0})]})},d=n(4),g=n.n(d);var v=function(e,t){var n=Object(s.useState)(new Object),o=Object(a.a)(n,1)[0];return Object(s.useEffect)((function(){var n=o.media=function(e){var t=this;e||(e={}),console.log("*media*  info: ",e),this.info=e,this.evtListeners={},this.getLocalDevices().then((function(e){t.updateDevices(e)}))};n.prototype.localDevices=null,n.prototype.localStream=null,n.prototype.DEVICES_UPDATED="devicesUpdated",n.prototype.ON_LOCAL_STREAM="onLocalStream",n.prototype.getUserMedia=function(e,t,n){e||(e={audio:!0,video:!0});var s=this;return navigator.mediaDevices.getUserMedia(e).then((function(e){return s.localStream=e,s.emit(s.ON_LOCAL_STREAM,e),e}))},n.prototype.getLocalDevices=function(){if(navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices)return navigator.mediaDevices.enumerateDevices();console.log("Error: Could not get list of media devices!  This might not be supported by this browser.")},n.prototype.updateDevices=function(e){if(console.log("*media*  updateDevices ",e),0!==arguments.length){var t={audioin:[],videoin:[]};e.forEach((function(e){if("default"===e.deviceId)return t.defaults||(t.defaults=[]),void t.defaults.push(e);switch(e.kind){case"audioinput":"default"!==e.deviceId&&t.audioin.push(e);break;case"videoinput":"default"!==e.deviceId&&t.videoin.push(e)}})),this.localDevices=t,this.emit(this.DEVICES_UPDATED,this.localDevices)}},n.prototype.on=function(e,t){if(!e||!t)return console.log('error:  missing arguments for "on" event.'),!1;this.evtListeners[e]||(this.evtListeners[e]=[]),this.evtListeners[e].push(t)},n.prototype.off=function(e,t){if(!this.evtListeners.hasOwnProperty(e))return!1;var n=this.evtListeners[e].indexOf(t);return-1!==n&&(this.evtListeners[e].splice(n,1),!0)},n.prototype.emit=function(e,t){var n=this.evtListeners[e];if(n){var s,o=n.length;for(s=0;s<o;s++){n[s].apply(this,[{type:e,data:t}])}}},console.log("$xirsys.media Loaded Successfuly!!!"),n=null;var s=o.ice=function(e,t){t||(t={}),this.info=t,this.apiUrl=e||"/webrtc",this.evtListeners={},this.channelPath=t.channel?this.cleanChPath(t.channel):"",this.iceServers=null,this.apiUrl&&(this.info.ident&&this.info.secret?this.doICE(this.info.ident,this.info.secret):this.doICE())};s.prototype.onICEList="onICEList",s.prototype.doICE=function(e,t){console.log("*ice*  doICE: ",this.apiUrl+"/_turn"+this.channelPath);var n=this,s=new XMLHttpRequest;s.onreadystatechange=function(e){if(4===s.readyState&&200===s.status){var t=JSON.parse(s.responseText);console.log("*ice*  response: ",t),n.iceServers=n.filterPaths(t.v.iceServers),n.emit(n.onICEList)}};var o=this.apiUrl+"/_turn/"+this.channelPath;s.open("PUT",o,!0),e&&t&&s.setRequestHeader("Authorization","Basic "+btoa("".concat(e,":").concat(t))),s.send()},s.prototype.filterPaths=function(e){var t,n=e.length,s=[];for(t=0;t<n;t++){var o=e[t],i=o.url;i&&(o.urls=i,delete o.url),s.push(o)}return s},s.prototype.cleanChPath=function(e){return console.log("cleanChPath path recv: "+e),0!==e.indexOf("/")&&(e="/"+e),e.lastIndexOf("/")===e.length-1&&(e=e.substr(0,e.lastIndexOf("/"))),console.log("cleanChPath new path: "+e),e},s.prototype.on=function(e,t){if(!e||!t)return console.log("error:  missing arguments for on event."),!1;this.evtListeners[e]||(this.evtListeners[e]=[]),this.evtListeners[e].push(t)},s.prototype.off=function(e,t){if(!this.evtListeners.hasOwnProperty(e))return!1;var n=this.evtListeners[e].indexOf(t);return-1!==n&&(this.evtListeners[e].splice(n,1),!0)},s.prototype.emit=function(e,t){var n=this.evtListeners[e];if(n)for(var s=n.length,o=0;o<s;o++){n[o].apply(this,[{type:this.onICEList}])}},console.log("$xirsys.ice Loaded Successfuly!!!"),s=null;var i=o.signal=function(e,t,n){n||(n={}),this.info=n,this.sig=null,this.tmpToken=null,this.sigHostPath=null,this.pendListeners=[],this.heartbeat=null,this.evtListeners={},this.userName=t||null,this.apiUrl=e||"/webrtc",this.connectTo(n.channel?n.channel:"")};i.prototype.ver="v2",i.prototype.keepAliveInt=800,i.prototype.connected=!1,i.prototype.close=function(){console.log("close ",this.sig),this.heartbeat&&this.stopHeart(),this.sig&&this.sig.close()},i.prototype.connectTo=function(e){if(this.channelPath=e?this.cleanChPath(e):"",console.log("connectTo: ",this.channelPath),this.sig){this.close();var t=this;setTimeout((function(){t.doToken()}),800)}else this.apiUrl?this.info.ident&&this.info.secret?this.doToken(this.info.ident,this.info.secret):this.doToken():console.log("Error: Could connect signal!");return!0},i.prototype.doToken=function(e,t){var n=this.apiUrl+"/_token"+this.channelPath+"?k="+this.userName;console.log("*signal*  PUT doToken to "+n);var s=this,o={};e&&t&&(o.Authorization="Basic "+btoa(e+":"+t)),g.a.ajax({url:n,type:"PUT",dataType:"json",headers:o,error:function(e){console.log("*signal*  error: ",e)},success:function(e){s.tmpToken=e.v,"no_namespace"!==s.tmpToken?(console.log("*signal*  token: ",s.tmpToken),s.info.ident&&s.info.secret?s.doSignal(s.info.ident,s.info.secret):s.doSignal()):console.log("*signal*  fail: ",s.tmpToken)}})},i.prototype.doSignal=function(t,n){console.log("*signal*  GET doSignal to "+this.apiUrl+"/_host"+this.channelPath+"?type=signal&k="+this.userName);var s=this,o=this.info.channel?this.apiUrl+"/_host"+this.channelPath+"?type=signal&k="+this.userName:this.apiUrl+"/_host?type=signal&k="+this.userName,i={};t&&n&&(i.Authorization="Basic "+btoa(t+":"+n)),g.a.ajax({url:o,type:"GET",dataType:"json",headers:i,error:function(e){console.log("*signal*  error: ",e)},success:function(t){s.host=t.v+"/"+s.ver+"/"+s.tmpToken,console.log("KKKKKKKKK ",t),t.randomUser&&(s.randomUser=t.randomUser,e(t.randomUser)),t.users&&(s.users=t.users),console.log("signal host: ",s.host),s.setupSocket()}})},i.prototype.setupSocket=function(){var e=this;console.log("*signal*  setupSocket to "+this.host);var t=this;this.sig=new WebSocket(this.host),this.sig.addEventListener("open",(function(e){t.startHeart(),t.connected=!0})),this.sig.addEventListener("close",(function(n){e.heartbeat&&t.stopHeart(),t.connected=!1,e.sig=null}));var n=this.pendListeners.length;if(n>0){for(var s=0;s<n;s++){var o=this.pendListeners[s];this.on(o.event,o.f)}this.pendListeners=[]}this.sig.addEventListener("message",(function(n){var s=JSON.parse(n.data);console.log("*signal*  signal message! ",s);var o=s.p,i=s.m,r=i.o,a=i.f;if(a){var c=a.split("/");a=c[c.length-1]}switch(r){case"peers":var l=i.f.lastIndexOf("__sys__");l>-1&&!e.channelPath&&(t.channelPath=i.f.substring(0,l),console.log("*signal*  channelPath ",e.channelPath));break;case"peer_connected":case"peer_removed":break;case"message":var u=o.msg;u.f=a,"candidate"!==u.type&&"offer"!==u.type&&"answer"!==u.type&&"custom"!==u.type||t.emit(u.type,u)}t.emit("message",n.data)}))},i.prototype.sendMessage=function(e,t,n){if(n||(n={}),console.log("*signal*  sendMessage: ",e,", to: ",t," info: ",n),!(void 0===e||e.length<1)){var s={t:"u",m:{f:this.channelPath+this.userName,o:n.m_event?n.m_event:"message"},p:{msg:e}};return t&&(s.m.t=t),this.sig.send(JSON.stringify(s)),s}},i.prototype.cleanChPath=function(e){return 0!==e.indexOf("/")&&(e="/"+e),e.lastIndexOf("/")===e.length-1&&(e=e.substr(0,e.lastIndexOf("/"))),e},i.prototype.startHeart=function(){this.heartbeat&&clearInterval(this.heartbeat);var e=this;this.heartbeat=setInterval((function(){e.sig.send("ping")}),o.signal.keepAliveInt)},i.prototype.stopHeart=function(){clearInterval(this.heartbeat),this.heartbeat=null,console.log("signal closed!")},i.prototype.on=function(e,t){if(!e||!t)return console.log('error:  missing arguments for "on" event.'),!1;this.evtListeners[e]||(this.evtListeners[e]=[]),this.evtListeners[e].push(t)},i.prototype.off=function(e,t){if(!this.evtListeners.hasOwnProperty(e))return!1;var n=this.evtListeners[e].indexOf(t);return-1!==n&&(this.evtListeners[e].splice(n,1),!0)},i.prototype.emit=function(e,t){var n=this.evtListeners[e];if(n)for(var s=n.length,o=0;o<s;o++){n[o].apply(this,[{type:e,data:t}])}},console.log("$xirsys.signal Loaded Successfuly!!!"),i=null;var r=o.p2p=function(e,t,n,s){s||(s={}),console.log("*p2p*  servers: ",n,", mediaStream: ",t,", sig: ",e,", info: ",s),this.evtListeners={},this.pc=null;var o=this;this.sig=e,this.sig&&(this.sig.on("candidate",(function(e){o.receiveCandidate(e)})),this.sig.on("offer",(function(e){o.receiveOffer(e)})),this.sig.on("answer",(function(e){o.receiveAnswer(e)}))),this.servers=n||{},this.forceTurn=null!=s.forceTurn&&s.forceTurn,this.stream=t,this.remotePeerID=null,this.remoteStreams={},this.isCaller=null,this.autoAnswer=null==s.autoAnswer||s.autoAnswer};r.prototype.peerConnSuccess="peer.connect.success",r.prototype.peerConnRequest="peer.connect.request",r.prototype.iceDisconnected="peer.connect.disconnected",r.prototype.close=function(){this.pc&&this.pc.close(),this.remoteStreams={},this.remotePeerID=null,this.isCaller=null},r.prototype.updateMediaStream=function(e){if(console.log("*p2p*  updateMediaStream ",e),this.stream=e,this.pc&&this.stream){this.isCaller=!0;var t=this;this.stream.getTracks().forEach((function(e){t.pc.addTrack(e,t.stream)})),this.pc.createOffer().then((function(e){t.setLocalAndSendMessage(e)})).catch((function(e){t.onCreateSessionDescriptionError(e)}))}return!0},r.prototype.callPeer=function(e){if(console.log("*p2p*  callPeer ",e),this.createPeerConnection()&&this.stream){console.log("this pc =>> ",this.pc,this),this.isCaller=!0;var t=this;this.remotePeerID=e,this.stream.getTracks().forEach((function(e){t.pc.addTrack(e,t.stream)})),this.pc.createOffer().then((function(e){t.setLocalAndSendMessage(e)})).catch((function(e){t.onCreateSessionDescriptionError(e)}))}},r.prototype.receiveCandidate=function(e){if(!this.pc)return!1;var t=e.data,n=new RTCIceCandidate(t);this.pc.addIceCandidate(n)},r.prototype.acceptRequest=function(e){this.receiveOffer(e,!0)},r.prototype.receiveOffer=function(e,t){var n=!0===t,s=e.data;if(console.log("*p2p*  receiveOffer ",s," remotePeerID = ",this.remotePeerID,"autoAnswer",this.autoAnswer),!this.autoAnswer&&!n)return console.log("needs verification!"),void this.emit(this.peerConnRequest,e.data);var o=this;!this.remotePeerID&&s.f&&(this.remotePeerID=s.f),console.log("*p2p*  !pc ",this.pc,", !iscaller: ",this.isCaller),this.pc||this.isCaller||this.createPeerConnection()&&this.stream&&this.stream.getTracks().forEach((function(e){o.pc.addTrack(e,o.stream)}));try{this.pc.setRemoteDescription(new RTCSessionDescription(s))}catch(i){console.error("**P2p** setRemoteDescription offer ,",i)}this.pc.createAnswer().then((function(e){o.setLocalAndSendMessage(e)})).catch((function(e){o.onCreateSessionDescriptionError(e)}))},r.prototype.receiveAnswer=function(e){var t=e.data;if(console.log("*p2p*  receiveAnswer ",t),this.remotePeerID===t.f)try{this.pc.setRemoteDescription(new RTCSessionDescription(t))}catch(n){console.error("**P2p** setRemoteDescription answer ,",n)}},r.prototype.createPeerConnection=function(){console.log("*p2p*  createPeerConnection ");try{var e=this;return console.log("RTCPeerConnection servers:  ",this.servers),this.pc=new RTCPeerConnection(this.servers),this.pc.ontrack=function(e){e.streams[0].getTracks().forEach((function(e){console.log(t,"rstreeeeem"),t.addTrack(e)}))},this.pc.onicecandidate=function(t){var n=t.candidate;n&&(e.forceTurn&&-1===n.candidate.indexOf("typ relay")?n=null:e.sig.sendMessage({type:"candidate",candidate:n.candidate,sdpMid:n.sdpMid,sdpMLineIndex:n.sdpMLineIndex},e.remotePeerID))},this.pc.onremovestream=function(e){return console.log("*p2p*  onremovestream ",e)},this.pc.onconnectionstatechange=function(t){return console.log("*p2p*  onconnectionstatechange: "+e.pc.connectionState)},this.pc.oniceconnectionstatechange=function(t){switch(console.log("*p2p*  oniceconnectionstatechange: "+e.pc.iceConnectionState),e.pc.iceConnectionState){case"checking":case"connected":break;case"disconnected":e.emit(e.iceDisconnected,e.remotePeerID);break;case"failed":break;case"closed":e.pc=null,console.log("pc: ",e.pc)}},!0}catch(n){return console.log("Failed to create PeerConnection, exception: "+n.message),!1}},r.prototype.hangup=function(e){console.log("*p2p*  hangup",e),this.pc.close(),this.remoteStreams[e]=null,this.remotePeerID=null,this.isCaller=!1},r.prototype.addTrack=function(e){this.remoteStreams[this.remotePeerID]=e,this.emit(this.peerConnSuccess,this.remotePeerID),this.isCaller=!1},r.prototype.addRemoteStream=function(e){this.remoteStreams[this.remotePeerID]=e,this.emit(this.peerConnSuccess,this.remotePeerID),this.isCaller=!1},r.prototype.getLiveStream=function(e){return this.remoteStreams[e]},r.prototype.setLocalAndSendMessage=function(e){console.log("*p2p*  setLocalAndSendMessage sending message",e),this.pc.setLocalDescription(e),console.log("sendMessage for: ",this.remotePeerID),this.sig.sendMessage(e,this.remotePeerID)},r.prototype.onCreateSessionDescriptionError=function(e){console.log("Failed to create session description: ",e)},r.prototype.on=function(e,t){if(!e||!t)return console.log("error:  missing arguments for on event."),!1;this.evtListeners[e]||(this.evtListeners[e]=[]),this.evtListeners[e].push(t)},r.prototype.off=function(e,t){console.log("off"),this.evtListeners.push(t)},r.prototype.emit=function(e,t){var n=this.evtListeners[e];if(n)for(var s=n.length,o=0;o<s;o++){n[o].apply(this,[{type:e,data:t}])}},console.log("$xirsys.p2p Loaded Successfuly!!!"),r=null}),[]),{$xirsys:o}};var m=function(){console.log("channel path: ","");var e={audio:!0},t=Object(s.useState)(null),n=Object(a.a)(t,2),o=n[0],i=n[1],r=Object(s.useState)(new MediaStream),c=Object(a.a)(r,2),l=c[0],u=c[1],h=Object(s.useState)(null),p=Object(a.a)(h,2),f=p[0],d=p[1],m=Object(s.useState)(null),b=Object(a.a)(m,2),y=b[0],O=b[1],S=Object(s.useState)(!1),j=Object(a.a)(S,2),C=j[0],L=j[1],P=Object(s.useState)(null),T=Object(a.a)(P,2),E=T[0],w=T[1],D=Object(s.useState)(null),I=Object(a.a)(D,2),k=I[0],x=I[1],M=Object(s.useState)(null),A=Object(a.a)(M,2),U=A[0],_=A[1],R=Object(s.useState)(null),N=Object(a.a)(R,2),K=N[0],H=N[1],F=Object(s.useState)(!1),q=Object(a.a)(F,2),B=q[0],J=q[1],V=Object(s.useState)(!1),$=Object(a.a)(V,2),z=$[0],G=$[1],W=v(O,l).$xirsys;function X(e){console.log("onICE ",e),e.type===K.onICEList&&_(new W.media)}function Q(){k.on("message",(function(e){var t=JSON.parse(e.data);console.log("message log ,",e,W);var n=t.p,s=t.m,i=s.o,r=s.f;if(r){var a=r.split("/");r=a[a.length-1]}switch(i){case"peers":if(function(){console.log("* onReady!");var e="true"===te("isTURN");console.log("isTURN ",e),w(new W.p2p(k,o,K?{iceServers:K.iceServers}:{},{forceTurn:e}))}(),y)n.users.indexOf(y)>-1&&J(!0);break;case"peer_removed":r===y&&Z()}}))}function Y(e){console.log("*main*  onStartCall ",e);var t,n=e.data;console.log("peer scall ",E),t=E.getLiveStream(n),console.log("*main*  setRemoteStream & Video obj ",t),console.log(W.pc,"PC"),L(!0),O(n),G(!0)}function Z(){console.log("*main*  onStopCall "),z&&E.hangup(y),G(!1),O(null),H(null),w(null),_(null),x(null),L(!1)}function ee(e){switch(console.log("*main*  onMediaDevices: ",e," data: ",e.data),e.type){case U.DEVICES_UPDATED:!function(e){var t=e.audioin,n=e.videoin;console.log("*main*  updateDevices - mics:",t,", cams:",n);var s=g()("#ctrlMenu #camList"),o=g()("#ctrlMenu #micList");o.empty(),t.forEach((function(e){o.append('<li><a id="'+e.deviceId+'" data-group-id="'+e.groupId+'" class="btn" role="button">'+e.label+"</a></li>")})),s.empty(),n.forEach((function(e){s.append('<li><a id="'+e.deviceId+'" data-group-id="'+e.groupId+'" class="btn" role="button">'+e.label+"</a></li>")}))}(e.data);break;case U.ON_LOCAL_STREAM:t=e.data.getTracks(),console.log("*main*  setSelectedDevices: ",t),t.forEach((function(e){switch(e.kind){case"audio":console.log("- audio toggel: ",e),g()("#ctrlMenu #micToggle").html(e.label.substr(0,20)+'<span class="caret"></span>');break;case"video":console.log("- video toggel: ",e),g()("#ctrlMenu #camToggle").html(e.label.substr(0,20)+'<span class="caret"></span>')}}))}var t}function te(e){var t=window.location.href,n=new URL(t).searchParams.get(e);return n||null}return Object(s.useEffect)((function(){o&&(k||x(new W.signal("/webrtc",f,{channel:""})),E&&E.updateMediaStream(o))}),[o]),Object(s.useEffect)((function(){E&&(E.on(E.peerConnSuccess,Y),console.log("peer ",E)),console.log("peer ",E)}),[E]),Object(s.useEffect)((function(){B&&(y?(console.log("Calling "+y),E.callPeer(y)):console.log("Error","A remote peer was not found!"),J(!1))}),[B]),Object(s.useEffect)((function(){k&&Q()}),[k]),Object(s.useEffect)((function(){U&&(console.log("getMyMedia()"),U.on(U.DEVICES_UPDATED,ee),U.on(U.ON_LOCAL_STREAM,ee),U.getUserMedia(e).then((function(e){console.log("*main*  getUser Media stream: ",e),function(e){console.log("*main*  setLocalStream & Video obj ",e),i(e)}(e)})).catch((function(e){console.log("Could not get Media: ",e),alert("Could not get Media!! Please check your camera and mic.")})))}),[U]),Object(s.useEffect)((function(){K&&K.on(K.onICEList,X)}),[K]),Object(s.useEffect)((function(){console.log("remote Id == ",y),k&&y&&y!==f&&Q()}),[y]),{onLoad:function(){console.log("pretty loaded!!"),d(function(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"user")+e()+e()}());var e=te("callid");e&&O(e),console.log("doICE "),K||H(new W.ice("/webrtc",{channel:""}))},lstream:o,rstream:l,setLStream:i,setRStream:u,onStopCall:Z,startCall:C}};var b=function(e){var t=e.type,n=void 0===t?0:t,o=e.answer,i=m(),r=i.onLoad,c=i.lstream,u=i.rstream,h=i.setRStream,d=i.setLStream,g=i.onStopCall,v=i.startCall,b=Object(s.useState)(null),O=Object(a.a)(b,2),S=O[0],j=O[1];return Object(s.useEffect)((function(){0===n?(d(null),h(null),y(c),y(u),g()):1===n&&r(),2!==n&&j(null)}),[n]),Object(s.useEffect)((function(){v&&o()}),[v]),Object(s.useEffect)((function(){var e=setInterval((function(){var e=u;e&&e.active&&(console.log("answer call"),j(e),o())}),5e3);return function(){return clearInterval(e)}}),[]),1===n?Object(p.jsx)(l.a,{type:"Bars",color:"rgba(102, 193, 113, 1)",height:80,width:80}):2===n&&S?Object(p.jsx)(f,{stream:S,lstream:c}):Object(p.jsx)("div",{})};function y(e){e&&e.getTracks().forEach((function(e){"live"===e.readyState&&"audio"===e.kind&&e.stop()}))}var O=function(){var e=Object(s.useState)(0),t=Object(a.a)(e,2),n=t[0],o=t[1],i=Object(s.useState)("Call"),r=Object(a.a)(i,2),c=r[0],l=r[1];return{state:n,click:function(){0===n&&(o(1)||l("Dialling")),1===n&&(o(0)||l("Call")),2===n&&(o(0)||l("Call"))},btnText:c,answer:function(){console.log("answer fire"),o(2),l("End")}}};var S=function(){var e=O(),t=e.state,n=e.click,s=e.btnText,o=e.answer;return Object(p.jsxs)("div",{className:"App",children:[Object(p.jsx)("div",{className:"logo",children:Object(p.jsx)("h4",{children:"TalkTime"})}),Object(p.jsx)("div",{children:Object(p.jsx)("h5",{children:"Find someone to talk to."})}),Object(p.jsx)("div",{className:"audio-animation",children:Object(p.jsx)(b,{type:t,answer:o})}),Object(p.jsx)("div",{className:"button",children:Object(p.jsx)("button",{onClick:n,className:s,children:s})}),Object(p.jsxs)("div",{className:"footer",children:[Object(p.jsx)("a",{href:"/privacy",children:"Privacy Policy"})," | ",Object(p.jsx)("a",{href:"/terms",children:"Terms"})]})]})},j=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,41)).then((function(t){var n=t.getCLS,s=t.getFID,o=t.getFCP,i=t.getLCP,r=t.getTTFB;n(e),s(e),o(e),i(e),r(e)}))};r.a.render(Object(p.jsx)(o.a.StrictMode,{children:Object(p.jsx)(S,{})}),document.getElementById("root")),j()}},[[40,1,2]]]);
//# sourceMappingURL=main.08acf3bc.chunk.js.map