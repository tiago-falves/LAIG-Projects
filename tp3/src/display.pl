%---------------------------------%
%----     Board display      -----%
%---------------------------------%

% displays an indentation, giving space for numbering
displayIndentation:-   
    write('   ').

% displays the delimiter between rows
displayDelimiter(1):-
    displayDelimiterBottom(5).
displayDelimiter(_):-
    displayDelimiterMid(5).

% displays the top portion of the delimiter
displayDelimiterTop(N):-
    displayIndentation, put_code(9484),  put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), 
    Nless is N-1, displayDelimiterTopAux(Nless).
displayDelimiterTopAux(0):-
    put_code(9488), nl.
displayDelimiterTopAux(N):-
    put_code(9516), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472),
    Nless is N-1, displayDelimiterTopAux(Nless).

% displays the mid portion of the delimiter
displayDelimiterMid(N):-
    displayIndentation, put_code(9500), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), 
    Nless is N-1, displayDelimiterMidAux(Nless).
displayDelimiterMidAux(0):-
    put_code(9508), nl.
displayDelimiterMidAux(N):-
    put_code(9532), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), 
    Nless is N-1, displayDelimiterMidAux(Nless).    

% displays the bottom portion of the delimiter
displayDelimiterBottom(N):-
    displayIndentation, put_code(9492), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472),  
    Nless is N-1, displayDelimiterBottomAux(Nless).
displayDelimiterBottomAux(0):-
    put_code(9496), nl.      
displayDelimiterBottomAux(N):-
    put_code(9524), put_code(9472),  put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472), put_code(9472),
    Nless is N-1, displayDelimiterBottomAux(Nless).    
  
% parses the labels for the cell numbering
parseLabel(0, 'A').
parseLabel(1, 'B').
parseLabel(2, 'C').
parseLabel(3, 'D').
parseLabel(4, 'E').
parseLabel(5, 'F').
parseLabel(6, 'G').
parseLabel(7, 'H').
parseLabel(8, 'I').
parseLabel(9, 'J').
parseLabel(10, 'K').
parseLabel(11, 'L').

% displays the horizontal portion of cell numbering
displayHorizontalLabel(0,_):- nl.
displayHorizontalLabel(N, Total):-
        Pos is (Total-N),
        parseLabel(Pos, L),
        write('      '), write(L), write('     '),
        N1 is (N-1),
        displayHorizontalLabel(N1, Total).   

% displays the vertical portion of cell numbering
displayVerticalLabel(RowNumber):-
        write(' '),
        write(RowNumber),
        write(' ').

% displays a filler line for the dark rows
displayLineFillerDark:-
    displayCellLineDark('.', black, '.', black),
    displayCellLineLight(' ', white, ' ', white),
    displayCellLineDark('.', black, '.', black),
    displayCellLineLight(' ', white, ' ', white),
    displayCellLineDark('.', black, '.', black),
    put_code(9474), nl.



 % displays a filler line for the light rows
displayLineFillerLight:-
    displayCellLineLight(' ', white, ' ', white),
    displayCellLineDark('.', black, '.', black),
    displayCellLineLight(' ', white, ' ', white),
    displayCellLineDark('.', black, '.', black), 
    displayCellLineLight(' ', white, ' ', white),
    put_code(9474), nl.



% displays one of the lines of a dark cell with piece color
displayCellLineDark(Symbol, SymbolColor, Filler, FillerColor):-
    put_code(9474),
    write(' .'),
    write(' '), ansi_format([bold,fg(FillerColor)], '~w', [Filler]), write(' '),
    ansi_format([bold,fg(SymbolColor)], '~w', [Symbol]),
    write(' '), ansi_format([bold,fg(FillerColor)], '~w', [Filler]), write(' '),
    write('. ').


% displays one of the lines of a light cell with piece color
displayCellLineLight(Symbol, SymbolColor, Filler, FillerColor):-
    put_code(9474),
    write('  '),
    write(' '), ansi_format([bold,fg(FillerColor)], '~w', [Filler]) ,write(' '),
    ansi_format([bold,fg(SymbolColor)], '~w', [Symbol]),
    write(' '), ansi_format([bold,fg(FillerColor)], '~w', [Filler]), write(' '),
    write('  ').


% displays the line in a cell that contains a symbol (the center line), for the dark rows
displayCellColorDark([]).
displayCellColorDark([Element|List]) :-
    parseFillerSymbol(Element, Fs),
    parseFillerColor(Element, Fc),
    displayCellLineDark(Fs, Fc, Fs, Fc),
    displayCellColorLight(List).

% displays the line in a cell that contains a symbol (the center line), for the light rows
displayCellColorLight([]).
displayCellColorLight([Element|List]) :-
    parseFillerSymbol(Element, Fs),
    parseFillerColor(Element, Fc),
    displayCellLineLight(Fs, Fc, Fs, Fc),
    displayCellColorDark(List).


% displays the line in a cell that contains a symbol (the center line), for the dark rows
displayCellSymbolDark([]).
displayCellSymbolDark([Element|List]) :-
    parseFillerSymbol(Element, Fs),
    parseFillerColor(Element, Fc),
    parseNatureSymbol(Element, Ns),
    parseNatureColor(Element, Nc),
    displayCellLineDark(Ns, Nc, Fs, Fc),
    displayCellSymbolLight(List).
    

% displays the line in a cell that contains a symbol (the center line), for the light rows
displayCellSymbolLight([]).
displayCellSymbolLight([Element|List]) :-
    parseFillerSymbol(Element, Fs),
    parseFillerColor(Element, Fc),
    parseNatureSymbol(Element, Ns),
    parseNatureColor(Element, Nc),
    displayCellLineLight(Ns, Nc, Fs, Fc),
    displayCellSymbolDark(List).

% displays a dark row, entirely
displayRowDark(Element, N):-
    displayIndentation, displayLineFillerDark,
    displayIndentation, displayCellColorDark(Element),put_code(9474), nl,
    displayVerticalLabel(N), displayCellSymbolDark(Element), put_code(9474), nl,
    displayIndentation, displayCellColorDark(Element),put_code(9474), nl,
    displayIndentation, displayLineFillerDark,
    displayDelimiter(N).

% displays a light row, entirely
displayRowLight(Element, N):-
    displayIndentation, displayLineFillerLight,
    displayIndentation,displayCellColorLight(Element),put_code(9474), nl,
    displayVerticalLabel(N), displayCellSymbolLight(Element), put_code(9474), nl,
    displayIndentation,displayCellColorLight(Element),put_code(9474), nl,
    displayIndentation, displayLineFillerLight,
    displayDelimiter(N).
   


% Parses the nature symbol
parseNatureSymbol([_, bn, _], 'B').
parseNatureSymbol([_, wn, _], 'W').
parseNatureSymbol([empty, null, wt], ' ').
parseNatureSymbol([empty, null, bt], '.').

% Parses the nature color
parseNatureColor([_, wn, _], black).
parseNatureColor([_, bn, _], black).
parseNatureColor([empty, null, wt], white).
parseNatureColor([empty, null, bt], black).

% Parses the filler symbol
parseFillerSymbol([blue|_], 'O').
parseFillerSymbol([red|_], 'O').
parseFillerSymbol([empty, null, wt], ' ').
parseFillerSymbol([empty, null, bt], '.').

% Parses the filler color
parseFillerColor([blue|_], blue).
parseFillerColor([red|_], red).
parseFillerColor([empty, null, wt], white).
parseFillerColor([empty, null, bt], black).



% Informs the player that it's his turn
displayPlayerTurn(Player):-
    nl, write(Player), write(', it\'s your turn. Insert piece to move:'), nl.

% Asks where to move the piece 
displayPlayerTurn(Player):-
    write(Player), write('where to?:'), nl.

% Announces that the CPU from a given team is 'thinking' about his next move
displayCpuTurn(red):-
    write('Red CPU is thinking about its next move...'), nl, nl.
displayCpuTurn(blue):-
    write('Blue CPU is thinking about its next move...'), nl, nl.

% Displays a simple winning message
displayWinningMessage(Player):-
    write(Player), write(' IS THE WINNER'), nl.



% displays the full board
displayBoard([]).
displayBoard([Element|List]):-
    clearScreen,
    displayIndentation, displayHorizontalLabel(5, 5),
    displayDelimiterTop(5),
    displayRowDark(Element, 5),
    displayBoardLight(List, 4),nl.
    %displayPlayerTurn(Player).

% recursive helper predicate for the board display, displays the dark rows
displayBoardDark([], _).
displayBoardDark([Element|List], N):-
    displayRowDark(Element, N),
    Nless is N-1,
    displayBoardLight(List, Nless).

% recursive helper predicate for the board display, displays the light rows
displayBoardLight([], _).
displayBoardLight([Element|List], N):-
    displayRowLight(Element, N),
    Nless is N-1,
    displayBoardDark(List, Nless).

% clears the screen
clearScreen:- write('\33\[2J').
%clearScreen:- nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, nl, %nl, nl, nl, nl, nl, nl.



%---------------------------------%
%----      Menu screens      -----%
%---------------------------------%

mainMenu:-
    clearScreen,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||        ___           ____   __ __   ___       ___  ___   ___        ||'), nl,
    write('||       |   |  |   |  |    | |  |  | |    |    |    |   | |   |       ||'), nl,
    write('||       |      |___|  |____| |  |  | |___ |    |___ |   | |   |       ||'), nl,
    write('||       |      |   |  |    | |     | |    |    |    |   | |   |       ||'), nl,
    write('||       |___|  |   |  |    | |     | |___ |___ |___ |___| |   |       ||'), nl,
    write('||                                                                     ||'), nl,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||                                                                     ||'), nl,
    write('||                               ____                                  ||'), nl,
    write('||                             /@    ~-.                               ||'), nl,  
    write('||                             \\/ __ .- |                              ||'), nl,
    write('||                              // //                                  ||'), nl,
    write('||                                                                     ||'), nl,
    write('||                           1. Play                                   ||'), nl,
    write('||                           2. How to Play                            ||'), nl,
    write('||                           3. Exit                                   ||'), nl,
    write('||                                                                     ||'), nl,
    write('||                                                                     ||'), nl,
    write('||                                                                     ||'), nl,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    nl, write('Option '), nl.


playersMainMenu:-
    clearScreen,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||        ___           ____   __ __   ___       ___  ___   ___        ||'), nl,
    write('||       |   |  |   |  |    | |  |  | |    |    |    |   | |   |       ||'), nl,
    write('||       |      |___|  |____| |  |  | |___ |    |___ |   | |   |       ||'), nl,
    write('||       |      |   |  |    | |     | |    |    |    |   | |   |       ||'), nl,
    write('||       |___|  |   |  |    | |     | |___ |___ |___ |___| |   |       ||'), nl,
    write('||                                                                     ||'), nl,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||                                                                     ||'), nl,
    write('||                               ____                                  ||'), nl,
    write('||                             /@    ~-.                               ||'), nl,  
    write('||                             \\/ __ .- |                              ||'), nl,
    write('||                              // //                                  ||'), nl,
    write('||                                                                     ||'), nl,
    write('||                        1. Player vs Player                          ||'), nl,
    write('||                        2. Player vs Computer                        ||'), nl,
    write('||                        3. Computer vs Player                        ||'), nl,
    write('||                        4. Computer vs Computer                      ||'), nl,
    write('||                        5. Go Back                                   ||'), nl,
    write('||                                                                     ||'), nl,
    write('||                                                                     ||'), nl,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    nl, write('Option '), nl.


difficultyMenuRed:-
    clearScreen,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||        ___           ____   __ __   ___       ___  ___   ___        ||'), nl,
    write('||       |   |  |   |  |    | |  |  | |    |    |    |   | |   |       ||'), nl,
    write('||       |      |___|  |____| |  |  | |___ |    |___ |   | |   |       ||'), nl,
    write('||       |      |   |  |    | |     | |    |    |    |   | |   |       ||'), nl,
    write('||       |___|  |   |  |    | |     | |___ |___ |___ |___| |   |       ||'), nl,
    write('||                                                                     ||'), nl,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||                                                                     ||'), nl,
    write('||                         R E D    C P U                              ||'), nl,
    write('||                                                                     ||'), nl,
    write('||                           1. Wall-E                                 ||'), nl,
    write('||                           2. C-3PO                                  ||'), nl,
    write('||                           3. Terminator                             ||'), nl,
    write('||                           4. Deus Ex Machina                        ||'), nl,
    write('||                           5. Go Back                                ||'), nl,
    write('||                                                                     ||'), nl,
    write('||                                                                     ||'), nl,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    nl, write('Red difficulty '), nl.

difficultyMenuBlue:-
    clearScreen,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||        ___           ____   __ __   ___       ___  ___   ___        ||'), nl,
    write('||       |   |  |   |  |    | |  |  | |    |    |    |   | |   |       ||'), nl,
    write('||       |      |___|  |____| |  |  | |___ |    |___ |   | |   |       ||'), nl,
    write('||       |      |   |  |    | |     | |    |    |    |   | |   |       ||'), nl,
    write('||       |___|  |   |  |    | |     | |___ |___ |___ |___| |   |       ||'), nl,
    write('||                                                                     ||'), nl,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||                                                                     ||'), nl,
    write('||                         B L U E    C P U                            ||'), nl,
    write('||                                                                     ||'), nl,
    write('||                           1. Wall-E                                 ||'), nl,
    write('||                           2. C-3PO                                  ||'), nl,
    write('||                           3. Terminator                             ||'), nl,
    write('||                           4. Deus Ex Machina                        ||'), nl,
    write('||                           5. Go Back                                ||'), nl,
    write('||                                                                     ||'), nl,
    write('||                                                                     ||'), nl,
    write('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    nl, write('Blue difficulty '), nl.



howToPlay:-
    clearScreen,
    write('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||                  ___           ____   __ __   ___       ___  ___   ___                   ||'), nl,
    write('||                 |   |  |   |  |    | |  |  | |    |    |    |   | |   |                  ||'), nl,
    write('||                 |      |___|  |____| |  |  | |___ |    |___ |   | |   |                  ||'), nl,
    write('||                 |      |   |  |    | |     | |    |    |    |   | |   |                  ||'), nl,
    write('||                 |___|  |   |  |    | |     | |___ |___ |___ |___| |   |                  ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||                                                                                          ||'), nl,
    write('||            Red pieces always start first.                                                ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||            Every piece can move at any given moment like a king, in any direction        ||'), nl,
    write('||            just one tile. On the other hand, the pieces have additional moves            ||'), nl,
    write('||            deppending on their nature and on the color of the tile they are in.          ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||            If the nature of the piece has the same color as the tile, it can also        ||'), nl,
    write('||            move like a bishop, that is, any number of tiles, but only on diagonals.      ||'), nl,
    write('||            If the nature of the piece has a different color from the tile, it can        ||'), nl,
    write('||            also move like a horse, that is, in an L-shape for a total of three tiles.    ||'), nl,
    write('||            The horse movement is the only way to jump over pieces.                       ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||            There are 3 winning conditions, in order of importance:                       ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||              1st - If one of the players runs out of pieces, the other player wins       ||'), nl,
    write('||              2nd - If a player reaches the end of the board, and the other player        ||'), nl,
    write('||                    does not capture the piece on the next move                           ||'), nl,
    write('||              3rd - If one player has just one piece left and it reaches the              ||'), nl,
    write('||                    end of the board, it\'s an automatic win.                              ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||            There are 4 difficulties for the CPU:                                         ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||              Wall-E ---------------- Easy                                                ||'), nl,
    write('||              C-3PO ----------------- Medium                                              ||'), nl,
    write('||              Terminator ------------ Hard                                                ||'), nl,
    write('||              Deus Ex Machina ------- Expert                                              ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl.


thankYouGarfield:-
    clearScreen,
    write('Congratulations, you\'ve found the Easter Egg!'),
    nl, nl,
    write('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||               ___           ____   __ __   ___       ___  ___   ___                      ||'), nl,
    write('||              |   |  |   |  |    | |  |  | |    |    |    |   | |   |                     ||'), nl,
    write('||              |      |___|  |____| |  |  | |___ |    |___ |   | |   |                     ||'), nl,
    write('||              |      |   |  |    | |     | |    |    |    |   | |   |                     ||'), nl,
    write('||              |___|  |   |  |    | |     | |___ |___ |___ |___| |   |                     ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl,
    write('||                                                                                          ||'), nl,
    write('||                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⠞⠉⢉⣭⣿⣿⠿⣳⣤⠴⠖⠛⣛⣿⣿⡷⠖⣶⣤⡀⠀⠀⠀                             ||'), nl,
    write('||                            ⠀⠀⠀⠀⠀⠀⠀⣼⠁⢀⣶⢻⡟⠿⠋⣴⠿⢻⣧⡴⠟⠋⠿⠛⠠⠾⢛⣵⣿⠀⠀⠀⠀                             ||'), nl,         
    write('||                            ⣼⣿⡿⢶⣄⠀⢀⡇⢀⡿⠁⠈⠀⠀⣀⣉⣀⠘⣿⠀⠀⣀⣀⠀⠀⠀⠛⡹⠋⠀⠀⠀⠀                             ||'), nl,
    write('||                            ⣭⣤⡈⢑⣼⣻⣿⣧⡌⠁⠀⢀⣴⠟⠋⠉⠉⠛⣿⣴⠟⠋⠙⠻⣦⡰⣞⠁⢀⣤⣦⣤⠀                             ||'), nl,
    write('||                           ⠀⠀⣰⢫⣾⠋⣽⠟⠑⠛⢠⡟⠁⠀⠀⠀⠀⠀⠈⢻⡄⠀⠀⠀⠘⣷⡈⠻⣍⠤⢤⣌⣀                              ||'), nl,
    write('||                            ⢀⡞⣡⡌⠁⠀⠀⠀⠀⢀⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⢿⡀⠀⠀⠀⠸⣇⠀⢾⣷⢤⣬⣉                             ||'), nl,
    write('||                            ⡞⣼⣿⣤⣄⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⣿⠀⠸⣿⣇⠈⠻                             ||'), nl,
    write('||                            ⢰⣿⡿⢹⠃⠀⣠⠤⠶⣼⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⣿⠀⠀⣿⠛⡄⠀                             ||'), nl,
    write('||                            ⠈⠉⠁⠀⠀⠀⡟⡀⠀⠈⡗⠲⠶⠦⢤⣤⣤⣄⣀⣀⣸⣧⣤⣤⠤⠤⣿⣀⡀⠉⣼⡇⠀                             ||'), nl,
    write('||                            ⣿⣴⣴⡆⠀⠀⠻⣄⠀⠀⠡⠀⠀⠀⠈⠛⠋⠀⠀⠀⡈⠀⠻⠟⠀⢀⠋⠉⠙⢷⡿⡇⠀                             ||'), nl,
    write('||                            ⣻⡿⠏⠁⠀⠀⢠⡟⠀⠀⠀⠣⡀⠀⠀⠀⠀⠀⢀⣄⠀⠀⠀⠀⢀⠈⠀⢀⣀⡾⣴⠃⠀                             ||'), nl,
    write('||                            ⢿⠛⠀⠀⠀⠀⢸⠁⠀⠀⠀⠀⠈⠢⠄⣀⠠⠼⣁⠀⡱⠤⠤⠐⠁⠀⠀⣸⠋⢻⡟⠀⠀                             ||'), nl,
    write('||                            ⠈⢧⣀⣤⣶⡄⠘⣆⠀⠀⠀⠀⠀⠀⠀⢀⣤⠖⠛⠻⣄⠀⠀⠀⢀⣠⡾⠋⢀⡞⠀⠀⠀                             ||'), nl,
    write('||                            ⠀⠀⠻⣿⣿⡇⠀⠈⠓⢦⣤⣤⣤⡤⠞⠉⠀⠀⠀⠀⠈⠛⠒⠚⢩⡅⣠⡴⠋⠀⠀⠀⠀                             ||'), nl,
    write('||                            ⠀⠀⠀⠈⠻⢧⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⣻⠿⠋⠀⠀⠀⠀⠀⠀                             ||'), nl,
    write('||                            ⠀⠀⠀⠀⠀⠀⠉⠓⠶⣤⣄⣀⡀⠀⠀⠀⠀⠀⢀⣀⣠⡴⠖⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀                             ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||                                   T H A N K S     F O R                                  ||'), nl,
    write('||                                       P L A Y I N G                                      ||'), nl,
    write('||                                                                                          ||'), nl,
    write('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'), nl.



thankYou:-
    clearScreen,
    write("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"), nl,
    write("||        ___           ____   __ __   ___       ___  ___   ___        ||"), nl,
    write("||       |   |  |   |  |    | |  |  | |    |    |    |   | |   |       ||"), nl,
    write("||       |      |___|  |____| |  |  | |___ |    |___ |   | |   |       ||"), nl,
    write("||       |      |   |  |    | |     | |    |    |    |   | |   |       ||"), nl,
    write("||       |___|  |   |  |    | |     | |___ |___ |___ |___| |   |       ||"), nl,
    write("||                                                                     ||"), nl,
    write("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"), nl,
    write("||                                                                     ||"), nl,
    write("||                                _       _._                          ||"), nl,  
    write("||                         _,,-''' ''-,  _ }'._''.,_.=._               ||"), nl,
    write("||                      ,-''     _ _    '        (  @)'-,              ||"), nl,
    write("||                    ,''  _..==;;::_::--    __..----'' }              ||"), nl, 
    write("||                   :  .'::_;==''       ,'',: : : '' '}               ||"), nl,  
    write("||                  }  '::-'            /   },: : : :_,''              ||"), nl,  
    write("||                 :  :''     _..,,_     .,  ._-,,,--\\''    _          ||"), nl,  
    write("||                :  ;   .-'       :      '-,'';,__\\.\\_.-''            ||"), nl,      
    write("||               {   '  :    _,,,   :__,,--::',,}___}^}_.-''           ||"), nl,  
    write("||               }        _,'__''',  ;_.-''_.-''                       ||"), nl,  
    write("||              :      ,':-''  ';, ;  ;_..-''                          ||"), nl,  
    write("||          _.-' }    ,',' ,''',  : ^^                                 ||"), nl,  
    write("||          _.-''{    { ; ; ,', '  :                                   ||"), nl,  
    write("||                }   } :  ;_,'';  }                                   ||"), nl,  
    write("||                 {   ',',___,'   '                                   ||"), nl,  
    write("||                  ',           ,'                                    ||"), nl, 
    write("||                    '-,,__,,-'                                       ||"), nl,
    write("||                                                                     ||"), nl,
    write("||                           T H A N K S                               ||"), nl,
    write("||                              F O R                                  ||"), nl,
    write("||                          P L A Y I N G                              ||"), nl,
    write("||                                                                     ||"), nl,
    write("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"), nl.


displayRedWins:-
    nl, nl,
    write("____ ____ ___     _ _ _ _ _  _ ____      /"), nl,
    write("|__/ |___ |  \\    | | | | |\\ | [__      / "), nl,
    write("|  \\ |___ |__/    |_|_| | | \\| ___]    .  "), nl,
    nl, nl.

displayBlueWins:-
    nl, nl,
    write("___  _    _  _ ____    _ _ _ _ _  _ ____      /"), nl,
    write("|__] |    |  | |___    | | | | |\\ | [__      / "), nl,
    write("|__] |___ |__| |___    |_|_| | | \\| ___]    .  "), nl,
    nl, nl.
                                                     
    