export function main() { console.log("main"); let e = window.document.getElementById("main"); null != e && (window.interpreter = new Interpreter(e), window.ipc.postMessage(p("initialize"))) } export function work_last_created(e) { window.interpreter.Work(e) } class e { constructor(e, t) { this.global = new Map, this.root = e, this.handler = t } create(e, t, s) { s ? void 0 === this.global[e] ? (this.global[e] = 1, this.root.addEventListener(e, this.handler)) : this.global[e]++ : t.addEventListener(e, this.handler) } remove(e, t, s) { s ? (this.global[t]--, 0 === this.global[t] && (this.root.removeEventListener(t, this.handler), delete this.global[t])) : e.removeEventListener(t, this.handler) } } let t, s, i, a, r, o, n, c, d, h, l, u; export class JsInterpreter { constructor(t, s, i, a, r, o) { this.root = t, this.lastNode = t, this.listeners = new e(t, o), this.handlers = {}, this.handler = () => { }, this.nodes = [t], this.parents = [], this.view = new DataView(s.buffer), this.idSize = 1, this.ptr_ptr = i, this.str_ptr_ptr = a, this.str_len_ptr = r, this.strings = "", this.strPos = 0, this.decoder = new TextDecoder, this.handler = o, window.interpreter = this } Work(e) { for (this.view = new DataView(e.buffer), this.u8BufPos = this.view.getUint32(this.ptr_ptr, !0), this.strings = this.decoder.decode(new DataView(e.buffer, this.view.getUint32(this.str_ptr_ptr, !0), this.view.getUint32(this.str_len_ptr, !0))), this.strPos = 0; ;)switch (this.view.getUint8(this.u8BufPos++)) { case 0: for (t = this.getNode(), s = this.decodeU32(), h = 0; h < s; h++)t.appendChild(this.nodes[this.decodeId()]); break; case 1: for (t = this.getNode(), s = this.decodeU32(), i = [], h = 0; h < s; h++)i.push(this.nodes[this.decodeId()]); t.replaceWith(...i); break; case 2: for (t = this.getNode(), s = this.decodeU32(), i = [], h = 0; h < s; h++)i.push(this.nodes[this.decodeId()]); t.after(...i); break; case 3: for (t = this.getNode(), s = this.decodeU32(), i = [], h = 0; h < s; h++)i.push(this.nodes[this.decodeId()]); t.before(...i); break; case 4: this.getNode().remove(); break; case 5: this.lastNode = document.createTextNode(this.strings.substring(this.strPos, this.strPos += this.decodeU16())), 1 === this.view.getUint8(this.u8BufPos++) && (this.nodes[this.decodeId()] = this.lastNode), this.checkAppendParent(); break; case 6: l = this.strings.substring(this.strPos, this.strPos += this.decodeU16()), 1 === this.nodes[this.u8BufPos++] ? this.lastNode = document.createElementNS(l, this.strings.substring(this.strPos, this.strPos += this.decodeU16())) : this.lastNode = document.createElement(l), 1 === this.view.getUint8(this.u8BufPos++) && (this.nodes[this.decodeId()] = this.lastNode), this.checkAppendParent(), i = this.decodeU32(), i > 0 && this.parents.push([this.lastNode, i]); break; case 7: this.lastNode = document.createElement("pre"), this.lastNode.hidden = !0, 1 === this.view.getUint8(this.u8BufPos++) && (this.nodes[this.decodeId()] = this.lastNode), this.checkAppendParent(); break; case 8: a = this.decodeMaybeId(), o = this.strings.substring(this.strPos, this.strPos += this.decodeU16()), r = this.nodes[a], r.setAttribute("data-dioxus-id", a), this.listeners.create(o, r, 1 == this.view.getUint8(this.u8BufPos++)); break; case 9: r = this.getNode(), r.removeAttribute("data-dioxus-id"), this.listeners.remove(r, this.strings.substring(this.strPos, this.strPos += this.decodeU16()), 0 == this.view.getUint8(this.u8BufPos++)); break; case 10: r = this.getNode(), d = this.strings.substring(this.strPos, this.strPos += this.decodeU16()), r.textContent = d; break; case 11: if (r = this.getNode(), c = this.strings.substring(this.strPos, this.strPos += this.decodeU16()), n = null, 1 == this.view.getUint8(this.u8BufPos++)) n = this.strings.substring(this.strPos, this.strPos += this.decodeU16()), u = this.strings.substring(this.strPos, this.strPos += this.decodeU16()), "style" === n ? r.style[c] = u : null == n && null == n || r.setAttributeNS(n, c, u); else switch (u = this.strings.substring(this.strPos, this.strPos += this.decodeU16()), c) { case "value": u !== r.value && (r.value = u); break; case "checked": r.checked = "true" === u; break; case "selected": r.selected = "true" === u; break; case "dangerous_inner_html": r.innerHTML = u; break; default: "false" === u && g.hasOwnProperty(c) ? r.removeAttribute(c) : r.setAttribute(c, u) }break; case 12: r = this.getNode(), c = this.strings.substring(this.strPos, this.strPos += this.decodeU16()), 1 == this.view.getUint8(this.u8BufPos++) ? r.removeAttributeNS(this.strings.substring(this.strPos, this.strPos += this.decodeU16()), c) : r.removeAttributeNS(n, c); break; case 13: this.lastNode = this.getNode().cloneNode(!0), 1 === this.view.getUint8(this.u8BufPos++) && (this.nodes[this.decodeId()] = current); break; case 14: for (let e = this.getNode().cloneNode(!0).firstChild; null !== e; e = e.nextSibling)1 === this.view.getUint8(this.u8BufPos++) && (this.nodes[this.decodeId()] = e); break; case 15: this.lastNode = this.lastNode.firstChild; break; case 16: this.lastNode = this.lastNode.nextSibling; break; case 17: this.lastNode = this.lastNode.parentNode; break; case 18: this.nodes[this.decodeId()] = this.lastNode; break; case 19: this.lastNode = this.nodes[this.decodeId()]; break; case 20: this.idSize = this.view.getUint8(this.u8BufPos++); break; case 21: return; default: return void this.u8BufPos-- } } checkAppendParent() { if (this.parents.length > 0) { const e = this.parents[this.parents.length - 1]; e[1]--, 0 === e[1] && this.parents.pop(), e[0].appendChild(this.lastNode) } } getNode() { return 1 === this.view.getUint8(this.u8BufPos++) ? this.nodes[this.decodeId()] : this.lastNode } decodeMaybeId() { return 0 === this.view.getUint8(this.u8BufPos++) ? null : this.decodeId() } decodeId() { switch (this.idSize) { case 1: return this.view.getUint8(this.u8BufPos++); case 2: return this.u8BufPos += 2, this.view.getUint16(this.u8BufPos - 2, !0); case 4: return this.u8BufPos += 4, this.view.getUint32(this.u8BufPos - 4, !0); case 8: return this.u8BufPos += 8, this.view.getUint64(this.u8BufPos - 8, !0); default: let e = this.view.getUint8(this.u8BufPos++); for (let t = 1; t < this.idSize; t++)e |= this.view.getUint8(this.u8BufPos++) << 8 * t; return e } } decodeU64() { return this.u8BufPos += 8, this.view.getUint64(this.u8BufPos - 8, !0) } decodeU32() { return this.u8BufPos += 4, this.view.getUint32(this.u8BufPos - 4, !0) } decodeU16() { return this.u8BufPos += 2, this.view.getUint16(this.u8BufPos - 2, !0) } handleEdits(e) { for (let t of e) this.handleEdit(t) } handleEdit(e) { switch (e.type) { case "PushRoot": this.PushRoot(e.root); break; case "AppendChildren": this.AppendChildren(e.root, e.children); break; case "ReplaceWith": this.ReplaceWith(e.root, e.nodes); break; case "InsertAfter": this.InsertAfter(e.root, e.nodes); break; case "InsertBefore": this.InsertBefore(e.root, e.nodes); break; case "Remove": this.Remove(e.root); break; case "CreateTextNode": this.CreateTextNode(e.text, e.root); break; case "CreateElement": this.CreateElement(e.tag, e.root, e.children); break; case "CreateElementNs": this.CreateElementNs(e.tag, e.root, e.ns, e.children); break; case "CreatePlaceholder": this.CreatePlaceholder(e.root); break; case "RemoveEventListener": this.RemoveEventListener(e.root, e.event_name); break; case "NewEventListener": let t = t => { let s = t.target; if (null != s) { let i = s.getAttribute("data-dioxus-id"), a = s.getAttribute("dioxus-prevent-default"); if ("click" === t.type) { if ("onclick" !== a && "A" === s.tagName) { t.preventDefault(); const e = s.getAttribute("href"); "" !== e && null != e && window.ipc.postMessage(p("browser_open", { href: e })) } "BUTTON" === s.tagName && "submit" == t.type && t.preventDefault() } for (; null == i;) { if (null === s.parentElement) return; s = s.parentElement, i = s.getAttribute("data-dioxus-id") } a = s.getAttribute("dioxus-prevent-default"); let r = serialize_event(t); if (a === `on${t.type}` && t.preventDefault(), "submit" === t.type && t.preventDefault(), "FORM" === s.tagName && ("submit" === t.type || "input" === t.type)) for (let e = 0; e < s.elements.length; e++) { let t = s.elements[e], i = t.getAttribute("name"); null != i && ("checkbox" === t.getAttribute("type") ? r.values[i] = t.checked ? "true" : "false" : "radio" === t.getAttribute("type") ? t.checked && (r.values[i] = t.value) : r.values[i] = t.value ?? t.textContent) } if (null === i) return; i = parseInt(i), window.ipc.postMessage(p("user_event", { event: e.event_name, mounted_dom_id: i, contents: r })) } }; this.NewEventListener(e.event_name, e.root, t, function (e) { switch (e) { case "copy": case "cut": case "paste": case "compositionend": case "compositionstart": case "compositionupdate": case "keydown": case "keypress": case "keyup": case "focusout": case "focusin": case "change": case "input": case "invalid": case "reset": case "submit": case "click": case "contextmenu": case "doubleclick": case "dblclick": case "drag": case "dragend": case "dragleave": case "dragover": case "dragstart": case "drop": case "mousedown": case "mousemove": case "mouseout": case "mouseover": case "mouseup": case "pointerdown": case "pointermove": case "pointerup": case "pointercancel": case "gotpointercapture": case "lostpointercapture": case "pointerover": case "pointerout": case "select": case "touchcancel": case "touchend": case "touchmove": case "touchstart": case "wheel": case "encrypted": case "animationstart": case "animationend": case "animationiteration": case "transitionend": case "toggle": return !0; case "focus": case "blur": case "dragenter": case "dragexit": case "mouseenter": case "mouseleave": case "scroll": case "pointerenter": case "pointerleave": case "abort": case "canplay": case "canplaythrough": case "durationchange": case "emptied": case "ended": case "error": case "loadeddata": case "loadedmetadata": case "loadstart": case "pause": case "play": case "playing": case "progress": case "ratechange": case "seeked": case "seeking": case "stalled": case "suspend": case "timeupdate": case "volumechange": case "waiting": return !1 } }(e.event_name)); break; case "SetText": this.SetText(e.root, e.text); break; case "SetAttribute": this.SetAttribute(e.root, e.field, e.value, e.ns); break; case "RemoveAttribute": this.RemoveAttribute(e.root, e.name, e.ns); break; case "CloneNode": this.CloneNode(e.id, e.new_id); break; case "CloneNodeChildren": this.CloneNodeChildren(e.id, e.new_ids); break; case "FirstChild": this.FirstChild(); break; case "NextSibling": this.NextSibling(); break; case "ParentNode": this.ParentNode(); break; case "StoreWithId": this.StoreWithId(BigInt(e.id)); break; case "SetLastNode": this.SetLastNode(BigInt(e.id)) } } } export function serialize_event(e) { switch (e.type) { case "copy": case "cut": case "past": case "focus": case "blur": case "select": case "scroll": case "abort": case "canplay": case "canplaythrough": case "durationchange": case "emptied": case "encrypted": case "ended": case "error": case "loadeddata": case "loadedmetadata": case "loadstart": case "pause": case "play": case "playing": case "progress": case "ratechange": case "seeked": case "seeking": case "stalled": case "suspend": case "timeupdate": case "volumechange": case "waiting": case "toggle": default: return {}; case "compositionend": case "compositionstart": case "compositionupdate": { let { data: t } = e; return { data: t } } case "keydown": case "keypress": case "keyup": { let { charCode: t, key: s, altKey: i, ctrlKey: a, metaKey: r, keyCode: o, shiftKey: n, location: c, repeat: d, which: h, code: l } = e; return { char_code: t, key: s, alt_key: i, ctrl_key: a, meta_key: r, key_code: o, shift_key: n, location: c, repeat: d, which: h, code: l } } case "change": { let t, s = e.target; return t = "checkbox" === s.type || "radio" === s.type ? s.checked ? "true" : "false" : s.value ?? s.textContent, { value: t, values: {} } } case "input": case "invalid": case "reset": case "submit": { let t = e.target, s = t.value ?? t.textContent; return "checkbox" === t.type && (s = t.checked ? "true" : "false"), { value: s, values: {} } } case "click": case "contextmenu": case "doubleclick": case "dblclick": case "drag": case "dragend": case "dragenter": case "dragexit": case "dragleave": case "dragover": case "dragstart": case "drop": case "mousedown": case "mouseenter": case "mouseleave": case "mousemove": case "mouseout": case "mouseover": case "mouseup": { const { altKey: t, button: s, buttons: i, clientX: a, clientY: r, ctrlKey: o, metaKey: n, offsetX: c, offsetY: d, pageX: h, pageY: l, screenX: u, screenY: p, shiftKey: g } = e; return { alt_key: t, button: s, buttons: i, client_x: a, client_y: r, ctrl_key: o, meta_key: n, offset_x: c, offset_y: d, page_x: h, page_y: l, screen_x: u, screen_y: p, shift_key: g } } case "pointerdown": case "pointermove": case "pointerup": case "pointercancel": case "gotpointercapture": case "lostpointercapture": case "pointerenter": case "pointerleave": case "pointerover": case "pointerout": { const { altKey: t, button: s, buttons: i, clientX: a, clientY: r, ctrlKey: o, metaKey: n, pageX: c, pageY: d, screenX: h, screenY: l, shiftKey: u, pointerId: p, width: g, height: m, pressure: b, tangentialPressure: f, tiltX: v, tiltY: k, twist: y, pointerType: w, isPrimary: _ } = e; return { alt_key: t, button: s, buttons: i, client_x: a, client_y: r, ctrl_key: o, meta_key: n, page_x: c, page_y: d, screen_x: h, screen_y: l, shift_key: u, pointer_id: p, width: g, height: m, pressure: b, tangential_pressure: f, tilt_x: v, tilt_y: k, twist: y, pointer_type: w, is_primary: _ } } case "touchcancel": case "touchend": case "touchmove": case "touchstart": { const { altKey: t, ctrlKey: s, metaKey: i, shiftKey: a } = e; return { alt_key: t, ctrl_key: s, meta_key: i, shift_key: a } } case "wheel": { const { deltaX: t, deltaY: s, deltaZ: i, deltaMode: a } = e; return { delta_x: t, delta_y: s, delta_z: i, delta_mode: a } } case "animationstart": case "animationend": case "animationiteration": { const { animationName: t, elapsedTime: s, pseudoElement: i } = e; return { animation_name: t, elapsed_time: s, pseudo_element: i } } case "transitionend": { const { propertyName: t, elapsedTime: s, pseudoElement: i } = e; return { property_name: t, elapsed_time: s, pseudo_element: i } } } } function p(e, t = {}) { return JSON.stringify({ method: e, params: t }) } const g = { allowfullscreen: !0, allowpaymentrequest: !0, async: !0, autofocus: !0, autoplay: !0, checked: !0, controls: !0, default: !0, defer: !0, disabled: !0, formnovalidate: !0, hidden: !0, ismap: !0, itemscope: !0, loop: !0, multiple: !0, muted: !0, nomodule: !0, novalidate: !0, open: !0, playsinline: !0, readonly: !0, required: !0, reversed: !0, selected: !0, truespeed: !0 };