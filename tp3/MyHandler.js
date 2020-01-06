const HOST = "http://localhost";
const PORT = 8080;
const FULLHOST = `${HOST}:${PORT}`;

class MyHandler{
    constructor(board){
        this.numberRed = 5;
        this.numberBlue = 5;

        this.board = board;
    }

    async move(Team, RowFrom, ColFrom, RowTo, ColTo){
        let number;
        let valid;
        
        RowFrom = 5 - RowFrom;
        ColFrom = 5 - ColFrom;
        RowTo = 5 - RowTo;
        ColTo = 5 - ColTo;

        if(Team == "red")
            number = this.numberBlue;
        else number = this.numberRed;

        const response = await fetch(`${FULLHOST}/move`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "team": Team,
                "number": number, 
                "rowFrom": RowFrom, 
                "colFrom": ColFrom, 
                "rowTo": RowTo, 
                "colTo": ColTo, 
                "board": this.board
            })
        })
        
        const json = await response.json();

        valid = json['valid'];

        if(valid){
            this.board = json['newBoard'];
            console.log(json['newNumber'])

            if(Team == "red")
                this.numberBlue = json['newNumber'];
            else this.numberRed = json['newNumber'];
        }

        return valid;
    }

    async endgameMyTurn(Team){
        let number;

        if(Team == "red")
            number = this.numberRed;
        else number = this.numberBlue;

        const response = await fetch(`${FULLHOST}/endgameMyTurn`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "team": Team,
                "number": number,
                "board": this.board
            })
        })

        const json = await response.json();

        return json['won'];
    }

    async endgameHisTurn(Team){
        let number;

        if(Team == "red")
            number = this.numberRed;
        else number = this.numberBlue;

        const response = await fetch(`${FULLHOST}/endgameHisTurn`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "team": Team,
                "number": number,
                "board": this.board
            })
        })

        const json = await response.json();

        return json['won'];
    }

    async chooseMove(Team, Difficulty){
        let game_difficulty;
        switch(Difficulty){
            case "Wall-E":
                game_difficulty = "easy";
                break;
            case "C-3PO":
                game_difficulty = "medium";
                break;
            case "Terminator":
                game_difficulty = "hard";
                break;
            case "Deus Ex Machina":
                game_difficulty = "expert";
                break;
        }

        let number;
        let move;

        if(Team == "red")
            number = this.numberBlue;
        else number = this.numberRed;

        const response = await fetch(`${FULLHOST}/chooseMove`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "board": this.board,
                "team": Team,
                "difficulty": game_difficulty,
                "numberOpponentPieces": number
            })
        })
        
        const json = await response.json();

        let rowFrom = 5 - json['rowFrom'] 
        let colFrom = 5 - json['colFrom']
        let rowTo = 5 - json['rowTo']
        let colTo = 5 - json['colTo']

        move = [[rowFrom,colFrom],[rowTo,colTo]]

        this.board = json['newBoard']

        if(Team == "red")
                this.numberBlue = json['newNumber'];
            else this.numberRed = json['newNumber'];

        return move;
    }
}