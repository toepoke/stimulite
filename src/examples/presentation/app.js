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
var SeasonGalleryController = (function (_super) {
    __extends(SeasonGalleryController, _super);
    function SeasonGalleryController(name, application, element) {
        var _this = _super.call(this, name, application, element) || this;
        _this._current = 0;
        return _this;
    }
    SeasonGalleryController.prototype.Connect = function () {
        this._application.warn("Connect!");
    };
    SeasonGalleryController.prototype.Disconnect = function () {
    };
    SeasonGalleryController.prototype.Subscription = function (evt) {
    };
    SeasonGalleryController.prototype.addAnimatron = function () {
        var _this = this;
        var slides = this._element.querySelectorAll("[data-slide-id]");
        for (var i = 0; i < slides.length; i++) {
            var slide = slides[i];
            slide.addEventListener("animationend", function (e) { return _this.slideEnd(e); });
        }
    };
    SeasonGalleryController.prototype.slideEnd = function (e) {
        var currSlide = e.srcElement;
        var nextSlide = currSlide.nextElementSibling;
        currSlide.classList.remove("zoom-in");
        currSlide.classList.add("hide");
        nextSlide.classList.remove("hide");
        nextSlide.classList.add("zoom-in");
    };
    return SeasonGalleryController;
}(Controller));
document.addEventListener("DOMContentLoaded", function () {
    var debugOn = true;
    console.warn("Document Ready!");
    var a = new Application(window, document.documentElement, debugOn);
});
//# sourceMappingURL=app.js.map