"use strict";

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Thunmb = function () {
    function Thunmb(init) {
        _classCallCheck(this, Thunmb);

        this.init = init;
    }

    _createClass(Thunmb, [{
        key: "private",
        value: function _private() {
            var number = this.init.text();
            var boolean = this.init.attr("data-boolean");
            if (boolean == "true") {
                number--;
                this.init.html("" + number).attr('data-boolean', false);
            } else {
                number++;
                this.init.html("" + number).attr('data-boolean', true);
            }
        }
    }]);

    return Thunmb;
}();
