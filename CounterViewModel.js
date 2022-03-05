class CounterViewModel {
    constructor() {

        var self = this;

        var listOfNames = ["Thomas", "Lars", "Karl", "Anders", "Bosse", "Bengt", "Fredrik", "Micke", "Stefan", "Patrik"];

        var randomPerson = listOfNames[Math.floor(Math.random() * 10)];

        self.userName = ko.observable(randomPerson);
        self.counter = ko.observable(0);

        self.increment = function() {
            self.counter(self.counter() + 1);
        }

        self.decrement = function() {
            self.counter(self.counter() - 1);
        }

    }
}

const knockoutApp = document.querySelector("#knockout-app");
ko.applyBindings(new CounterViewModel(), knockoutApp);