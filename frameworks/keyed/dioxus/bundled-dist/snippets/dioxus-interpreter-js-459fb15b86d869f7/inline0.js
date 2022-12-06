let m,p,ls,lss,sp,d,t,c,s,sl,op,i,e,z,field,name,many,id,path,index,text,root,value,ns,n,bubbles,event_name;const evt = [];const attr = [];const tmpl = [];const ns_cache = [];
    class ListenerMap {
        constructor(root) {
            // bubbling events can listen at the root element
            this.global = {};
            // non bubbling events listen at the element the listener was created at
            this.local = {};
            this.root = null;
            this.handler = null;
        }

        create(event_name, element, bubbles) {
            if (bubbles) {
                if (this.global[event_name] === undefined) {
                    this.global[event_name] = {};
                    this.global[event_name].active = 1;
                    this.root.addEventListener(event_name, this.handler);
                } else {
                    this.global[event_name].active++;
                }
            }
            else {
                const id = element.getAttribute("data-dioxus-id");
                if (!this.local[id]) {
                    this.local[id] = {};
                }
                element.addEventListener(event_name, this.handler);
            }
        }

        remove(element, event_name, bubbles) {
            if (bubbles) {
                this.global[event_name].active--;
                if (this.global[event_name].active === 0) {
                    this.root.removeEventListener(event_name, this.global[event_name].callback);
                    delete this.global[event_name];
                }
            }
            else {
                const id = element.getAttribute("data-dioxus-id");
                delete this.local[id][event_name];
                if (this.local[id].length === 0) {
                    delete this.local[id];
                }
                element.removeEventListener(event_name, this.handler);
            }
        }

        removeAllNonBubbling(element) {
            const id = element.getAttribute("data-dioxus-id");
            delete this.local[id];
        }
    }
    function SetAttributeInner(node, field, value, ns) {
        const name = field;
        if (ns === "style") {
            // ????? why do we need to do this
            if (node.style === undefined) {
                node.style = {};
            }
            node.style[name] = value;
        } else if (ns !== null && ns !== undefined && ns !== "") {
            node.setAttributeNS(ns, name, value);
        } else {
            switch (name) {
                case "value":
                    if (value !== node.value) {
                        node.value = value;
                    }
                    break;
                case "checked":
                    node.checked = value === "true";
                    break;
                case "selected":
                    node.selected = value === "true";
                    break;
                case "dangerous_inner_html":
                    node.innerHTML = value;
                    break;
                default:
                    // https://github.com/facebook/react/blob/8b88ac2592c5f555f315f9440cbb665dd1e7457a/packages/react-dom/src/shared/DOMProperty.js#L352-L364
                    if (value === "false" && bool_attrs.hasOwnProperty(name)) {
                        node.removeAttribute(name);
                    } else {
                        node.setAttribute(name, value);
                    }
            }
        }
    }
    function LoadChild(path) {
        // iterate through each number and get that child
        let node = stack[stack.length - 1];
        let end;
        for (let i = 0; i < path.length; i++) {
            end = path[i];
            for (node = node.firstChild; end > 0; end--) {
                node = node.nextSibling;
            }
        }
        return node;
    }
    const listeners = new ListenerMap();
    let nodes = [];
    let stack = [];
    const templates = {};
    export function save_template(nodes, name) {
        templates[name] = nodes;
    }
    export function set_node(id, node) {
        nodes[id] = node;
    }
    export function initilize(root, handler) {
        listeners.handler = handler;
        nodes = [root];
        stack = [root];
        listeners.root = root;
    }
    function AppendChildren(id, many){
        let root = nodes[id];
        let to_add = stack.splice(stack.length-many);
        for (let i = 0; i < many; i++) {
            root.appendChild(to_add[i]);
        }
    }
    export function create(r){d=r;c=new TextDecoder('utf-8',{fatal:true})}export function update_memory(r){m=new DataView(r.buffer)}export function set_buffer(b){m=new DataView(b)}export function run(){t=m.getUint8(d,true);if(t&1){ls=m.getUint32(d+1,true)}p=ls;if(t&2){lss=m.getUint32(d+5,true)}if(t&4){sl=m.getUint32(d+9,true);if(t&8){sp=lss;s="";e=sp+(sl/4|0)*4;while(sp<e){t=m.getUint32(sp,true);s+=String.fromCharCode(t&255,(t&65280)>>8,(t&16711680)>>16,t>>24);sp+=4}while(sp<lss+sl){s+=String.fromCharCode(m.getUint8(sp++));}}else{s=c.decode(new DataView(m.buffer,lss,sl))}sp=0}for(;;){op=m.getUint32(p,true);p+=4;z=0;while(z++<4){switch(op&255){case 0:{AppendChildren(root, stack.length-1);}break;case 1:{stack.push(nodes[m.getUint32(p,true)]);}p+=4;break;case 2:id=m.getUint32(p,true);p += 4;{AppendChildren(id, m.getUint32(p,true));}p+=4;break;case 3:{stack.pop();}break;case 4:id=m.getUint32(p,true);p += 4;{let root = nodes[id]; let els = stack.splice(stack.length-m.getUint32(p,true)); if (root.nodeType == 1) { listeners.removeAllNonBubbling(root); } root.replaceWith(...els);}p+=4;break;case 5:id=m.getUint32(p,true);p += 4;{nodes[id].after(...stack.splice(stack.length-m.getUint32(p,true)));}p+=4;break;case 6:id=m.getUint32(p,true);p += 4;{nodes[id].before(...stack.splice(stack.length-m.getUint32(p,true)));}p+=4;break;case 7:{let node = nodes[m.getUint32(p,true)]; if (node !== undefined) { if (node.nodeType == 1) { listeners.removeAllNonBubbling(node); } node.remove(); }}p+=4;break;case 8:{stack.push(document.createTextNode(s.substring(sp,sp+=m.getUint32(p,true))));}p+=4;break;case 9:text=s.substring(sp,sp+=m.getUint32(p,true));p += 4;{const node = document.createTextNode(text); nodes[m.getUint32(p,true)] = node; stack.push(node);}p+=4;break;case 10:{let el = document.createElement('pre'); el.hidden = true; stack.push(el); nodes[m.getUint32(p,true)] = el;}p+=4;break;case 11:id=m.getUint32(p,true);p += 4;i=m.getUint32(p,true);if((i&128)!=0){event_name=s.substring(sp,sp+=(i>>>8)&255);evt[i&127]=event_name;}else{event_name=evt[i&127];}const element = nodes[id]; element.setAttribute('data-dioxus-id', `${id}`); listeners.create(event_name, element, (i>>>16)&255);p+=3;break;case 12:i=m.getUint32(p,true);p += 3;if((i&128)!=0){event_name=s.substring(sp,sp+=(i>>>8)&255);evt[i&127]=event_name;}else{event_name=evt[i&127];}bubbles=(i>>>16)&255;{const element = nodes[m.getUint32(p,true)]; element.removeAttribute('data-dioxus-id'); listeners.remove(element, event_name, bubbles);}p+=4;break;case 13:id=m.getUint32(p,true);p += 4;{nodes[id].textContent = s.substring(sp,sp+=m.getUint32(p,true));}p+=4;break;case 14:i=m.getUint32(p,true);p += 4;if((i&128)!=0){ns=s.substring(sp,sp+=(i>>>8)&255);ns_cache[i&127]=ns;}else{ns=ns_cache[i&127];}if((i&8388608)!=0){field=s.substring(sp,sp+=i>>>24);attr[(i>>>16)&127]=field;}else{field=attr[(i>>>16)&127];}id=m.getUint32(p,true);p += 4;{const node = nodes[id]; SetAttributeInner(node, field, s.substring(sp,sp+=m.getUint32(p,true)), ns);}p+=4;break;case 15:i=m.getUint32(p,true);p += 4;if((i&128)!=0){ns=s.substring(sp,sp+=(i>>>8)&255);ns_cache[i&127]=ns;}else{ns=ns_cache[i&127];}if((i&8388608)!=0){field=s.substring(sp,sp+=i>>>24);attr[(i>>>16)&127]=field;}else{field=attr[(i>>>16)&127];}{const name = field;
        const node = this.nodes[m.getUint32(p,true)];
        if (ns == "style") {
            node.style.removeProperty(name);
        } else if (ns !== null && ns !== undefined && ns !== "") {
            node.removeAttributeNS(ns, name);
        } else if (name === "value") {
            node.value = "";
        } else if (name === "checked") {
            node.checked = false;
        } else if (name === "selected") {
            node.selected = false;
        } else if (name === "dangerous_inner_html") {
            node.innerHTML = "";
        } else {
            node.removeAttribute(name);
        }}p+=4;break;case 16:path=new Uint8Array(m.buffer,m.getUint32(p,true),m.getUint32(p+=4,true));p+=4;{nodes[m.getUint32(p,true)] = LoadChild(path);}p+=4;break;case 17:path=new Uint8Array(m.buffer,m.getUint32(p,true),m.getUint32(p+=4,true));p+=4;value=s.substring(sp,sp+=m.getUint32(p,true));p += 4;{let node = LoadChild(path); node.textContent = value; nodes[m.getUint32(p,true)] = node;}p+=4;break;case 18:path=new Uint8Array(m.buffer,m.getUint32(p,true),m.getUint32(p+=4,true));p+=4;{let els = stack.splice(stack.length - m.getUint32(p,true)); let node = LoadChild(path); node.replaceWith(...els);}p+=4;break;case 19:i=m.getUint16(p,true);p += 2;if((i&128)!=0){name=s.substring(sp,sp+=i>>>8);tmpl[i&127]=name;}else{name=tmpl[i&127];}index=m.getUint32(p,true);p += 4;{let node = templates[name][index].cloneNode(true); nodes[m.getUint32(p,true)] = node; stack.push(node);}p+=4;break;case 20:return true;}op>>>=8;}}}