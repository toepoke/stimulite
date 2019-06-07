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
//# sourceMappingURL=stimulite.js.map