#![allow(non_snake_case)]

use dioxus::prelude::*;
use js_sys::Math;
use std::cell::RefCell;
use std::rc::Rc;

fn random(max: f64) -> usize {
    ((Math::random() * 1000.0) % max) as usize
}

fn main() {
    // for performance reasons, we want to cache these strings on the edge of js/rust boundary
    // for &name in ADJECTIVES.iter().chain(NOUNS.iter()).chain(COLOURS.iter()) {
    //     wasm_bindgen::intern(name);
    // }

    dioxus_web::launch(app);
}

#[derive(Clone, Debug, PartialEq)]
struct Label {
    key: usize,
    labels: Vec<&'static str>,
}

impl Label {
    fn new_list(num: usize, key_from: usize) -> Vec<Self> {
        let mut labels = Vec::with_capacity(num);
        for x in 0..num {
            labels.push(Label {
                key: x as usize + key_from,
                labels: vec![
                    ADJECTIVES[random((ADJECTIVES.len() - 1) as f64)],
                    COLOURS[random((COLOURS.len() - 1) as f64)],
                    NOUNS[random((NOUNS.len() - 1) as f64)],
                ],
            });
        }
        labels
    }
}

#[derive(Clone, PartialEq)]
struct LabelsContainer {
    last_key: usize,
    labels: Vec<Label>,
}

impl LabelsContainer {
    fn new(num: usize, last_key: usize) -> LabelsContainer {
        let labels = Label::new_list(num, last_key + 1);
        LabelsContainer {
            labels,
            last_key: last_key + num,
        }
    }

    fn append(&mut self, num: usize) {
        self.labels
            .extend(Label::new_list(1_000, self.last_key + 1));
        self.last_key += num;
    }

    fn overwrite(&mut self, num: usize) {
        self.labels = Label::new_list(num, self.last_key + 1);
        self.last_key += num;
    }

    fn swap(&mut self, a: usize, b: usize) {
        if self.labels.len() > a + 1 && self.labels.len() > b {
            self.labels.swap(a, b);
            // panic!("{:?}", self.labels);
        }
    }

    fn remove(&mut self, index: usize) {
        self.labels.remove(index);
    }
}

fn app(cx: Scope) -> Element {
    let labels_container = use_ref(&cx, || LabelsContainer::new(0, 0));
    let labels_container_clone = labels_container.clone();
    let remove_row: Rc<RefCell<Box<dyn FnMut(usize)>>> =
        Rc::new(RefCell::new(Box::new(move |row| {
            labels_container_clone.write().remove(row);
        })));
    let selected = use_state(&cx, || None as Option<usize>);
    let selected_clone = selected.clone();
    let select_row: Rc<RefCell<Box<dyn FnMut(usize)>>> =
        Rc::new(RefCell::new(Box::new(move |row| {
            selected_clone.set(Some(row));
        })));
    let selected_ref = &select_row;
    let remove_ref = &remove_row;
    let borrow = labels_container.read();

    cx.render(rsx! {
        div { class: "container",
            div { class: "jumbotron",
                div { class: "row",
                    div { class: "col-md-6", h1 { "Dioxus" } }
                    div { class: "col-md-6",
                        div { class: "row",
                            ActionButton { name: "Create 1,000 rows", id: "run",
                                onclick: move |_| labels_container.write().overwrite(1_000),
                            }
                            ActionButton { name: "Create 10,000 rows", id: "runlots",
                                onclick: move |_| labels_container.write().overwrite(10_000),
                            }
                            ActionButton { name: "Append 1,000 rows", id: "add",
                                onclick: move |_| labels_container.write().append(1_000),
                            }
                            ActionButton { name: "Update every 10th row", id: "update",
                                onclick: move |_| {
                                    let mut write_handle = labels_container.write();
                                    for i in 0..(write_handle.labels.len()/10) {
                                        write_handle.labels[i*10].labels.push("!!!");
                                    }
                                },
                            }
                            ActionButton { name: "Clear", id: "clear",
                                onclick: move |_| labels_container.write().overwrite(0),
                            }
                            ActionButton { name: "Swap rows", id: "swaprows",
                                onclick: move |_| labels_container.write().swap(1, 998),
                            }
                        }
                    }
                }
            }

            table { class: "table table-hover table-striped test-data",
                tbody { id: "tbody",
                    borrow.labels.iter().enumerate().map(|(idx, item)| {
                        rsx! {
                            Row {
                                label: item.clone(),
                                selected: *selected == Some(item.key),
                                select: selected_ref.clone(),
                                remove: remove_ref.clone(),
                                index: idx,
                                key: "{item.key}"
                            }
                        }
                    })
                }
            }

            span { class: "preloadicon glyphicon glyphicon-remove", aria_hidden: "true" }
        }
    })
}

#[derive(Props)]
struct RowProps {
    label: Label,
    selected: bool,
    index: usize,
    remove: Rc<RefCell<Box<dyn FnMut(usize)>>>,
    select: Rc<RefCell<Box<dyn FnMut(usize)>>>,
}

impl PartialEq for RowProps {
    fn eq(&self, other: &Self) -> bool {
        self.label == other.label && self.selected == other.selected && self.index == other.index
    }
}

fn Row(cx: Scope<RowProps>) -> Element {
    let RowProps {
        label,
        selected,
        remove,
        select,
        index,
    } = &cx.props;
    let key = label.key;
    let is_in_danger = if *selected { "danger" } else { "" };
    let text = label.labels.join(" ");

    cx.render(rsx! {
        tr { class: "{is_in_danger}",
            td { class:"col-md-1", "{key}" }
            td { class:"col-md-4", onclick: move |_| (select.borrow_mut())(key),
                a { class: "lbl", "{text}" }
            }
            td { class: "col-md-1",
                a { class: "remove", onclick: move |_| (remove.borrow_mut())(*index),
                    span { class: "glyphicon glyphicon-remove remove", aria_hidden: "true" }
                }
            }
            td { class: "col-md-6" }
        }
    })
}

#[derive(Props)]
struct ActionButtonProps<'a> {
    name: &'a str,
    id: &'a str,
    onclick: EventHandler<'a>,
}

fn ActionButton<'a>(cx: Scope<'a, ActionButtonProps<'a>>) -> Element {
    cx.render(rsx! {
        div {
            class: "col-sm-6 smallpad",
            button {
                class:"btn btn-primary btn-block",
                r#type: "button",
                id: "{cx.props.id}",
                onclick: move |_| cx.props.onclick.call(()),
                "{cx.props.name}"
            }
        }
    })
}

static ADJECTIVES: &[&str] = &[
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

static COLOURS: &[&str] = &[
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
    "orange",
];

static NOUNS: &[&str] = &[
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard",
];
