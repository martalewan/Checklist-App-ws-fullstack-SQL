"use strict";
exports.__esModule = true;
var react_1 = require("react");
var icon_close_svg_1 = require("../../img/icon-close.svg");
var TodoItemHeader = function (_a) {
    var todo = _a.todo, updateChecklistRowComplete = _a.updateChecklistRowComplete, updateChecklistRowText = _a.updateChecklistRowText, onOpeningRow = _a.onOpeningRow;
    return (react_1["default"].createElement("li", { className: todo.complete ? "todo-row completed" : "todo-row" },
        react_1["default"].createElement("div", { className: "todo-item__label" },
            react_1["default"].createElement("span", { className: "todo-text" }),
            react_1["default"].createElement("input", { value: todo.text, type: "text", className: "todo-item-input", placeholder: "New todo", onChange: function (e) { return updateChecklistRowText(todo.id, e); } })),
        react_1["default"].createElement("div", { className: "todo-row__icons" },
            react_1["default"].createElement("button", { className: "icon-wrapper", onClick: function (e) { return onOpeningRow(todo, e); } },
                react_1["default"].createElement("img", { className: "img-icons icon-open", src: icon_close_svg_1["default"], alt: "" })))));
};
exports["default"] = TodoItemHeader;
