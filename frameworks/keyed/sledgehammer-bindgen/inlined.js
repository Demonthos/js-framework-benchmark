let m, p, ls, lss, sp, d, t, c, s, sl, op, i, e, z, id, text, val, parent, id2, name;
const name_cache = [];
const row = document.createElement("tr");
row.innerHTML = "<td class='col-md-1'></td><td class='col-md-4'><a class='lbl'></a></td><td class='col-md-1'><a class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td>";
const nodes = [document.getElementById("main"), document.getElementById("tbody"), row];
let ln;
export function create(r) {
    d = r;
    c = new TextDecoder('utf-8', {
        fatal: true
    })
}
export function update_memory(r) {
    m = new DataView(r.buffer)
}
export function set_buffer(b) {
    m = new DataView(b)
}
export function run() {
    t = m.getUint8(d, true);
    if (t & 1) {
        ls = m.getUint32(d + 1, true)
    }
    p = ls;
    if (t & 2) {
        lss = m.getUint32(d + 5, true)
    }
    if (t & 4) {
        sl = m.getUint32(d + 9, true);
        if (t & 8) {
            sp = lss;
            s = "";
            e = sp + (sl / 4 | 0) * 4;
            while (sp < e) {
                t = m.getUint32(sp, true);
                s += String.fromCharCode(t & 255, (t & 65280) >> 8, (t & 16711680) >> 16, t >> 24);
                sp += 4
            }
            while (sp < lss + sl) {
                s += String.fromCharCode(m.getUint8(sp++));
            }
        } else {
            s = c.decode(new DataView(m.buffer, lss, sl))
        }
        sp = 0
    }
    for (; ;) {
        op = m.getUint32(p, true);
        p += 4;
        z = 0;
        while (z++ < 8) {
            switch (op & 15) {
                case 0:
                    i = m.getUint32(p, true);
                    p += 4;
                    if ((i & 128) != 0) {
                        name = s.substring(sp, sp += (i >>> 8) & 255);
                        name_cache[i & 127] = name;
                    } else {
                        name = name_cache[i & 127];
                    }
                    nodes[i >>> 16].setAttribute(name, s.substring(sp, sp += m.getUint8(p, true)));
                    p += 1;
                    break;
                case 1:
                    i = m.getUint32(p, true);
                    p += 4;
                    val = s.substring(sp, sp += i & 65535);
                    if ((i & 8388608) != 0) {
                        name = s.substring(sp, sp += i >>> 24);
                        name_cache[(i >>> 16) & 127] = name;
                    } else {
                        name = name_cache[(i >>> 16) & 127];
                    }
                    nodes[m.getUint16(p, true)].setAttribute(name, val);
                    p += 2;
                    break;
                case 2:
                    i = m.getUint32(p, true);
                    p += 4;
                    if ((i & 128) != 0) {
                        name = s.substring(sp, sp += (i >>> 8) & 255);
                        name_cache[i & 127] = name;
                    } else {
                        name = name_cache[i & 127];
                    }
                    nodes[i >>> 16].removeAttribute(name);
                    break;
                case 3:
                    i = m.getUint32(p, true);
                    p += 4;
                    nodes[i >>> 16].appendChild(nodes[i & 65535]);
                    break;
                case 4:
                    i = m.getUint32(p, true);
                    p += 4;
                    nodes[m.getUint16(p, true)].insertBefore(nodes[i >>> 16], nodes[i & 65535]);
                    p += 2;
                    break;
                case 5:
                    i = m.getUint32(p, true);
                    p += 3;
                    nodes[i & 65535].textContent = s.substring(sp, sp += (i >>> 16) & 255);
                    break;
                case 6:
                    ln.textContent = s.substring(sp, sp += m.getUint8(p, true));
                    p += 1;
                    break;
                case 7:
                    ln.textContent = m.getUint16(p, true);
                    p += 2;
                    break;
                case 8:
                    nodes[m.getUint16(p, true)].remove();
                    p += 2;
                    break;
                case 9:
                    i = m.getUint32(p, true);
                    p += 4;
                    nodes[i >>> 16].replaceWith(nodes[i & 65535]);
                    break;
                case 10:
                    i = m.getUint32(p, true);
                    p += 4;
                    nodes[i & 65535] = nodes[i >>> 16].cloneNode(true);
                    break;
                case 11:
                    ln = nodes[m.getUint16(p, true)];
                    p += 2;
                    break;
                case 12:
                    ln = ln.firstChild;
                    break;
                case 13:
                    ln = ln.nextSibling;
                    break;
                case 14:
                    nodes[m.getUint16(p, true)] = ln;
                    p += 2;
                    break;
                case 15:
                    return true;
            }
            op >>>= 4;
        }
    }
}