import { event_handler } from '/frameworks/keyed/sledgehammer-bindgen/bundled-dist/sledgehammer-bindgen-benchmark.js';

let getParentId = function (elem) {
    while (elem) {
        if (elem.tagName === "TR") {
            return parseInt(elem.getAttribute("data-id"));
        }
        elem = elem.parentNode;
    }
    return undefined;
};
export function register_handler() {
    document.getElementById("main").addEventListener("click", (e) => {
        event_handler(bubble(e));
    });
}
function bubble(e) {
    switch (e.target.id) {
        case "add":
            e.preventDefault();
            return 1;
        case "run":
            e.preventDefault();
            return 2;
        case "update":
            e.preventDefault();
            return 3;
        case "runlots":
            e.preventDefault();
            return 4;
        case "clear":
            e.preventDefault();
            return 5;
        case "swaprows":
            e.preventDefault();
            return 6;
        default:
            e.preventDefault();
            if (e.target.matches(".remove")) {
                return 7 | (getParentId(e.target) << 16);
            } else if (e.target.matches(".lbl")) {
                return 8 | (getParentId(e.target) << 16);
            }
            return 0;
    }
}