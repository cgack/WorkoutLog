/*! Copyright 2011 Trigger Corp. All rights reserved. */
(function(){var j={};j.config={browser_action:{default_title:"An example browser toolbar icon",default_popup:"index.html",default_icon:"img/logo-forge.png"},version:"0.1",logging:{level:"INFO"},name:"cfitlog",uuid:"dc40b818670e11e1a50712313d1adcbe"};var g={};g.listeners={};var c={};var f=[];var e=null;var i=false;var l=function(){if(f.length>0){if(!window.forge.debug||window.catalystConnected){i=true;while(f.length>0){var m=f.shift();if(m[0]=="logging.log"){console.log(m[1].message)}g.priv.call.apply(g.priv,m)}i=false}else{e=setTimeout(l,500)}}};g.priv={call:function(r,q,p,n){if((!window.forge.debug||window.catalystConnected)&&(f.length==0||i)){var m=j.tools.UUID();var o=true;if(r==="button.onClicked.addListener"||r==="message.toFocussed"){o=false}if(p||n){c[m]={success:p,error:n,onetime:o}}g.priv.send({callid:m,method:r,params:q})}else{f.push(arguments);if(!e){e=setTimeout(l,500)}}},send:function(m){throw new Error("Forge error: missing bridge to privileged code")},receive:function(m){if(m.callid){if(typeof c[m.callid]===undefined){j.log("Nothing stored for call ID: "+m.callid)}var o=c[m.callid];var n=(typeof m.content==="undefined"?null:m.content);if(o&&o[m.status]){o[m.status](m.content)}if(o&&o.onetime){delete c[m.callid]}}else{if(m.event){if(g.listeners[m.event]){g.listeners[m.event].forEach(function(p){if(m.params){p(m.params)}else{p()}})}}}}};g.addEventListener=function(m,n){if(g.listeners[m]){g.listeners[m].push(n)}else{g.listeners[m]=[n]}};g.generateQueryString=function(m){if(typeof m==="string"){return m}var n="";for(key in m){n+=encodeURIComponent(key)+"="+encodeURIComponent(m[key])+"&"}return n.substring(0,n.length-1)};g.generateMultipartString=function(m,o){if(typeof m==="string"){return""}var n="";for(key in m){n+="--"+o+"\r\n";n+='Content-Disposition: form-data; name="'+key.replace('"','\\"')+'"\r\n\r\n';n+=m[key].toString()+"\r\n"}return n},g.generateURI=function(n,m){var o="";if(n.indexOf("?")!==-1){o+=n.split("?")[1]+"&";n=n.split("?")[0]}o+=this.generateQueryString(m)+"&";o=o.substring(0,o.length-1);return n+(o?"?"+o:"")};j.is={mobile:function(){return false},desktop:function(){return false},android:function(){return false},ios:function(){return false},chrome:function(){return false},firefox:function(){return false},safari:function(){return false},ie:function(){return false},web:function(){return false},orientation:{portrait:function(){return false},landscape:function(){return false}}};j.button={setIcon:function(n,o,m){g.priv.call("button.setIcon",n,o,m)},setURL:function(n,o,m){g.priv.call("button.setURL",n,o,m)},onClicked:{addListener:function(m){g.priv.call("button.onClicked.addListener",null,m)}},setBadge:function(n,o,m){g.priv.call("button.setBadge",n,o,m)},setBadgeBackgroundColor:function(n,o,m){g.priv.call("button.setBadgeBackgroundColor",n,o,m)},setTitle:function(o,n,m){g.priv.call("button.setTitle",o,n,m)}};j.message={listen:function(n,o,m){m&&m({message:"Forge Error: message.listen must be overridden by platform specific code",type:"UNAVAILABLE"})},broadcast:function(n,o,p,m){m&&m({message:"Forge Error: message.broadcast must be overridden by platform specific code",type:"UNAVAILABLE"})},broadcastBackground:function(n,o,p,m){m&&m({message:"Forge Error: message.broadcastBackground must be overridden by platform specific code",type:"UNAVAILABLE"})},toFocussed:function(n,o,p,m){g.priv.call("message.toFocussed",{type:n,content:o},p,m)}};j.notification={create:function(p,o,n,m){g.priv.call("notification.create",{title:p,text:o},n,m)}};j.request={get:function(n,o,m){j.request.ajax({url:n,dataType:"text",success:o&&function(){try{arguments[0]=JSON.parse(arguments[0])}catch(p){}o.apply(this,arguments)},error:m})},ajax:function(o){var m=o.dataType;if(m=="xml"){o.dataType="text"}var p=o.success&&function(s){try{if(m=="xml"){var r,q;if(window.DOMParser){r=new DOMParser();q=r.parseFromString(s,"text/xml")}else{q=new ActiveXObject("Microsoft.XMLDOM");q.async="false";q.loadXML(s)}s=q}}catch(t){}o.success&&o.success(s)};var n=o.error&&function(q){if(q.status=="error"&&!q.err){j.logging.log("AJAX request to "+o.url+" failed, have you included that url in the permissions section of the config file for this app?")}o.error&&o.error(q)};g.priv.call("request.ajax",o,p,n)}};j.tools={UUID:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(o){var n=Math.random()*16|0;var m=o=="x"?n:(n&3|8);return m.toString(16)}).toUpperCase()},getURL:function(n,o,m){g.priv.call("tools.getURL",{name:n.toString()},o,m)}};var d=function(s,q,t){var o=[];stylize=function(v,u){return v};function m(u){return u instanceof RegExp||(typeof u==="object"&&Object.prototype.toString.call(u)==="[object RegExp]")}function n(u){return u instanceof Array||Array.isArray(u)||(u&&u!==Object.prototype&&n(u.__proto__))}function p(w){if(w instanceof Date){return true}if(typeof w!=="object"){return false}var u=Date.prototype&&Object.getOwnPropertyNames(Date.prototype);var v=w.__proto__&&Object.getOwnPropertyNames(w.__proto__);return JSON.stringify(v)===JSON.stringify(u)}function r(G,D){try{if(G&&typeof G.inspect==="function"&&!(G.constructor&&G.constructor.prototype===G)){return G.inspect(D)}switch(typeof G){case"undefined":return stylize("undefined","undefined");case"string":var u="'"+JSON.stringify(G).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return stylize(u,"string");case"number":return stylize(""+G,"number");case"boolean":return stylize(""+G,"boolean")}if(G===null){return stylize("null","null")}if(G instanceof Document){return(new XMLSerializer()).serializeToString(G)}var A=Object.keys(G);var H=q?Object.getOwnPropertyNames(G):A;if(typeof G==="function"&&H.length===0){var v=G.name?": "+G.name:"";return stylize("[Function"+v+"]","special")}if(m(G)&&H.length===0){return stylize(""+G,"regexp")}if(p(G)&&H.length===0){return stylize(G.toUTCString(),"date")}var w,E,B;if(n(G)){E="Array";B=["[","]"]}else{E="Object";B=["{","}"]}if(typeof G==="function"){var z=G.name?": "+G.name:"";w=" [Function"+z+"]"}else{w=""}if(m(G)){w=" "+G}if(p(G)){w=" "+G.toUTCString()}if(H.length===0){return B[0]+w+B[1]}if(D<0){if(m(G)){return stylize(""+G,"regexp")}else{return stylize("[Object]","special")}}o.push(G);var y=H.map(function(J){var I,K;if(G.__lookupGetter__){if(G.__lookupGetter__(J)){if(G.__lookupSetter__(J)){K=stylize("[Getter/Setter]","special")}else{K=stylize("[Getter]","special")}}else{if(G.__lookupSetter__(J)){K=stylize("[Setter]","special")}}}if(A.indexOf(J)<0){I="["+J+"]"}if(!K){if(o.indexOf(G[J])<0){if(D===null){K=r(G[J])}else{K=r(G[J],D-1)}if(K.indexOf("\n")>-1){if(n(G)){K=K.split("\n").map(function(L){return"  "+L}).join("\n").substr(2)}else{K="\n"+K.split("\n").map(function(L){return"   "+L}).join("\n")}}}else{K=stylize("[Circular]","special")}}if(typeof I==="undefined"){if(E==="Array"&&J.match(/^\d+$/)){return K}I=JSON.stringify(""+J);if(I.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)){I=I.substr(1,I.length-2);I=stylize(I,"name")}else{I=I.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'");I=stylize(I,"string")}}return I+": "+K});o.pop();var F=0;var x=y.reduce(function(I,J){F++;if(J.indexOf("\n")>=0){F++}return I+J.length+1},0);if(x>50){y=B[0]+(w===""?"":w+"\n ")+" "+y.join(",\n  ")+" "+B[1]}else{y=B[0]+w+" "+y.join(", ")+" "+B[1]}return y}catch(C){return"[No string representation]"}}return r(s,(typeof t==="undefined"?2:t))};var h=function(n,o){if("logging" in j.config){var m=j.config.logging.marker||"FORGE"}else{var m="FORGE"}n="["+m+"] "+(n.indexOf("\n")===-1?"":"\n")+n;g.priv.call("logging.log",{message:n,level:o});if(typeof console!=="undefined"){switch(o){case 10:if(console.debug!==undefined&&!(console.debug.toString&&console.debug.toString().match("alert"))){console.debug(n)}break;case 30:if(console.warn!==undefined&&!(console.warn.toString&&console.warn.toString().match("alert"))){console.warn(n)}break;case 40:case 50:if(console.error!==undefined&&!(console.error.toString&&console.error.toString().match("alert"))){console.error(n)}break;default:case 20:if(console.info!==undefined&&!(console.info.toString&&console.info.toString().match("alert"))){console.info(n)}break}}};var a=function(m,n){if(m in j.logging.LEVELS){return j.logging.LEVELS[m]}else{j.logging.__logMessage("Unknown configured logging level: "+m);return n}};var b=function(n){var q=function(r){if(r.message){return r.message}else{if(r.description){return r.description}else{return""+r}}};if(n){var p="\nError: "+q(n);try{if(n.lineNumber){p+=" on line number "+n.lineNumber}if(n.fileName){var m=n.fileName;p+=" in file "+m.substr(m.lastIndexOf("/")+1)}}catch(o){}if(n.stack){p+="\r\nStack trace:\r\n"+n.stack}return p}return""};j.logging={LEVELS:{ALL:0,DEBUG:10,INFO:20,WARNING:30,ERROR:40,CRITICAL:50},debug:function(n,m){j.logging.log(n,m,j.logging.LEVELS.DEBUG)},info:function(n,m){j.logging.log(n,m,j.logging.LEVELS.INFO)},warning:function(n,m){j.logging.log(n,m,j.logging.LEVELS.WARNING)},error:function(n,m){j.logging.log(n,m,j.logging.LEVELS.ERROR)},critical:function(n,m){j.logging.log(n,m,j.logging.LEVELS.CRITICAL)},log:function(n,m,q){if(typeof(q)==="undefined"){var q=j.logging.LEVELS.INFO}try{var o=a(j.config.logging.level,j.logging.LEVELS.ALL)}catch(p){var o=j.logging.LEVELS.ALL}if(q>=o){h(d(n)+b(m),q)}}};var k=function(q){if(q=="<all_urls>"){q="*://*"}q=q.split("://");var m=q[0];var o,p;if(q[1].indexOf("/")===-1){o=q[1];p=""}else{o=q[1].substring(0,q[1].indexOf("/"));p=q[1].substring(q[1].indexOf("/"))}var n="";if(m=="*"){n+=".*://"}else{n+=m+"://"}if(o=="*"){n+=".*"}else{if(o.indexOf("*.")===0){n+="(.+.)?"+o.substring(2)}else{n+=o}}n+=p.replace(/\*/g,".*");return"^"+n+"$"};j.tabs={open:function(n,o,p,m){if(typeof o==="function"){m=p;p=o;o=false}g.priv.call("tabs.open",{url:n,keepFocus:o},p,m)},openWithOptions:function(n,p,m){var o=undefined;if(n.pattern){o=k(n.pattern)}g.priv.call("tabs.open",{url:n.url,keepFocus:n.keepFocus,pattern:o},p,m)},closeCurrent:function(m){m=arguments[1]||m;var n=j.tools.UUID();location.hash=n;g.priv.call("tabs.closeCurrent",{hash:n},null,m)}};j.prefs={get:function(n,o,m){g.priv.call("prefs.get",{key:n.toString()},o&&function(p){if(p==="undefined"){p=undefined}else{try{p=JSON.parse(p)}catch(q){m({message:q.toString()});return}}o(p)},m)},set:function(n,o,p,m){if(o===undefined){o="undefined"}else{o=JSON.stringify(o)}g.priv.call("prefs.set",{key:n.toString(),value:o},p,m)},keys:function(n,m){g.priv.call("prefs.keys",{},n,m)},all:function(n,m){var n=n&&function(o){for(key in o){if(o[key]==="undefined"){o[key]=undefined}else{o[key]=JSON.parse(o[key])}}n(o)};g.priv.call("prefs.all",{},n,m)},clear:function(n,o,m){g.priv.call("prefs.clear",{key:n.toString()},o,m)},clearAll:function(n,m){g.priv.call("prefs.clearAll",{},n,m)}};j.file={getImage:function(n,o,m){if(typeof n==="function"){m=o;o=n}g.priv.call("file.getImage",{},o&&function(q){var p={uri:q,name:"Image"};for(prop in n){p[prop]=n[prop]}o(p)},m)},base64:function(n,o,m){g.priv.call("file.base64",n,o,m)},imageBase64:function(o,p,q,n){if(typeof p==="function"){n=q;q=p}var m={};for(prop in o){m[prop]=o[prop]}m.height=p.height||o.height||0;m.width=p.width||o.width||0;g.priv.call("file.base64",m,q,n)},URL:function(o,p,q,n){if(typeof p==="function"){n=q;q=p}var m={};for(prop in o){m[prop]=o[prop]}m.height=p.height||o.height||0;m.width=p.width||o.width||0;g.priv.call("file.URL",m,q,n)},isFile:function(n,o,m){if(!n||!("uri" in n)){o(false)}else{g.priv.call("file.isFile",n,o,m)}},cacheURL:function(n,o,m){g.priv.call("file.cacheURL",{url:n},o&&function(p){o({uri:p})},m)},"delete":function(n,o,m){g.priv.call("file.delete",n,o,m)},clearCache:function(n,m){g.priv.call("file.clearCache",{},n,m)}};j.event={menuPressed:{addListener:function(n,m){g.addEventListener("menuPressed",n)}},messagePushed:{addListener:function(n,m){g.addEventListener("event.messagePushed",n)}},orientationChange:{addListener:function(n,m){g.addEventListener("event.orientationChange",n)}}};j.contact={select:function(n,m){g.priv.call("contact.select",{},n,m)}};j.geolocation={getCurrentPosition:function(p,o,q){if(typeof(p)==="object"){var n=p,r=o,m=q}else{var r=p,m=o,n=q}return navigator.geolocation.getCurrentPosition(r,m,n)}};j.internal={ping:function(n,o,m){g.priv.call("internal.ping",{data:[n]},o,m)}};j.sms={send:function(p,o,m){if(p.to&&typeof p.to=="string"){p.to=[p.to]}var n={body:p.body||"",to:p.to||[]};g.priv.call("sms.send",n,o,m)}};g.priv.send=function(n){if(window.__forge["callJavaFromJavaScript"]===undefined){return}var m=((n.params!==undefined)?JSON.stringify(n.params):"");window.__forge["callJavaFromJavaScript"](n.callid,n.method,m)};g.priv.get=function(){var m=JSON.parse(window.__forge["getObjects"]());m.forEach(function(n){g.priv.receive(n)})};window.addEventListener("load",function(){g.priv.call("internal.hideLaunchImage",{},function(){},function(){})},false);g.currentOrientation;g.addEventListener("internal.orientationChange",function(m){if(g.currentOrientation!=m.orientation){g.currentOrientation=m.orientation;g.priv.receive({event:"event.orientationChange"})}});j.is.mobile=function(){return true};j.is.android=function(){return true};j.is.orientation.portrait=function(){return g.currentOrientation=="portrait"};j.is.orientation.landscape=function(){return g.currentOrientation=="landscape"};j.tools.getURL=function(o,m,n){o=o.toString();if(o.indexOf("http://")===0||o.indexOf("https://")===0){m(o)}else{m("file:///android_asset/src"+((o.indexOf("/")===0)?o:("/"+o)))}};j.request.ajax=function(C){var o=(C.files?C.files:null);var u=(C.fileUploadMethod?C.fileUploadMethod:"multipart");var p=(C.url?C.url:null);var B=(C.success?C.success:undefined);var w=(C.error?C.error:undefined);var t=(C.username?C.username:null);var A=(C.password?C.password:null);var n=(C.accepts?C.accepts:["*/*"]);var m=(C.cache?C.cache:false);var z=(C.contentType?C.contentType:null);var s=(C.data?C.data:null);var y=(C.dataType?C.dataType:null);var r=(C.headers?C.headers:{});var x=(C.timeout?C.timeout/1000:60);var v=(C.type?C.type:"GET");if(typeof n==="string"){n=[n]}var q=null;if(o){v="POST";if(u=="multipart"){q=j.tools.UUID().replace(/-/g,"");s=g.generateMultipartString(s,q);z="multipart/form-data; boundary="+q}else{if(u=="raw"){if(o.length>1){j.logging.warning("Only one file can be uploaded at once with type 'raw'");o=[o[0]]}s=null;z="image/jpg"}}}else{if(v=="GET"){p=g.generateURI(p,s);s=null}else{if(s){s=g.generateQueryString(s);if(!z){z="application/x-www-form-urlencoded"}}}}if(m){m={};m["wm"+Math.random()]=Math.random();p=g.generateURI(p,m)}if(n){r.Accept=n.join(",")}if(z){r["Content-Type"]=z}g.priv.call("request.ajax",{url:p,username:t,password:A,data:s,headers:r,timeout:x,type:v,boundary:q,files:o,fileUploadMethod:u},B&&function(F){try{if(y=="xml"){var E,D;if(window.DOMParser){E=new DOMParser();D=E.parseFromString(F,"text/xml")}else{D=new ActiveXObject("Microsoft.XMLDOM");D.async="false";D.loadXML(F)}F=D}else{if(y=="json"){F=JSON.parse(F)}}}catch(G){}B(F)},w)};window.forge={config:j.config,is:{mobile:j.is.mobile,desktop:j.is.desktop,android:j.is.android,ios:j.is.ios,chrome:j.is.chrome,firefox:j.is.firefox,safari:j.is.safari,ie:j.is.ie,web:j.is.web,orientation:{portrait:j.is.orientation.portrait,landscape:j.is.orientation.landscape}},message:{listen:j.message.listen,broadcast:j.message.broadcast,broadcastBackground:j.message.broadcastBackground,toFocussed:j.message.toFocussed},notification:{create:j.notification.create},request:{get:j.request.get,ajax:j.request.ajax},logging:{log:j.logging.log,debug:j.logging.debug,info:j.logging.info,warning:j.logging.warning,error:j.logging.error,critical:j.logging.critical},tabs:{open:j.tabs.open,openWithOptions:j.tabs.openWithOptions,closeCurrent:j.tabs.closeCurrent},tools:{UUID:j.tools.UUID,getURL:j.tools.getURL},prefs:{get:j.prefs.get,set:j.prefs.set,clear:j.prefs.clear,clearAll:j.prefs.clearAll,keys:j.prefs.keys},button:{setIcon:j.button.setIcon,setURL:j.button.setURL,onClicked:{addListener:j.button.onClicked.addListener},setBadge:j.button.setBadge,setBadgeBackgroundColor:j.button.setBadgeBackgroundColor,setTitle:j.button.setTitle},file:{getImage:j.file.getImage,isFile:j.file.isFile,URL:j.file.URL,imageURL:j.file.URL,imageBase64:j.file.imageBase64,base64:j.file.base64,cacheURL:j.file.cacheURL,"delete":j.file["delete"],clearCache:j.file.clearCache},event:{menuPressed:{addListener:j.event.menuPressed.addListener},messagePushed:{addListener:j.event.messagePushed.addListener},orientationChange:{addListener:j.event.orientationChange.addListener}},contact:{select:j.contact.select},geolocation:{getCurrentPosition:j.geolocation.getCurrentPosition},internal:{ping:j.internal.ping},sms:{send:j.sms.send}};window.forge["ajax"]=j.request.ajax;window.forge["getPage"]=j.request.get;window.forge["createNotification"]=j.notification.create;window.forge["UUID"]=j.tools.UUID;window.forge["getURL"]=j.tools.getURL;window.forge["log"]=j.logging.log;window.forge["button"]["setUrl"]=j.button.setURL;window.forge["button"]["setBadgeText"]=j.button.setBadge;window.forge["_get"]=g.priv.get;window.forge["_receive"]=g.priv.receive;window.forge["_dispatchMessage"]=g.dispatchMessage})();