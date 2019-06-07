var Controller = (function () {
    function Controller(name, application, element) {
        this._name = name;
        this._application = application;
        this._element = element;
    }
    return Controller;
}());
var Application = (function () {
    function Application(window, element, debugOn) {
        if (debugOn === void 0) { debugOn = false; }
        this._debugOn = false;
        this._window = window;
        this._element = element;
        this._debugOn = debugOn;
        this.FindControllers();
        this.ConnectionComplete();
    }
    Application.prototype.BroadcastEvent = function (evt) {
        for (var _i = 0, _a = this._controllers; _i < _a.length; _i++) {
            var ctrl = _a[_i];
            ctrl.Subscription(evt);
        }
    };
    Application.prototype.Disconnect = function () {
        for (var _i = 0, _a = this._controllers; _i < _a.length; _i++) {
            var ctrl = _a[_i];
            ctrl.Disconnect();
        }
    };
    Application.prototype.ConnectionComplete = function () {
        for (var _i = 0, _a = this._controllers; _i < _a.length; _i++) {
            var ctrl = _a[_i];
            ctrl.Connect();
        }
    };
    Application.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this._debugOn && console.warn) {
            console.warn(message, optionalParams);
        }
    };
    Application.prototype.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this._debugOn && console.log) {
            console.log(message, optionalParams);
        }
    };
    Application.prototype.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this._debugOn && console.log) {
            console.info(message, optionalParams);
        }
    };
    Application.prototype.FindControllers = function () {
        var ctrlDomNodes = this._element.querySelectorAll("[data-controller");
        this._controllers = new Array();
        for (var i = 0; i < ctrlDomNodes.length; i++) {
            var ctrlDomNode = ctrlDomNodes[i];
            var ctrlName = this.toControllerName(ctrlDomNode.getAttribute("data-controller"));
            var application = this;
            var controller = new this._window[ctrlName](ctrlName, application, ctrlDomNode);
            this._controllers.push(controller);
        }
    };
    Application.prototype.toControllerName = function (str) {
        var ctrlName = '';
        ctrlName = str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function (match) {
            match = match.replace('-', '');
            return match.toUpperCase();
        });
        ctrlName += "Controller";
        return ctrlName;
    };
    return Application;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SidePickerController = (function (_super) {
    __extends(SidePickerController, _super);
    function SidePickerController(name, application, element) {
        return _super.call(this, name, application, element) || this;
    }
    SidePickerController.prototype.Connect = function () {
        this._application.warn("Connect!");
        this.addDraggables();
        this.addDropZones();
    };
    SidePickerController.prototype.Disconnect = function () {
        this._application.warn("Disconnect!");
    };
    SidePickerController.prototype.Subscription = function (evt) {
        this._application.log("received", evt);
    };
    SidePickerController.prototype.addDraggables = function () {
        var _this = this;
        var i = 0;
        var draggables = this._element.querySelectorAll("[data-player-id]");
        var _loop_1 = function () {
            var ele = draggables[i];
            ele.setAttribute("draggable", "true");
            ele.classList.add("draggable");
            ele.addEventListener("dragstart", function (e) { return _this.onDragStart(ele, e); });
            ele.addEventListener("dragend", function (e) { return _this.onDragEnd(ele); });
            ele.addEventListener("click", function (e) { return _this._application.log("click", e); });
        };
        for (i = 0; i < draggables.length; i++) {
            _loop_1();
        }
    };
    SidePickerController.prototype.onDragStart = function (itemElement, event) {
        var playerId = itemElement.getAttribute("data-player-id");
        itemElement.classList.add("dragging-effect");
        event.dataTransfer.setData("text", playerId);
        event.dataTransfer.effectAllowed = "move";
    };
    SidePickerController.prototype.onDragEnd = function (itemElement) {
        itemElement.classList.remove("dragging-effect");
    };
    SidePickerController.prototype.addDropZones = function () {
        var _this = this;
        var sectionZones = this._element.querySelectorAll("section.team");
        for (var i = 0; i < sectionZones.length; i++) {
            var sectionZone = sectionZones[i];
            sectionZone.addEventListener("drop", function (e) { return _this.onDrop(e); });
            sectionZone.addEventListener("dragenter", function (e) { return _this.cancelDefaultAction(e); });
            sectionZone.addEventListener("dragover", function (e) { return _this.onDragOver(e); });
            sectionZone.addEventListener("dragleave", function (e) { return _this.onDragLeave(e); });
            var playerZones = sectionZone.querySelectorAll("OL");
            for (var j = 0; j < playerZones.length; j++) {
                var playerZone = playerZones[j];
                playerZone.addEventListener("drop", function (e) { return _this.onDrop(e); });
            }
        }
    };
    SidePickerController.prototype.onDragOver = function (e) {
        this.cancelDefaultAction(e);
        e.currentTarget.classList.add("section-hover");
    };
    SidePickerController.prototype.onDragLeave = function (e) {
        this.cancelDefaultAction(e);
        e.currentTarget.classList.remove("section-hover");
    };
    SidePickerController.prototype.cancelDefaultAction = function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    SidePickerController.prototype.onDrop = function (event) {
        var dropTarget = null;
        var draggedItem = null;
        var data = null;
        var target = event.target || event.srcElement;
        this.cancelDefaultAction(event);
        target.classList.remove("section-hover");
        data = event.dataTransfer.getData("text");
        draggedItem = this._element.querySelector("[data-player-id='" + data + "'");
        switch (target.tagName) {
            case "SECTION":
                dropTarget = target.querySelector("OL");
                this.appendTo(dropTarget, draggedItem);
                break;
            case "HEADER":
                dropTarget = target.parentElement.querySelector("OL");
                this.appendTo(dropTarget, draggedItem);
                break;
            case "OL":
                this.appendTo(target, draggedItem);
                break;
            case "LI":
                dropTarget = target;
                this.insertAfter(dropTarget, draggedItem);
                break;
            default:
        }
    };
    SidePickerController.prototype.sequenceTeamPlayers = function (teamNode) {
        var playerNotes = teamNode.querySelectorAll("LI");
        for (var i = 0; i < playerNotes.length; i++) {
            var current = playerNotes[i];
            current.setAttribute("data-player-sequence", (i + 1).toString());
        }
    };
    SidePickerController.prototype.appendTo = function (target, draggedItem) {
        var teamNode = null;
        try {
            target.appendChild(draggedItem);
            teamNode = this.removeEffects(target, draggedItem);
            this.sequenceTeamPlayers(teamNode);
        }
        catch (_a) {
            ;
        }
    };
    SidePickerController.prototype.insertAfter = function (target, draggedItem) {
        var teamNode = null;
        try {
            target.parentNode.insertBefore(draggedItem, target.nextSibling);
            teamNode = this.removeEffects(target, draggedItem);
            this.sequenceTeamPlayers(teamNode);
        }
        catch (_a) {
            ;
        }
    };
    SidePickerController.prototype.removeEffects = function (target, draggedItem) {
        var current = target;
        var team = null;
        draggedItem.classList.remove("dragging-effect");
        while (current != null && current != this._element) {
            if (current != null && current.getAttribute("data-team-id")) {
                team = current;
            }
            if (current.classList.contains("section-hover")) {
                current.classList.remove("section-hover");
                current = null;
            }
            else {
                current = current.parentElement;
            }
        }
        return team;
    };
    return SidePickerController;
}(Controller));
document.addEventListener("DOMContentLoaded", function () {
    var debugOn = true;
    console.warn("Document Ready!");
    var a = new Application(window, document.documentElement, debugOn);
});
//# sourceMappingURL=app.js.map