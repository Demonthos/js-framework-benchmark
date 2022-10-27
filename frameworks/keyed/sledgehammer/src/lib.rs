use js_sys::Math;
use sledgehammer::builder::MaybeId;
use sledgehammer::element::Element;
use sledgehammer::*;
use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::Event;

const ADJECTIVES_LEN: usize = 25;
const ADJECTIVES: [&str; ADJECTIVES_LEN] = [
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
const TBODY_ID: NodeId = NodeId(1);
const ROW_ID: NodeId = NodeId(2);
const TEMP_ID: NodeId = NodeId(3);

const COLOURS_LEN: usize = 11;
const COLOURS: [&str; COLOURS_LEN] = [
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
    "orange",
];

const NOUNS_LEN: usize = 13;
const NOUNS: [&str; NOUNS_LEN] = [
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard",
];

fn random(max: usize) -> usize {
    (Math::random() * 1000.0) as usize % max
}

struct Row {
    id: usize,
    label: String,
    ptr: u32,
}

impl Row {
    #[inline]
    const fn el(&self) -> NodeId {
        NodeId(self.ptr)
    }

    #[inline]
    const fn label_node(&self) -> NodeId {
        NodeId(self.ptr + 1)
    }
}

struct Main {
    data: Vec<Row>,
    last_id: usize,
    rows: usize,
    selected: Option<NodeId>,
    msg: MsgChannel,
}

fn get_parent_id(el: web_sys::Element) -> Option<usize> {
    let mut current = Some(el);
    while let Some(e) = current {
        if e.tag_name() == "TR" {
            return e
                .get_attribute("data-id")
                .map(|id| id.parse::<usize>().unwrap());
        }
        current = e.parent_element();
    }
    None
}

impl Main {
    fn run(&mut self) {
        self.clear();
        self.append_rows(1000)
    }

    fn add(&mut self) {
        self.append_rows(1000)
    }

    fn update(&mut self) {
        let mut i = 0;
        let l = self.data.len();
        while i < l {
            let row = &mut self.data[i];
            row.label.push_str(" !!!");
            self.msg.set_text(
                format_args!("{}", row.label),
                MaybeId::Node(row.label_node()),
            );
            i += 10;
        }
        self.msg.flush();
    }

    fn unselect(&mut self) {
        if let Some(el) = self.selected.take() {
            self.msg
                .remove_attribute(Attribute::class, MaybeId::Node(el));
        }
    }

    fn select(&mut self, id: usize) {
        self.unselect();
        for row in &self.data {
            if row.id == id {
                self.msg.set_attribute(
                    Attribute::class,
                    format_args!("danger"),
                    MaybeId::Node(row.el()),
                );
                self.selected = Some(row.el());
                self.msg.flush();
                return;
            }
        }
    }

    fn delete(&mut self, id: usize) {
        let row = match self.data.iter().position(|row| row.id == id) {
            Some(i) => self.data.remove(i),
            None => return,
        };
        self.msg.remove(MaybeId::Node(row.el()));
        self.msg.flush();
        self.rows -= 1;
    }

    fn clear(&mut self) {
        self.data = Vec::new();
        self.msg.set_text(format_args!(""), MaybeId::Node(TBODY_ID));
        self.unselect();
        self.msg.flush();
        self.rows = 0;
    }

    fn run_lots(&mut self) {
        self.clear();
        self.append_rows(10000)
    }

    fn swap_rows(&mut self) {
        if self.data.len() <= 998 {
            return;
        }
        let row1 = &self.data[1];
        let row2 = &self.data[2];
        let row998 = &self.data[998];
        let row999 = &self.data[999];

        self.msg
            .insert_before(MaybeId::Node(row2.el()), vec![row998.el()]);
        self.msg
            .insert_before(MaybeId::Node(row999.el()), vec![row1.el()]);

        self.msg.flush();
        self.data.swap(1, 998);
    }

    fn append_rows(&mut self, count: usize) {
        // web_sys::console::log_1(&format!("append_rows {}", count).into());
        self.data
            .reserve((count + self.rows).saturating_sub(self.data.capacity()));
        // const BATCH_SIZE: usize = 5000;
        // for x in 0..(count / BATCH_SIZE) {
        for x in 0..count {
            // for y in 0..BATCH_SIZE {
            // let i = self.rows + y + x * BATCH_SIZE;
            let i = self.rows + x;
            let id = self.last_id + i + 1;

            let adjective = ADJECTIVES[random(ADJECTIVES_LEN)];
            let colour = COLOURS[random(COLOURS_LEN)];
            let noun = NOUNS[random(NOUNS_LEN)];
            let capacity = adjective.len() + colour.len() + noun.len() + 2;
            let mut label = String::with_capacity(capacity);
            label.push_str(adjective);
            label.push(' ');
            label.push_str(colour);
            label.push(' ');
            label.push_str(noun);

            let el = i as u32 * 2 + 1 + TEMP_ID.0;
            let el_id = NodeId(el);
            let label_node = NodeId(el + 1);
            let id_string = id.to_string();
            let id_str = id_string.as_str();
            self.msg
                .clone_node(MaybeId::Node(ROW_ID), MaybeId::Node(el_id));
            self.msg
                .set_attribute("data-id", format_args!("{}", id_str), MaybeId::LastNode);
            self.msg
                .append_children(MaybeId::Node(TBODY_ID), vec![el_id]);
            self.msg.first_child();
            self.msg
                .set_text(format_args!("{}", id_str), MaybeId::LastNode);
            self.msg.next_sibling();
            self.msg.first_child();
            self.msg.store_with_id(label_node);
            self.msg
                .set_text(format_args!("{}", label.as_str()), MaybeId::LastNode);

            let row = Row { id, label, ptr: el };

            self.data.push(row);
        }
        self.msg.flush();
        // }
        self.last_id += count;
        self.rows += count;
    }
}

pub fn main() {
    let window = web_sys::window().expect("window");
    let document = window.document().expect("document");

    const EL: ElementBuilder<
        Element,
        (),
        (
            ElementBuilder<Element, ((Attribute, &&str),), ()>,
            ElementBuilder<
                Element,
                ((Attribute, &&str),),
                (ElementBuilder<Element, ((Attribute, &&str),), ()>,),
            >,
            ElementBuilder<
                Element,
                ((Attribute, &&str),),
                (
                    ElementBuilder<
                        Element,
                        ((Attribute, &&str),),
                        (ElementBuilder<Element, ((Attribute, &&str), (Attribute, &&str)), ()>,),
                    >,
                ),
            >,
            ElementBuilder<Element, ((Attribute, &&str),), ()>,
        ),
    > = ElementBuilder::new(
        MaybeId::Node(ROW_ID),
        Element::tr,
        (),
        (
            ElementBuilder::new(
                MaybeId::LastNode,
                Element::td,
                ((Attribute::class, &"col-md-1"),),
                (),
            ),
            ElementBuilder::new(
                MaybeId::LastNode,
                Element::td,
                ((Attribute::class, &"col-md-4"),),
                (ElementBuilder::new(
                    MaybeId::LastNode,
                    Element::a,
                    ((Attribute::class, &"lbl"),),
                    (),
                ),),
            ),
            ElementBuilder::new(
                MaybeId::LastNode,
                Element::td,
                ((Attribute::class, &"col-md-1"),),
                (ElementBuilder::new(
                    MaybeId::LastNode,
                    Element::a,
                    ((Attribute::class, &"remove"),),
                    (ElementBuilder::new(
                        MaybeId::LastNode,
                        Element::span,
                        (
                            (Attribute::class, &"remove glyphicon glyphicon-remove"),
                            (Attribute::aria_hidden, &"true"),
                        ),
                        (),
                    ),),
                ),),
            ),
            ElementBuilder::new(
                MaybeId::LastNode,
                Element::td,
                ((Attribute::class, &"col-md-6"),),
                (),
            ),
        ),
    );

    let tbody = document.get_element_by_id("tbody").expect("tbody");
    let mut msg = MsgChannel::new(tbody.clone());
    msg.build_full_element(EL);
    msg.set_node(TBODY_ID, tbody.into());

    let main = RefCell::new(Rc::new(Main {
        data: Vec::new(),
        last_id: 0,
        rows: 0,
        selected: None,
        msg,
    }));

    let onclick = Closure::wrap(Box::new(move |e: Event| {
        let target = match e.target() {
            Some(target) => target,
            None => return,
        };
        let el = JsCast::unchecked_ref::<web_sys::Element>(&target);
        let mut m = main.borrow_mut();
        let main = match Rc::get_mut(&mut m) {
            Some(main) => main,
            None => return,
        };

        match el.id().as_str() {
            "add" => {
                e.prevent_default();
                main.add();
            }
            "run" => {
                e.prevent_default();
                main.run();
            }
            "update" => {
                e.prevent_default();
                main.update();
            }
            "runlots" => {
                e.prevent_default();
                main.run_lots();
            }
            "clear" => {
                e.prevent_default();
                main.clear();
            }
            "swaprows" => {
                e.prevent_default();
                main.swap_rows();
            }
            _ => {
                let class_list = el.class_list();
                if class_list.contains("remove") {
                    e.prevent_default();
                    let parent_id = match get_parent_id(el.clone()) {
                        Some(id) => id,
                        None => return,
                    };
                    main.delete(parent_id);
                } else if class_list.contains("lbl") {
                    e.prevent_default();
                    let parent_id = match get_parent_id(el.clone()) {
                        Some(id) => id,
                        None => return,
                    };
                    main.select(parent_id);
                }
            }
        }
    }) as Box<dyn FnMut(_)>);

    let main_el = document.get_element_by_id("main").expect("main");
    main_el
        .add_event_listener_with_callback("click", onclick.as_ref().unchecked_ref())
        .unwrap();
    onclick.forget();
}
