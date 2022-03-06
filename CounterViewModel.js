class CounterViewModel {
    constructor() {

        var self = this;

        var listOfNames = ["Thomas", "Lars", "Karl", "Anders", "Bosse", "Bengt", "Fredrik", "Micke", "Stefan", "Patrik"];

        var randomPerson = listOfNames[Math.floor(Math.random() * 10)];

        self.clickPower = 1;
        self.autoIncrement = 0;
        self.userName = ko.observable(randomPerson);
        self.counter = ko.observable(0);

        self.increment = function() {
            self.counter(self.counter() + self.clickPower);
        }

        self.decrement = function() {
            self.counter(self.counter() - self.clickPower);
        }
        
        function incrementClicks() {
            self.counter(self.counter() + self.autoIncrement);
        }

        setInterval(incrementClicks, 1000);
        
        self.autoClicker = function(increment) {
            switch (true) {
                case (self.counter() >= 10 && self.counter() < 100): self.counter(self.counter()-10), self.autoIncrement += increment
                break;
                
                case (self.counter() >= 100 && self.counter() < 1000): self.counter(self.counter()-100), self.autoIncrement += increment
                break;
                
                case (self.counter() >= 1000): self.counter(self.counter()-1000), self.autoIncrement += increment
                break;
                
                default: return
             }
        }
    }
}

const knockoutApp = document.querySelector("#knockout-app");
ko.applyBindings(new CounterViewModel(), knockoutApp);