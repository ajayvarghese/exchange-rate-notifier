const greeterTemplate = require("./Greeter.html");

module.exports = {
  viewModel: function (params) {
    this.message = params.message;
  },
  template: greeterTemplate,
};
