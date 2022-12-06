use sledgehammer_bindgen::bindgen;
use sledgehammer_utils::Writable;
use wasm_bindgen::prelude::*;

#[bindgen]
extern "C" {
    fn initialize() {
        r#"const row = document.createElement("tr");row.innerHTML = "<td class='col-md-1'></td><td class='col-md-4'><a class='lbl'></a></td><td class='col-md-1'><a class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td>";const nodes=[document.getElementById("main"), document.getElementById("tbody"), row];let ln;"#
    }
    fn set_attribute(id: u16, name: &'static str<u8, name_cache>, val: impl Writable<u8>) {
        "nodes[$id$].setAttribute($name$, $val$);"
    }
    fn set_attribute_static(id: u16, name: &'static str<u8, name_cache>, val: &'static str<u16>) {
        "nodes[$id$].setAttribute($name$, $val$);"
    }
    fn remove_attribute(id: u16, name: &'static str<u8, name_cache>) {
        "nodes[$id$].removeAttribute($name$);"
    }
    fn append_child(id: u16, id2: u16) {
        "nodes[$id$].appendChild(nodes[$id2$]);"
    }
    fn insert_before(parent: u16, id: u16, id2: u16) {
        "nodes[$parent$].insertBefore(nodes[$id$], nodes[$id2$]);"
    }
    fn set_text(id: u16, text: impl Writable<u8>) {
        "nodes[$id$].textContent=$text$;"
    }
    fn set_last_text(text: impl Writable<u8>) {
        "ln.textContent=$text$;"
    }
    fn set_last_text_num(text: u16) {
        "ln.textContent=$text$;"
    }
    fn remove(id: u16) {
        "nodes[$id$].remove();"
    }
    fn replace(id: u16, id2: u16) {
        "nodes[$id$].replaceWith(nodes[$id2$]);"
    }
    fn clone(id: u16, id2: u16) {
        "nodes[$id2$]=nodes[$id$].cloneNode(true);"
    }
    fn traverse(id: u16) {
        "ln=nodes[$id$];"
    }
    fn first_child() {
        "ln=ln.firstChild;"
    }
    fn next_sibling() {
        "ln=ln.nextSibling;"
    }
    fn store_with_id(id: u16) {
        "nodes[$id$]=ln;"
    }
}

const ADJECTIVES_LEN: usize = 25;
const ADJECTIVES: &[&str; ADJECTIVES_LEN] = &[
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
];
const TBODY_ID: u16 = 1;
const ROW_ID: u16 = 2;
const TEMP_ID: u16 = 3;

const COLOURS_LEN: usize = 11;
const COLOURS: &[&str; COLOURS_LEN] = &[
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
    "orange",
];

const NOUNS_LEN: usize = 13;
const NOUNS: &[&str; NOUNS_LEN] = &[
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard",
];

fn random(max: usize) -> usize {
    use js_sys::Math;
    static mut STATE1: usize = 0;
    static mut STATE2: usize = 0;
    static mut INITALIZED: bool = false;
    unsafe {
        if !INITALIZED {
            STATE1 = (Math::random() * usize::MAX as f64) as usize;
            STATE2 = (Math::random() * usize::MAX as f64) as usize;
            INITALIZED = true;
        }
        STATE1 = 36969 * (STATE1 & 65535) + (STATE1 >> 16);
        STATE2 = 18000 * (STATE2 & 65535) + (STATE2 >> 16);
        ((STATE1 << 16) + (STATE2 & 65535)) % max
    }
}

struct Row {
    id: u16,
    row_data: Box<RowData>,
}
struct RowData {
    label: [&'static str; 3],
    excited: u8,
    ptr: u16,
}

impl Row {
    #[inline(always)]
    const fn el(&self) -> u16 {
        self.row_data.ptr
    }

    #[inline(always)]
    fn label_node(&self) -> u16 {
        self.row_data.ptr + 1
    }
}

pub struct Main {
    data: Vec<Row>,
    selected: Option<u16>,
    last_id: u16,
    rows: u16,
    msg: Channel,
}

impl Main {
    pub fn run(&mut self) {
        self.clear();
        self.append_rows(1000)
    }

    pub fn add(&mut self) {
        self.append_rows(1000)
    }

    pub fn update(&mut self) {
        let mut i = 0;
        let l = self.data.len();
        while i < l {
            let row = &mut self.data[i];
            row.row_data.excited += 1;
            let label = &row.row_data.label;
            self.msg.set_text(row.label_node(), |buf: &mut Vec<u8>| {
                let adj = label[0];
                let col = label[1];
                let noun = label[2];
                adj.write(buf);
                ' '.write(buf);
                col.write(buf);
                ' '.write(buf);
                noun.write(buf);
                for _ in 0..row.row_data.excited {
                    " !!!".write(buf);
                }
            });
            i += 10;
        }
        self.msg.flush();
    }

    pub fn unselect(&mut self) {
        if let Some(el) = self.selected.take() {
            self.msg.remove_attribute(el, "class");
        }
    }

    #[inline(never)]
    pub fn select(&mut self, id: u16) {
        self.unselect();
        if let Some(row) = self.data.iter().find(|r| r.id == id) {
            self.msg.set_attribute_static(row.el(), "class", "danger");
            self.selected = Some(row.el());
            self.msg.flush();
        }
    }

    pub fn delete(&mut self, id: u16) {
        let row = match self.data.iter().position(|row| row.id == id) {
            Some(i) => self.data.remove(i),
            None => return,
        };
        self.msg.remove(row.el());
        self.msg.flush();
        self.rows -= 1;
    }

    pub fn clear(&mut self) {
        self.data.clear();
        self.msg.set_text(TBODY_ID, "");
        self.unselect();
        self.msg.flush();
        self.rows = 0;
    }

    pub fn run_lots(&mut self) {
        self.clear();
        self.append_rows(10000)
    }

    pub fn swap_rows(&mut self) {
        if self.data.len() <= 998 {
            return;
        }
        let row1 = &self.data[1];
        let row2 = &self.data[2];
        let row998 = &self.data[998];
        let row999 = &self.data[999];

        self.msg.insert_before(TBODY_ID, row998.el(), row2.el());
        self.msg.insert_before(TBODY_ID, row1.el(), row999.el());

        self.msg.flush();
        self.data.swap(1, 998);
    }

    pub fn append_rows(&mut self, count: usize) {
        self.data
            .reserve((count + self.rows as usize).saturating_sub(self.data.capacity()));
        for x in 0..count {
            let i = self.rows + x as u16;
            let id = self.last_id + i + 1;

            let el = i * 2 + 1 + TEMP_ID;
            let label_node = el + 1;
            self.msg.clone(ROW_ID, el);
            self.msg.set_attribute(el, "data-id", id);
            self.msg.append_child(TBODY_ID, el);
            self.msg.traverse(el);
            self.msg.first_child();
            self.msg.set_last_text_num(id);
            self.msg.next_sibling();
            self.msg.first_child();
            self.msg.store_with_id(label_node);
            let adj = ADJECTIVES[random(ADJECTIVES_LEN)];
            let col = COLOURS[random(COLOURS_LEN)];
            let noun = NOUNS[random(NOUNS_LEN)];
            self.msg.set_last_text(|w: &mut Vec<u8>| {
                adj.write(w);
                ' '.write(w);
                col.write(w);
                ' '.write(w);
                noun.write(w);
            });
            let label = [adj, col, noun];

            self.data.push(Row {
                id,
                row_data: Box::new(RowData {
                    label,
                    excited: 0,
                    ptr: el,
                }),
            });
        }
        self.msg.flush();
        self.last_id += count as u16;
        self.rows += count as u16;
    }
}

#[inline(never)]
pub fn write_as_text(s: &str, into: &mut String) {
    let len = into.len();
    let vec_like = unsafe { into.as_mut_vec() };
    unsafe {
        vec_like.set_len(len + s.len());
        for (i, c) in s.bytes().enumerate() {
            vec_like[len + i] = c;
        }
    }
}

static mut MAIN: Option<Main> = None;

pub fn main() {
    let msg = Channel::default();
    unsafe {
        MAIN = Some(Main {
            data: Vec::new(),
            selected: None,
            last_id: 0,
            rows: 0,
            msg,
        });
    }
    register_handler();
}

#[wasm_bindgen]
pub fn event_handler(result: u32) {
    let main = unsafe { &mut MAIN.as_mut().unwrap() };

    match result {
        // add
        1 => main.add(),
        // run
        2 => main.run(),
        // update
        3 => main.update(),
        // runlots
        4 => main.run_lots(),
        // clear
        5 => main.clear(),
        // swaprows
        6 => main.swap_rows(),
        _ => {
            match result & u16::MAX as u32 {
                // remove
                7 => main.delete((result >> 16) as u16),
                // select
                8 => main.select((result >> 16) as u16),
                _ => {}
            }
        }
    }
}

#[wasm_bindgen(module = "/event.js")]
extern "C" {
    fn register_handler();
}
