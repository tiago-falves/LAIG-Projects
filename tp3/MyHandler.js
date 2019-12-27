const HOST = "http://localhost";
const PORT = 8080;
const FULLHOST = `${HOST}:${PORT}`;

class MyHandler{
    constructor(){
        this.numberRed = 5;
        this.numberBlue = 5;
    }

    static async move(Team, RowFrom, ColFrom, RowTo, ColTo, Board){
        let number;
        if(Team == "red")
            number = this.numberRed;
        else number = this.numberBlue;

        const request = async () => {
            let valid = true;

            const response = await fetch(`${FULLHOST}/move`, {
                method: "POST",
                body: {
                    "team": Team,
                    "number": number, 
                    "rowFrom": RowFrom, 
                    "colFrom": ColFrom, 
                    "rowTo": RowTo, 
                    "colTo": ColTo, 
                    "board": Board
                }
            })
            
            if(valid){
                const json = await response.json();


            }
        };
        
        request();

        if(Team == "red")
            this.numberRed = NewNumber;
        else this.numberBlue = NewNumber;
    }
}