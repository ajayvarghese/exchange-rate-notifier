import ko from "knockout";
import Greeter from "./Greeter/Greeter";
// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
  this.rate = "Bert";
  this.date = new Date();
}

ko.components.register("greeter", Greeter);
// Activates knockout.js
ko.applyBindings(new AppViewModel());
