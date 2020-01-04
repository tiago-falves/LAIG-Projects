const HOST = "http://localhost";
const PORT = 8080;
const FULLHOST = `${HOST}:${PORT}`;

class MyHandler{
    constructor(){
        this.numberRed = 5;
        this.numberBlue = 5;

        this.board = [
            [["blue","wn","bt"], ["blue","bn","wt"], ["blue","wn","bt"], ["blue","bn","wt"], ["blue","wn","bt"]],
            [["empty","null","wt"], ["empty","null","bt"], ["empty","null","wt"], ["empty","null","bt"], ["empty","null","wt"]],
            [["empty","null","bt"], ["empty","null","wt"], ["empty","null","bt"], ["empty","null","wt"], ["empty","null","bt"]],
            [["empty","null","wt"], ["empty","null","bt"], ["empty","null","wt"], ["empty","null","bt"], ["empty","null","wt"]],
            [["red","wn","bt"], ["red","bn","wt"], ["red","wn","bt"], ["red","bn","wt"], ["red","wn","bt"]]
        ];
    }

    async move(Team, RowFrom, ColFrom, RowTo, ColTo){
        let number;
        let valid;

        RowFrom = 5 - RowFrom;
        ColFrom = 5 - ColFrom;
        RowTo = 5 - RowTo;
        ColTo = 5 - ColTo;

        if(Team == "red")
            number = this.numberRed;
        else number = this.numberBlue;

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

            if(Team == "red")
                this.numberRed = json['newNumber'];
            else this.numberBlue = json['newNumber'];
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
                // 'Content-Type': 'application/x-www-form-urlencoded',
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
                // 'Content-Type': 'application/x-www-form-urlencoded',
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


    setdifficulty(Difficulty){
        this.difficulty = Difficulty;
    }

    async chooseMove(Team){
        let number;
        let move;

        if(Team == "red")
            number = this.numberBlue;
        else number = this.numberRed;

        const response = await fetch(`${FULLHOST}/move`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                "board": Board,
                "team": Team,
                "difficulty": this.difficulty,
                "number": number
            })
        })
        
        const json = await response.json();

        move = [json.move[0], json.move[1]];

        move(Team, move[0][0], move[0][1], move[1][0], move[1][1]);

        return move;
    }
}