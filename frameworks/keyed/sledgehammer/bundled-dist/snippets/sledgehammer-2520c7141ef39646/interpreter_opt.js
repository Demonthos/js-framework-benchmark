export function work_last_created(){interpreter.Work()};export function last_needs_memory(){return 0===interpreter.view.buffer.byteLength};export function update_last_memory(e){interpreter.UpdateMemory(e)};let parent,len,children,node,ns,attr,op,i,name,value,element,ptr,metadata,pos,end,out,char,numAttributes,endRounded,interpreter;const opLookup=[function(){interpreter.lastNode=interpreter.lastNode.firstChild},function(){interpreter.lastNode=interpreter.lastNode.nextSibling},function(){interpreter.lastNode=interpreter.lastNode.parentNode},function(){interpreter.nodes[interpreter.decodeId()]=interpreter.lastNode},function(){interpreter.lastNode=interpreter.nodes[interpreter.decodeId()]},function(){interpreter.idSize=interpreter.view.getUint8(interpreter.u8BufPos++),interpreter.updateDecodeIdFn()},function(){return!0},function(){interpreter.createFullElement()},function(){if(parent=64&op?interpreter.nodes[interpreter.decodeId()]:interpreter.lastNode,128&op)for(len=interpreter.decodeU32(),i=0;i<len;i++)parent.appendChild(interpreter.nodes[interpreter.decodeId()]);else{const e=interpreter.decodeId();parent.appendChild(interpreter.nodes[e])}},function(){if(parent=64&op?interpreter.nodes[interpreter.decodeId()]:interpreter.lastNode,1===(len=interpreter.decodeU32()))parent.replaceWith(interpreter.nodes[interpreter.decodeId()]);else{for(children=[],i=0;i<len;i++)children.push(interpreter.nodes[interpreter.decodeId()]);parent.replaceWith(...children)}},function(){if(parent=64&op?interpreter.nodes[interpreter.decodeId()]:interpreter.lastNode,1===(len=interpreter.decodeU32()))parent.after(interpreter.nodes[interpreter.decodeId()]);else{for(children=[],i=0;i<len;i++)children.push(interpreter.nodes[interpreter.decodeId()]);parent.after(...children)}},function(){if(parent=64&op?interpreter.nodes[interpreter.decodeId()]:interpreter.lastNode,1===(len=interpreter.decodeU32()))parent.before(interpreter.nodes[interpreter.decodeId()]);else{for(children=[],i=0;i<len;i++)children.push(interpreter.nodes[interpreter.decodeId()]);parent.before(...children)}},function(){64&op?interpreter.nodes[interpreter.decodeId()].remove():interpreter.lastNode.remove()},function(){interpreter.lastNode=document.createTextNode(interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16())),64&op&&(interpreter.nodes[interpreter.decodeId()]=interpreter.lastNode)},function(){name=interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16()),interpreter.lastNode=64&op?document.createElementNS(name,interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16())):document.createElement(name),128&op&&(interpreter.nodes[interpreter.decodeId()]=interpreter.lastNode)},function(){64&op?interpreter.nodes[interpreter.decodeId()].textContent=interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16()):interpreter.lastNode.textContent=interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16())},function(){node=64&op?interpreter.nodes[interpreter.decodeId()]:interpreter.lastNode,128&op?node.setAttribute(interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16()),interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16())):node.setAttribute(attrs[interpreter.view.getUint8(interpreter.u8BufPos++)],interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16()))},function(){node=64&op?interpreter.nodes[interpreter.decodeId()]:interpreter.lastNode,attr=interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16()),ns=interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16()),value=interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16()),"style"===ns?node.style[attr]=value:null==ns&&null==ns||node.setAttributeNS(ns,attr,value)},function(){node=64&op?interpreter.nodes[interpreter.decodeId()]:interpreter.lastNode,128&op?node.removeAttribute(interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16())):node.removeAttribute(attrs[interpreter.view.getUint8(interpreter.u8BufPos++)])},function(){node=64&op?interpreter.nodes[interpreter.decodeId()]:interpreter.lastNode,attr=interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16()),node.removeAttributeNS(interpreter.strings.substring(interpreter.strPos,interpreter.strPos+=interpreter.decodeU16()),attr)},function(){interpreter.lastNode=64&op?interpreter.nodes[interpreter.decodeId()].cloneNode(!0):interpreter.lastNode.cloneNode(!0),128&op&&(interpreter.nodes[interpreter.decodeId()]=interpreter.lastNode)},function(){for(node=64&op?interpreter.nodes[interpreter.decodeId()].cloneNode(!0).firstChild:interpreter.lastNode.cloneNode(!0).firstChild;null!==node;node=node.nextSibling)1===interpreter.view.getUint8(interpreter.u8BufPos++)&&(interpreter.nodes[interpreter.decodeId()]=node)}];export class JsInterpreter{constructor(e,t,r,n,i,s){this.root=e,this.lastNode=e,this.nodes=[e],this.parents=[],this.view=new DataView(t.buffer),this.idSize=1,this.last_start_pos,this.metadata_ptr=r,this.ptr_ptr=n,this.str_ptr_ptr=i,this.str_len_ptr=s,this.strings="",this.strPos=0,this.decoder=new TextDecoder,interpreter=this,this.updateDecodeIdFn()}NeedsMemory(){return 0===this.view.buffer.byteLength}UpdateMemory(e){this.view=new DataView(e.buffer)}Work(){for(1&(metadata=this.view.getUint8(this.metadata_ptr))&&(this.last_start_pos=this.view.getUint32(this.ptr_ptr,!0)),this.u8BufPos=this.last_start_pos,2&metadata&&(len=this.view.getUint32(this.str_len_ptr,!0),ptr=this.view.getUint32(this.str_ptr_ptr,!0),this.strings=len<100?4&metadata?this.batchedAsciiDecode(ptr,len):this.utf8Decode(ptr,len):this.decoder.decode(new DataView(this.view.buffer,ptr,len)),this.strPos=0);;)if(1&(op=this.view.getUint8(this.u8BufPos++))){if(opLookup[(14&op)>>1](),opLookup[op>>4]())return}else if(opLookup[(62&op)>>1]())return}createElement(){return 255===(element=this.view.getUint8(this.u8BufPos++))?document.createElement(this.strings.substring(this.strPos,this.strPos+=this.decodeU16())):document.createElement(els[element])}createFullElement(){const e=this.decodeMaybeIdByteBool(),t=this.createElement();for(numAttributes=this.view.getUint8(this.u8BufPos++),i=0;i<numAttributes;i++)switch(attr=this.view.getUint8(this.u8BufPos++)){case 254:attr=this.strings.substring(this.strPos,this.strPos+=this.decodeU16()),ns=this.strings.substring(this.strPos,this.strPos+=this.decodeU16()),value=this.strings.substring(this.strPos,this.strPos+=this.decodeU16()),t.setAttributeNS(ns,attr,value);break;case 255:t.setAttribute(this.strings.substring(this.strPos,this.strPos+=this.decodeU16()),this.strings.substring(this.strPos,this.strPos+=this.decodeU16()));break;default:t.setAttribute(attrs[attr],this.strings.substring(this.strPos,this.strPos+=this.decodeU16()))}const r=this.view.getUint8(this.u8BufPos++);for(let e=0;e<r;e++)t.appendChild(this.createFullElement());return null!==e&&(this.nodes[e]=t),t}decodeMaybeIdByteBool(){return 0===this.view.getUint8(this.u8BufPos++)?null:this.decodeId()}updateDecodeIdFn(){switch(this.idSize){case 1:this.decodeId=function(){return this.view.getUint8(this.u8BufPos++)};break;case 2:this.decodeId=function(){return this.u8BufPos+=2,this.view.getUint16(this.u8BufPos-2,!0)};break;case 4:this.decodeId=function(){return this.u8BufPos+=4,this.view.getUint32(this.u8BufPos-4,!0)}}}decodeU32(){return this.u8BufPos+=4,this.view.getUint32(this.u8BufPos-4,!0)}decodeU16(){return this.u8BufPos+=2,this.view.getUint16(this.u8BufPos-2,!0)}SetNode(e,t){this.nodes[e]=t}GetNode(e){return this.nodes[e]}utf8Decode(e,t){for(end=(pos=e)+t,out="";pos<end;)if(0==(128&(char=this.view.getUint8(pos++))))out+=String.fromCharCode(char);else if(192==(224&char))out+=String.fromCharCode((31&char)<<6|63&this.view.getUint8(pos++));else if(224==(240&char))out+=String.fromCharCode((31&char)<<12|(63&this.view.getUint8(pos++))<<6|63&this.view.getUint8(pos++));else if(240==(248&char)){let e=(7&char)<<18|(63&this.view.getUint8(pos++))<<12|(63&this.view.getUint8(pos++))<<6|63&this.view.getUint8(pos++);e>65535&&(e-=65536,out+=String.fromCharCode(e>>>10&1023|55296),e=56320|1023&e),out+=String.fromCharCode(e)}else out+=String.fromCharCode(char);return out}batchedAsciiDecode(e,t){for(end=(pos=e)+t,out="",endRounded=pos+4*(t/4|0);pos<endRounded;)char=this.view.getUint32(pos),out+=String.fromCharCode(char>>24,(16711680&char)>>16,(65280&char)>>8,255&char),pos+=4;for(;pos<end;)out+=String.fromCharCode(this.view.getUint8(pos++));return out}};const els=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","bdi","bdo","bgsound","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","head","header","hgroup","hr","html","i","iframe","image","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","nobr","noembed","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","plaintext","portal","pre","progress","q","rb","rp","rt","rtc","ruby","s","samp","script","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr","xmp"],attrs=["accept-charset","accept","accesskey","action","align","allow","alt","aria-atomic","aria-busy","aria-controls","aria-current","aria-describedby","aria-description","aria-details","aria-disabled","aria-dropeffect","aria-errormessage","aria-flowto","aria-grabbed","aria-haspopup","aria-hidden","aria-invalid","aria-keyshortcuts","aria-label","aria-labelledby","aria-live","aria-owns","aria-relevant","aria-roledescription","async","autocapitalize","autocomplete","autofocus","autoplay","background","bgcolor","border","buffered","capture","challenge","charset","checked","cite","class","code","codebase","color","cols","colspan","content","contenteditable","contextmenu","controls","coords","crossorigin","csp","data","datetime","decoding","default","defer","dir","dirname","disabled","download","draggable","enctype","enterkeyhint","for","form","formaction","formenctype","formmethod","formnovalidate","formtarget","headers","height","hidden","high","href","hreflang","http-equiv","icon","id","importance","inputmode","integrity","intrinsicsize","ismap","itemprop","keytype","kind","label","lang","language","list","loading","loop","low","manifest","max","maxlength","media","method","min","minlength","multiple","muted","name","novalidate","open","optimum","pattern","ping","placeholder","poster","preload","radiogroup","readonly","referrerpolicy","rel","required","reversed","role","rows","rowspan","sandbox","scope","scoped","selected","shape","size","sizes","slot","span","spellcheck","src","srcdoc","srclang","srcset","start","step","style","summary","tabindex","target","title","translate","type","usemap","value","width","wrap"],events=["abort","activate","addstream","addtrack","afterprint","afterscriptexecute","animationcancel","animationend","animationiteration","animationstart","appinstalled","audioend","audioprocess","audiostart","auxclick","beforeinput","beforeprint","beforescriptexecute","beforeunload","beginEvent","blocked","blur","boundary","bufferedamountlow","cancel","canplay","canplaythrough","change","click","close","closing","complete","compositionend","compositionstart","compositionupdate","connect","connectionstatechange","contentdelete","contextmenu","copy","cuechange","cut","datachannel","dblclick","devicechange","devicemotion","deviceorientation","DOMActivate","DOMContentLoaded","DOMMouseScroll","drag","dragend","dragenter","dragleave","dragover","dragstart","drop","durationchange","emptied","end","ended","endEvent","enterpictureinpicture","error","focus","focusin","focusout","formdata","fullscreenchange","fullscreenerror","gamepadconnected","gamepaddisconnected","gatheringstatechange","gesturechange","gestureend","gesturestart","gotpointercapture","hashchange","icecandidate","icecandidateerror","iceconnectionstatechange","icegatheringstatechange","input","inputsourceschange","install","invalid","keydown","keypress","keyup","languagechange","leavepictureinpicture","load","loadeddata","loadedmetadata","loadend","loadstart","lostpointercapture","mark","merchantvalidation","message","messageerror","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","mousewheel","msContentZoom","u8BufestureChange","u8BufestureEnd","u8BufestureHold","u8BufestureStart","u8BufestureTap","MSInertiaStart","MSManipulationStateChanged","mute","negotiationneeded","nomatch","notificationclick","offline","online","open","orientationchange","pagehide","pageshow","paste","pause","payerdetailchange","paymentmethodchange","play","playing","pointercancel","pointerdown","pointerenter","pointerleave","pointerlockchange","pointerlockerror","pointermove","pointerout","pointerover","pointerup","popstate","progress","push","pushsubscriptionchange","ratechange","readystatechange","rejectionhandled","removestream","removetrack","removeTrack","repeatEvent","reset","resize","resourcetimingbufferfull","result","resume","scroll","search","seeked","seeking","select","selectedcandidatepairchange","selectend","selectionchange","selectstart","shippingaddresschange","shippingoptionchange","show","signalingstatechange","slotchange","soundend","soundstart","speechend","speechstart","squeeze","squeezeend","squeezestart","stalled","start","statechange","storage","submit","success","suspend","timeout","timeupdate","toggle","tonechange","touchcancel","touchend","touchmove","touchstart","track","transitioncancel","transitionend","transitionrun","transitionstart","unhandledrejection","unload","unmute","upgradeneeded","versionchange","visibilitychange","voiceschanged","volumechange","vrdisplayactivate","vrdisplayblur","vrdisplayconnect","vrdisplaydeactivate","vrdisplaydisconnect","vrdisplayfocus","vrdisplaypointerrestricted","vrdisplaypointerunrestricted","vrdisplaypresentchange","waiting","webglcontextcreationerror","webglcontextlost","webglcontextrestored","webkitmouseforcechanged","webkitmouseforcedown","webkitmouseforceup","webkitmouseforcewillbegin","wheel"];