class WordleViewModel {
    constructor() {

        var self = this;

        self.arrayPosition = 0;

        self.words = ko.observableArray([
            {
                wordStack: ko.observableArray()
            },
            {
                wordStack: ko.observableArray([])
            },
            {
                wordStack: ko.observableArray([])
            },
            {
                wordStack: ko.observableArray([])
            },
            {
                wordStack: ko.observableArray([])
            },
            {
                wordStack: ko.observableArray([])
            }
        ]);

        self.gameDetails;

        self.buildWordle = function () {
            var currentStack = self.words()[self.arrayPosition].wordStack();
            if (currentStack.length < 5) {
                self.words()[self.arrayPosition].wordStack.push(this.button);
            }
        };

        self.shakeGameBoard = function() {
            document.getElementsByClassName('game-board')[0].classList.toggle('apply-shake');
                setTimeout(function () {
                    // toggle back after 1 second
                    document.getElementsByClassName('game-board')[0].classList.toggle('apply-shake');
                }, 1000);
        }

        self.sendWordle = function () {
            var currentStack = self.words()[self.arrayPosition].wordStack();
            if (currentStack.length === 5) {
                self.sendGuess({
                    "id": self.gameDetails.id,
                    "key": self.gameDetails.key,
                    "guess": currentStack.join("").toLowerCase()
                });
            } else {
                self.shakeGameBoard();
            }
        }

        self.checkEndGame = function (response) {
            var currentStack = self.words()[self.arrayPosition].wordStack();
            if (self.arrayPosition === 5 && currentStack.length === 5) {
                alert("Game over!");
                self.resetGame();
            } else if (response.reduce((a, b) => a + (b['state'] || 0), 0) === 10) {
                alert("You won!")
            } else {
                self.arrayPosition++;
            }
        }

        self.updateColors = function (response) {
            var tiles = document.getElementsByClassName('game-tile');

            var rangeStart = 0;
            var rangeEnd = 5;

            switch (self.arrayPosition) {
                case 0: {
                    rangeStart = 0;
                    rangeEnd = 5;
                }
                    break;
                case 1: {
                    rangeStart = 5;
                    rangeEnd = 10;
                }
                    break;
                case 2: {
                    rangeStart = 10;
                    rangeEnd = 15;
                }
                    break;
                case 3: {
                    rangeStart = 15;
                    rangeEnd = 20;
                }
                    break;
                case 4: {
                    rangeStart = 20;
                    rangeEnd = 25;
                }
                    break;
                case 5: {
                    rangeStart = 25;
                    rangeEnd = 30;
                }
            }

            self.UpdateKeyBoardColors(response);

            var counter = 0;
            for (var i = rangeStart; i < rangeEnd; i++) {
                if (response[counter].state === 1) {
                    tiles[i].classList.add('onePointer');
                } else if (response[counter].state === 2) {
                    tiles[i].classList.add('twoPointer');
                }
                counter++;
            }
            self.checkEndGame(response);
        }


        self.UpdateKeyBoardColors = function (response) {

            const keyBoardButtons = document.getElementsByClassName('keyboard-button');
            for (let i = 0; i < response.length; i++) {
                for (let j = 0; j < keyBoardButtons.length; j++) {
                    if (keyBoardButtons[j].innerText.toLowerCase() === response[i].letter) {
                        if (response[i].state === 1) {
                            keyBoardButtons[j].classList.add('onePointer');
                        } else if (response[i].state === 2) {
                            keyBoardButtons[j].classList.add('twoPointer');
                        } else {
                            keyBoardButtons[j].classList.add('disabled');
                        }
                    }
                }
            }

        }

        self.removeLetter = function () {
        var currentStack = self.words()[self.arrayPosition].wordStack();
        if (currentStack.length > 0) {
            self.words()[self.arrayPosition].wordStack.pop();
        }
    }

        self.startGame = function () {
        $.ajax({
            type: "POST",
            url: "https://word.digitalnook.net/api/v1/start_game/",
            headers: { "Access-Control-Allow-Origin:": "*" },
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(''),
            dataType: "json",
            success: function (data) {
                self.gameDetails = data;
            },
            error: function (error) {
                alert(error.status + "<--and--> " + error.statusText);
            }
        });
    }

        self.resetGame = function () {
        self.arrayPosition = 0;
        self.gameDetails = null;
        for (let index = 0; index < self.words().length; index++) {
            self.words()[index].wordStack.removeAll();
        }
        var tiles = document.getElementsByClassName('game-tile');
        for (let index = 0; index < tiles.length; index++) {
            tiles[index].classList.remove('onePointer');
            tiles[index].classList.remove('twoPointer');
        }
        var keys = document.getElementsByClassName('keyboard-button');
        console.log(keys);
        for (let index = 0; index < keys.length; index++) {
            keys[index].classList.remove('disabled');
            keys[index].classList.remove('onePointer');
            keys[index].classList.remove('twoPointer');
        }
        self.startGame();
    }

        self.sendGuess = function (request) {
        $.ajax({
            type: "POST",
            url: "https://word.digitalnook.net/api/v1/guess/",
            headers: { "Access-Control-Allow-Origin:": "*" },
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(request),
            dataType: "json",
            success: function (data) {
                self.updateColors(data);
            },
            error: function (error) {

                self.shakeGameBoard();

            }
        });
    }
        
        self.buttons = [
        { button: 'Q' },
        { button: 'W' },
        { button: 'E' },
        { button: 'R' },
        { button: 'T' },
        { button: 'Y' },
        { button: 'U' },
        { button: 'I' },
        { button: 'O' },
        { button: 'P' },
        { button: 'A' },
        { button: 'S' },
        { button: 'D' },
        { button: 'F' },
        { button: 'G' },
        { button: 'H' },
        { button: 'J' },
        { button: 'K' },
        { button: 'L' },
        { button: 'Z' },
        { button: 'X' },
        { button: 'C' },
        { button: 'V' },
        { button: 'B' },
        { button: 'N' },
        { button: 'M' }
    ]

        self.startGame();


}
}

ko.components.register("game-board", {
    template: [
        '<div data-bind="foreach: gameboardwords" class="game-board">',
        '<div class="game-row">',
        '<div class="game-tile"><span data-bind="text: wordStack()[0]"></span></div>',
        '<div class="game-tile"><span data-bind="text: wordStack()[1]"></span></div>',
        '<div class="game-tile"><span data-bind="text: wordStack()[2]"></span></div>',
        '<div class="game-tile"><span data-bind="text: wordStack()[3]"></span></div>',
        '<div class="game-tile"><span data-bind="text: wordStack()[4]"></span></div>',
        '</div>',
        '</div>'
    ].join(""),
    viewModel: function (params) {
        var self = this;

        self.gameboardwords = params.gameboardwords();

    }
})

const knockoutApp = document.querySelector("#knockout-app");
ko.applyBindings(new WordleViewModel(), knockoutApp);