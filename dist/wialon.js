/**
 wialonjs-api 0.0.4, a JS library for Wialon Remote API
 Copyright (c) 2015, Gurtam (http://gurtam.com)
*/
!function(window){function expose(){var t=window.W;W.noConflict=function(){return window.W=t,this},window.W=W}var W={version:"0.0.4",debug:!1};"object"==typeof module&&"object"==typeof module.exports?module.exports=W:"function"==typeof define&&define.amd&&define(W),"undefined"!=typeof window&&expose(),W.Util={extend:function(t){var e,i,s,n;for(i=1,s=arguments.length;s>i;i++){n=arguments[i];for(e in n)t[e]=n[e]}return t},create:Object.create||function(){function t(){}return function(e){return t.prototype=e,new t}}(),stamp:function(t){return t._id=t._id||++W.Util.lastId,t._id},lastId:0,falseFn:function(){return!1},formatNum:function(t,e){var i=Math.pow(10,e||5);return Math.round(t*i)/i},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},splitWords:function(t){return W.Util.trim(t).split(/\s+/)},setOptions:function(t,e){t.hasOwnProperty("options")||(t.options=t.options?W.Util.create(t.options):{});for(var i in e)t.options[i]=e[i];return t.options},getParamString:function(t,e,i){var s=[];for(var n in t)s.push(encodeURIComponent(i?n.toUpperCase():n)+"="+encodeURIComponent(t[n]));return(e&&-1!==e.indexOf("?")?"&":"?")+s.join("&")},isArray:Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},write:function(){if(W.debug&&arguments.length){var t=arguments[0],e=window.console;if(e[t]||(e[t]=function(){}),1===arguments.length)return e.log(arguments[0]);if("stringify"===t){var i=arguments[1];if(i===Object(i)&&JSON)try{i=JSON.stringify(i)}catch(s){}return e.log(i)}return e[t].apply(e,Array.prototype.slice.call(arguments,1))}}},W.extend=W.Util.extend,W.stamp=W.Util.stamp,W.setOptions=W.Util.setOptions,W.logger=W.Util.write,W.Class=function(){},W.Class.extend=function(t){var e=function(){this.initialize&&this.initialize.apply(this,arguments),this.callInitHooks()},i=e.__super__=this.prototype,s=W.Util.create(i);s.constructor=e,e.prototype=s;for(var n in this)this.hasOwnProperty(n)&&"prototype"!==n&&(e[n]=this[n]);return t.statics&&(W.extend(e,t.statics),delete t.statics),t.includes&&(W.Util.extend.apply(null,[s].concat(t.includes)),delete t.includes),s.options&&(t.options=W.Util.extend(W.Util.create(s.options),t.options)),W.extend(s,t),s._initHooks=[],s.callInitHooks=function(){if(!this._initHooksCalled){i.callInitHooks&&i.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,e=s._initHooks.length;e>t;t++)s._initHooks[t].call(this)}},e},W.Class.include=function(t){W.extend(this.prototype,t)},W.Class.mergeOptions=function(t){W.extend(this.prototype.options,t)},W.Class.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),i="function"==typeof t?t:function(){this[t].apply(this,e)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(i)},W.Evented=W.Class.extend({on:function(t,e,i){if("object"==typeof t)for(var s in t)this._on(s,t[s],e);else{t=W.Util.splitWords(t);for(var n=0,r=t.length;r>n;n++)this._on(t[n],e,i)}return this},off:function(t,e,i){if(t)if("object"==typeof t)for(var s in t)this._off(s,t[s],e);else{t=W.Util.splitWords(t);for(var n=0,r=t.length;r>n;n++)this._off(t[n],e,i)}else delete this._events;return this},_on:function(t,e,i){var s=this._events=this._events||{},n=i&&i!==this&&W.stamp(i);if(n){var r=t+"_idx",o=t+"_len",a=s[r]=s[r]||{},l=W.stamp(e)+"_"+n;a[l]||(a[l]={fn:e,ctx:i},s[o]=(s[o]||0)+1)}else s[t]=s[t]||[],s[t].push({fn:e})},_off:function(t,e,i){var s=this._events,n=t+"_idx",r=t+"_len";if(s){if(!e)return delete s[t],delete s[n],void delete s[r];var o,a,l,u,c,h=i&&i!==this&&W.stamp(i);if(h)c=W.stamp(e)+"_"+h,o=s[n],o&&o[c]&&(u=o[c],delete o[c],s[r]--);else if(o=s[t])for(a=0,l=o.length;l>a;a++)if(o[a].fn===e){u=o[a],o.splice(a,1);break}u&&(u.fn=W.Util.falseFn)}},fire:function(t,e,i){if(!this.listens(t,i))return this;var s=W.Util.extend({},e,{type:t,target:this}),n=this._events;if(n){var r,o,a,l,u=n[t+"_idx"];if(n[t])for(a=n[t].slice(),r=0,o=a.length;o>r;r++)a[r].fn.call(this,s);for(l in u)u[l].fn.call(u[l].ctx,s)}return i&&this._propagateEvent(s),this},listens:function(t,e){var i=this._events;if(i&&(i[t]||i[t+"_len"]))return!0;if(e)for(var s in this._eventParents)if(this._eventParents[s].listens(t,e))return!0;return!1},once:function(t,e,i){if("object"==typeof t){for(var s in t)this.once(s,t[s],e);return this}var n=W.bind(function(){this.off(t,e,i).off(t,n,i)},this);return this.on(t,e,i).on(t,n,i)},addEventParent:function(t){return this._eventParents=this._eventParents||{},this._eventParents[W.stamp(t)]=t,this},removeEventParent:function(t){return this._eventParents&&delete this._eventParents[W.stamp(t)],this},_propagateEvent:function(t){for(var e in this._eventParents)this._eventParents[e].fire(t.type,W.extend({layer:t.target},t),!0)}});var proto=W.Evented.prototype;proto.addEventListener=proto.on,proto.removeEventListener=proto.clearAllEventListeners=proto.off,proto.addOneTimeEventListener=proto.once,proto.fireEvent=proto.fire,proto.hasEventListeners=proto.listens,W.Mixin={Events:proto},W.Request=W.Class.extend({options:{},_id:0,_url:"",_io:null,_counter:0,_requests:[],_callbacks:[],_frameReady:!1,initialize:function(t,e,i){i=W.setOptions(this,i),e=e||"/wialon/post.html",this._url=this._createFullUrl(t)+e,this._id=this._url,this._io=document.createElement("iframe"),this._io.style.display="none",this._io.setAttribute("src",this._url),this._io.onload=this._frameLoaded.bind(this),window.addEventListener("message",this._receiveMessage.bind(this),!1),document.body.appendChild(this._io)},api:function(t,e,i){this.send("/wialon/ajax.html?svc="+t,e,i,i)},send:function(t,e,i,s){var n={id:++this._counter,url:t,params:this._urlEncodeData(e),source:this._id},r=this._io.contentWindow;if(r){var o=JSON.stringify(n);this._callbacks[this._counter]=[i,s,o,0],this._frameReady?r.postMessage(o,this._url):this._requests.push(o)}else s()},_createFullUrl:function(t){if(!t){var e=document.location;t=e.protocol+"//"+e.hostname+(e.port.length?":"+e.port:"")}return t},_receiveMessage:function(evt){var data={error:-1};try{data=JSON.parse(evt.data)}catch(e){try{data=eval("("+evt.data+")")}catch(e){W.logger("warn","Invalid JSON")}}if(data.source===this._id)if(data.id){var callback=this._callbacks[data.id];if(callback){if(data&&data.text&&data.text.error&&1003===data.text.error&&callback[3]<3&&(callback[3]++,callback[4]&&callback[5]&&(clearTimeout(callback[5]),callback[5]=setTimeout(W.bind(this._timeout,this,this._counter),1e3*callback[4])),this._io.contentWindow))return void setTimeout(W.bind(function(t){this._io.contentWindow.postMessage(t,this._url)},this,callback[2]),1e3*Math.random());callback[data.error]&&callback[data.error](data.text),callback[4]&&callback[5]&&clearTimeout(callback[5]),delete this._callbacks[data.id]}}else this._frameReady=!0,this._frameLoaded()},_frameLoaded:function(){if(this._frameReady)for(;this._requests.length;)this._io.contentWindow.postMessage(this._requests.pop(),this._url);else this._io.contentWindow.postMessage('{id: 0, source:"'+this._id+'"}',this._url)},_timeout:function(t){var e=this._callbacks[t];e&&(e[1]&&e[1](),delete this._callbacks[t])},_urlEncodeData:function(t){var e=[];if("object"==typeof t){for(var i in t)e.push("object"==typeof t[i]?i+"="+encodeURIComponent(JSON.stringify(t[i])):i+"="+encodeURIComponent(t[i]));return e.join("&")}return""}}),W.request=function(t,e){return new W.Request(t,e)},W.Session=W.Evented.extend({options:{eventsTimeout:10},api:{},_request:null,_serverTime:0,_eventsInterval:0,_sid:null,_url:null,_items:{},_classes:{},_features:{},_classItems:{},_currentUser:null,initialize:function(t,e){e=W.setOptions(this,e),this._request=new W.Request(t),this._url=t},execute:function(t,e,i){var s=(""+t).split("/"),n=["login","use_auth_hash","duplicate"];return!this._sid&&-1===n.indexOf(s[1])&&i?i({error:1}):(e=e||{},this._sid&&(e.sid=this._sid),void(s[0]in this.api&&s[1]in this.api[s[0]]?this.api[s[0]][s[1]].call(this,e,i):this._request.api(t,e,i)))},getEvents:function(){null!==this._sid&&(this._request.send("/avl_evts",{sid:this._sid},this._getEventsCallback.bind(this),this._getEventsCallback.bind(this)),this.options.eventsTimeout&&(clearTimeout(this._eventsInterval),this._eventsInterval=setTimeout(this.getEvents.bind(this),1e3*this.options.eventsTimeout)))},getBaseUrl:function(){return this._url},getItems:function(t){return this._classItems&&this._classes?(t=t||"avl_unit",this._classItems[this._classes[t]]):[]},getItem:function(t){return this._items[t]||null},getSid:function(){return this._sid},getCurrentUser:function(){return this._currentUser},getFeatures:function(){return this._features},checkFeature:function(t){if(!this._features||"undefined"==typeof this._features.svcs)return 0;if("undefined"==typeof this._features.svcs[t])return 1===this._features.unlim?1:0;var e=this._features.svcs[t];return 1===e?1:0===e?-1:0},_loginCallback:function(t,e){e.error?W.logger("warn","Login error"):(W.logger("Login success"),this._sid=e.eid,this._serverTime=e.tm,this._classes=e.classes,this._features=e.features,this._currentUser=e.user,this._registerItem(this._currentUser),this.options.eventsTimeout&&(this._eventsInterval=setTimeout(this.getEvents.bind(this),1e3*this.options.eventsTimeout))),t&&t(e)},_logoutCallback:function(t,e){e.error?W.logger("warn","Logout error"):(W.logger("Logout success"),this._destroy()),t&&t(e)},_getEventsCallback:function(t){if(!t||t.error)W.logger("log","Error getting events",t);else{this._serverTime=t.tm;for(var e=null,i=null;t.events.length;)if(e=t.events.shift(),e.i>0){if(i=this._items[e.i],!i)continue;if("m"===e.t)i.lmsg=e.d,this.fire("lastMessageChanged",e),e.d.pos&&(i.pos=e.d.pos,this.fire("positionChanged",e));else if("d"===e.t)this.fire("itemDeleted",i),this._unregisterItem(e.i);else if("u"===e.t){for(var s in e.d){var n,r,o;if("prpu"===s){n=e.d.prpu,r=W.extend({},i.prp);for(o in n)""!==n[o]?r[o]=n[o]:o in r&&delete r[o];i.prp=r}else if("prms"===s){n=e.d.prms,r=W.extend({},i.prms);for(o in n)"object"==typeof n[o]?r[o]=n[o]:"object"==typeof r[o]&&(r[o].at=n[o]);i.prms=r,this.fire("messageParamsChanged",e),("object"==typeof n.posinfo||"object"==typeof n.speed)&&this.fire("positionChanged",e)}else i[s]=e.d[s]}this.fire("itemChanged",e)}else W.logger("log","unknown event",JSON.stringify(e))}else-3===e.i&&(this._features=e.d,this.fire("featuresChanged"))}},_updateDataFlagsCallback:function(t,e){for(var i=0;i<e.length;i++)e[i].d?this._registerItem(e[i].d):this._unregisterItem(e[i].i);t&&t(e)},_registerItem:function(t){this._classItems[t.cls]||(this._classItems[t.cls]=[]),this._classItems[t.cls].push(t),this._items[t.id]=t},_unregisterItem:function(t){if(!t)return this;if(t in this._items){var e=this._items[t];if(this._classItems[e.cls]){var i=this._classItems[e.cls].indexOf(e);-1!==i&&this._classItems[e.cls].splice(i,1)}e=null,delete this._items[t]}},_destroy:function(){this._sid=null,this._url=null,this._items=null,this._classes=null,this._features=null,this._classItems=null,this._currentUser=null,clearTimeout(this._eventsInterval)}}),W.session=function(t,e){return new W.Session(t,e)},W.Session.include({_gis:{render:null,search:null,geocode:null,routing:null},getBaseGisUrl:function(t){if(!this.options.internalGis&&""!==this._url){var e=this._url.split("//");if(e.length>=2){if("render"===t)return e[0]+"//render-maps.wialon.com/"+e[1];if("search"===t)return e[0]+"//search-maps.wialon.com/"+e[1];if("geocode"===t)return e[0]+"//geocode-maps.wialon.com/"+e[1];if("routing"===t)return e[0]+"//routing-maps.wialon.com/"+e[1]}}return this._url},getLocations:function(t,e){var i=this.getBaseGisUrl("geocode");t=W.extend({coords:null,flags:0,city_radius:0,dist_from_unit:0,txt_dist:"",house_detect_radius:0},t);try{t.coords=JSON.stringify(t.coords)}catch(s){return void e(2)}if(!(this._gis.geocode instanceof W.Request)){var n=""!==this.getBaseGisUrl("geocode")?"/gis_post?2":"/wialon/post.html?2";this._gis.geocode=new W.Request(i,n)}this._currentUser===Object(this._currentUser)&&"id"in this._currentUser&&(t.uid=this._currentUser.id),this._gis.geocode.send(i+"/gis_geocode",t,e,e)}}),W.Session.mergeOptions({internalGis:!1}),W.Session.prototype.api.core={update_data_flags:function(t,e){this._request.api("core/update_data_flags",{params:t,sid:this._sid},this._updateDataFlagsCallback.bind(this,e))},login:function(t,e){W.extend({user:null,password:null,operateAs:""},t),this._request.api("core/login",{params:t},this._loginCallback.bind(this,e))},logout:function(t){this._request.api("core/logout",{params:{},sid:this._sid},this._logoutCallback.bind(this,t))},use_auth_hash:function(t,e){this._request.api("core/use_auth_hash",{params:t},this._loginCallback.bind(this,e))},duplicate:function(t,e){t.sid||e&&e({error:1});var i=t.sid;delete t.sid,this._request.api("core/duplicate",{params:t,sid:i},this._loginCallback.bind(this,e))}}}(window);