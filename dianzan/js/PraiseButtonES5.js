"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PraiseButton = function () {
    function PraiseButton(box) {
        _classCallCheck(this, PraiseButton);

        this.box = box;
    }

    _createClass(PraiseButton, [{
        key: "private",
        value: function _private() {
            var number = this.box.find(".init").text();
            var boolean = this.box.find(".init").attr("data-boolean");
            if (boolean == "true") {
                number--;
                this.box.find(".init").html("" + number).attr('data-boolean', false);
            } else {
                number++;
                this.box.find(".init").html("" + number).attr('data-boolean', true);
            }
        }
    }]);

    return PraiseButton;
}();
