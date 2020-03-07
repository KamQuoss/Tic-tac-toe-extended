// TO DO
// pokaż turę - dwa znaki, zmiana klasy w css - podświetlenie akutalnego gracza, nie tekstem!!!
// animacja zwyciestwa
// zablokowanie klika gdy czeka na sprawdzenie - jeszcze puste pola musisz zablokować

let boardContainer = document.querySelector('.board-container'),
    comunicationContainer = document.querySelector('.alert-container');

// borad size choice 
const boardRadio = document.querySelectorAll("input[name=board-size]");

for (const radio of boardRadio) {
    radio.addEventListener("change", function () {
        for (const radio of boardRadio) {
            if (radio.checked) {
                boardContainer.classList.remove('size-3', 'size-5', 'size-7');
                boardContainer.classList.add(`size-${radio.value}`)
                let newBoard = new Board(parseInt(radio.value));
                newBoard.clearBoard();
                console.log(newBoard.board);
                break;
            }
        }
    });
}

// Board prototype 

function Board(size) {
    this.size = size;
    this.board = Array.from(Array(size), () => new Array(size).fill(''));
    this.win = false;
    this.turn = 0;
    this.turnLimit = size * size;
    this.sign = {
        x: 'x',
        o: 'o'
    };
    this.staringPlayer = this.sign.x;
    this.timeout = 2000;
    const clickAction = (event) => {
        this.playGame(event.target.dataset.row, event.target.dataset.col, event.target)
    }

    // generate HTML board
    this.generateBoard = () => {
        for (row = 0; row < this.size; row++) {
            for (col = 0; col < this.size; col++) {
                let box = document.createElement('div');
                box.dataset.row = row;
                box.dataset.col = col;
                box.classList.add('box');
                box.addEventListener('click', clickAction);
                boardContainer.appendChild(box)
            }
        }
    };
    // game controller
    this.playGame = (x, y, boardBox) => {
        if (this.turn % 2 == 0) {
            this.board[x][y] = this.sign.x;
            boardBox.innerHTML = this.sign.x;
            boardBox.removeEventListener('click', clickAction)
            ++this.turn;
            this.checkWinner();
            if (this.win) {
                //this.disableClick(boardBox);
                this.writeWinner(this.sign.x);
                setTimeout(this.clearBoard, this.timeout);
            }
        } else {
            this.board[x][y] = this.sign.o;
            boardBox.innerHTML = this.sign.o;
            boardBox.removeEventListener('click', clickAction)
            ++this.turn;
            this.checkWinner();
            if (this.win) {
                //this.disableClick(boardBox);
                this.writeWinner(this.sign.o)
                setTimeout(this.clearBoard, this.timeout);
            }
        }
        if (this.turn == this.turnLimit && this.win != true) {
            this.writeWinner();
            setTimeout(this.clearBoard, this.timeout);
        }
    };
    //  checking winning combination (rows, columns and diagonals)
    this.checkRow = () => {
        if (this.win == true) return;
        for (row of this.board) {
            let rowValues = [];
            for (value of row) {
                rowValues.push(value)
            }
            let setRowValues = new Set(rowValues);
            if (setRowValues.size == 1 && !setRowValues.has('')) this.win = true;
        }
    };
    this.checkCol = () => {
        if (this.win == true) return;
        for (row = 0; row < this.size; row++) {
            let colValues = [];
            for (col = 0; col < this.size; col++) {
                colValues.push(this.board[col][row])
            }
            let setColValues = new Set(colValues);
            if (setColValues.size == 1 && !setColValues.has('')) this.win = true;
        }
    };
    this.checkDiagonalLeft = () => {
        if (this.win == true) return;
        let diagonalLeftValues = [];
        for (row = 0, col = 0; row < this.size, col < this.size; row++, col++) {
            diagonalLeftValues.push(this.board[row][col])
        }
        let setDiagonalLeftValues = new Set(diagonalLeftValues);
        if (setDiagonalLeftValues.size == 1 && !setDiagonalLeftValues.has('')) this.win = true;
    };
    this.checkDiagonalRight = () => {
        if (this.win == true) return;
        let diagonalRightValues = [];
        for (row = 0, col = this.size - 1; row < this.size, col >= 0; row++, col--) {
            diagonalRightValues.push(this.board[row][col])
        }
        let setDiagonalRightValues = new Set(diagonalRightValues);
        if (setDiagonalRightValues.size == 1 && !setDiagonalRightValues.has('')) this.win = true;
    };
    // checking if there is a winner
    this.checkWinner = () => {
        this.checkRow();
        this.checkCol();
        this.checkDiagonalLeft();
        this.checkDiagonalRight();
    };
    //comunication with a players
    this.writeWinner = (winner) => {
        if (winner === undefined) {
            comunicationContainer.innerHTML = `Remis`;
            setTimeout(() => comunicationContainer.innerHTML = '', this.timeout)
        } else {
            comunicationContainer.innerHTML = `Wygrywa ${winner}!`;
            setTimeout(() => comunicationContainer.innerHTML = '', this.timeout)
        }
    };
    // this.disableClick = (box) => {
    //     let board = box.parentNode;
    //     console.log(typeof(board));
    //     console.log(board.hasOwnProperty("addEventListener"))
    //     // for (box.childNodes in board) {
    //     //     console.log(box.childNodes);
    //     //     box => box.removeEventListener('click', clickAction)
    //     // }
    // }

    this.clearBoard = () => {
        this.board = Array.from(Array(size), () => new Array(size).fill('')),
            this.win = false,
            this.turn = 0;
        boardContainer.innerHTML = '';
        this.generateBoard()
    };

}

let defaultChoice = document.querySelector('input[value="3"]');
defaultChoice.checked = true;
let defaultArray = new Board(3);
defaultArray.clearBoard();