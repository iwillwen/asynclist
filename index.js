var eventproxy = require('eventproxy').EventProxy;
function asyncList (list) {
    this.proxy = new eventproxy();
    this.list = list;
    this.length = list.length;
    this.values = {};
    this.now = 0;
}
asyncList.prototype.trigger = function (arg, value) {
    var self = this;
    self.now++;
    self.values[arg].push(value);
    if (self.now == this.length) {
        var values = [];
        self.args.forEach(function (_arg) {
            values.push(self.values[_arg]);
        });
        self.proxy.trigger('triggers', values);
    }
    return self;
};
asyncList.prototype.assign = function () {
    var self = this;
    var args = [];
    for (var i in arguments) args.push(arguments[i]);
    var handler = args.splice(args.length - 1, 1);
    this.args = args;
    args.push(handler[0]);
    self.args.forEach(function (arg) {
        self.values[arg] = [];
    });
    self.proxy.assign.apply(self.proxy, args);
    return this;
};
asyncList.prototype.run = function () {
    var self = this;
    var list = self.list;
    list.forEach(function (task) {
        process.nextTick(function () {
            task(self.trigger);
        });
    });
};
module.exports = asyncList;