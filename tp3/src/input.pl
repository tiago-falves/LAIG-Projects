%---------------------------------%
%----    Input Predicates    -----%
%---------------------------------%

% Displays the name of the player and asks for what piece to move and where to move it
askForPlay(Row, Col, NewRow, NewCol, Player):-
    write(Player), write(', it\'s your turn.'), nl, nl, 
    write('What piece do you want to move?'), nl,
    askCoordinates(Row, Col),
    write('Where to?'), nl,!,
    askCoordinates(NewRow, NewCol).

% Asks for the coordinates of a tile (number of the row and character of the collumn). Checks for invalid input
askCoordinates(Row, Col):-
    askRow(Row),
    askCol(Col).
askCoordinates(Row, Col):-
    invalidInput,
    nl,
    askCoordinates(Row, Col).

% Asks for the row number
askRow(Row):-
    write('Row'), nl,
    askInt(Row).

% Asks for the line number
askCol(Col):-
    write('Col'), nl,
    askChar(ColLetter),
    parseLabelInput(Col, ColLetter), nl.

% Displays an error message when the input is invalid
invalidInput:-
    nl, write('Invalid input.'), nl,
    askEnter.

% Displays an error message when a play is invalid
invalidMove:-
    nl, write('That move is invalid. Insert another one, please.'), nl,
    askEnter.

% Exits when enter is pressed
askEnter:-
    write('Press enter to continue.'), nl,
    askChar(_Input).

% Asks for an int
askInt(Input):-
        askIntAux([], InputList),
        joinInts(InputList, Input).
askIntAux(PrevInput, Input):-
        get_code(user_input, KbInput),
        codeToInt(KbInput, PrevInput, Input).
codeToInt(10, _, _):- !.
codeToInt(Code, PrevInput, Input):-
        Elem is (Code - 48),
        askIntAux(PrevInput, TmpInput),
        append([Elem], TmpInput, Input).
joinInts(IntList, Int):-
	reverse(IntList, RevList),
	joinIntsAux(RevList, 1, Int), !.
joinIntsAux([], _, 0).
joinIntsAux([FirstInt | OtherInts], TenMulti, Int):-
	NewTenM is (TenMulti * 10),
	joinIntsAux(OtherInts, NewTenM, TmpInt),
	Int is (TenMulti * FirstInt + TmpInt).

% Asks for a char
askChar(Input):-
    get_char(user_input, KbInput),
    checkEndOfChar(KbInput, Input).
checkEndOfChar('\n', ''):- !.
checkEndOfChar(Code, Input):-
    askChar(TmpInput),
    atom_concat(Code, TmpInput, Input).

% Parses the label character of a collumn
parseLabelInput(1, 'A').
parseLabelInput(1, 'a').
parseLabelInput(2, 'B').
parseLabelInput(2, 'b').
parseLabelInput(3, 'C').
parseLabelInput(3, 'c').
parseLabelInput(4, 'D').
parseLabelInput(4, 'd').
parseLabelInput(5, 'E').
parseLabelInput(5, 'e').
parseLabelInput(6, 'F').
parseLabelInput(6, 'f').
parseLabelInput(7, 'G').
parseLabelInput(7, 'g').
parseLabelInput(8, 'H').
parseLabelInput(8, 'h').
parseLabelInput(9, 'I').
parseLabelInput(9, 'i').
parseLabelInput(10, 'J').
parseLabelInput(10, 'j').
parseLabelInput(11, 'K').
parseLabelInput(11, 'k').
parseLabelInput(12, 'L').
parseLabelInput(12, 'l').

% Parses the difficulty options
parseDifficulty(1, easy).
parseDifficulty(2, medium).
parseDifficulty(3, hard).
parseDifficulty(4, expert).
