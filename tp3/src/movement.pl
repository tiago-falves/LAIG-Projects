:- include('display.pl').

%---------------------------------%
%----      Board Getters     -----%
%---------------------------------%

% Gets a piece from the board
getPiece(Row, Col, Board, Piece):-
    validPosition(Row, Col),
    RowCorrect is 5-Row+1,
    getRow(RowCorrect, Board, RowFinal),
    getPieceInRow(Col, RowFinal, Piece).

% getRow(+IndexOfRow, +Board, -Row) -> gets a specific row (all of it) from a board
getRow(1 ,[RowTarget|_], RowTarget).
getRow(Row, [_|RestOfRows], RowTarget):-
	RowNew is Row-1,
	getRow(RowNew, RestOfRows, RowTarget).

% getPieceInRow(+IndexOfCollumn, +Row, -Piece) -> gets a specific piece in a row of a board
getPieceInRow(1, [Piece|_], Piece).
getPieceInRow(Col, [_|RestOfCols], Piece):-
    ColNew is Col-1,
    getPieceInRow(ColNew, RestOfCols, Piece).

% Gets the color of a tile
getColor([_,_,Color], Color).

% Gets the nature color of a piece
getNature([_,Nature,_], Nature).

% Gets the team color of a piece
getTeam([Team,_,_], Team).



%---------------------------------%
%----      Board Setters     -----%
%---------------------------------%

% Sets a piece on the board, replacing the one currently in position
setPiece(RowNum, ColNum, Piece, Board, NewBoard):-
    validPosition(RowNum, ColNum),
    RowNumCorrect is 5-RowNum+1,
    getRow(RowNumCorrect, Board, Row),
    setPieceInRow(ColNum, Row, Piece, NewRow),
    setRow(RowNumCorrect, Board, NewRow, NewBoard).

% Removes a piece from the board, preserving the tile color
removePiece(RowNum, ColNum, Board, NewBoard):-
    getPiece(RowNum, ColNum, Board, Piece),
    getColor(Piece, Color),
    setPiece(RowNum, ColNum, [empty,null,Color], Board, NewBoard).

% setPieceInRow(+IndexOfCol, +Row, +Piece, -NewRow) -> sets a new piece in a row of a board, preserving the tile color
setPieceInRow(1, [[_,_,Color]|RestOfPieces], [TeamColor,TeamNature,_], [[TeamColor,TeamNature,Color]|RestOfPieces]).
setPieceInRow(Col, [CurrentPiece|RestOfPieces], Piece, [CurrentPiece|RestUndefined]):-
    ColNew is Col-1,
    setPieceInRow(ColNew, RestOfPieces, Piece, RestUndefined).

% setRow(+IndexOfRow, +Board, +Row, -NewBoard).
setRow(1, [_|RestOfRows], Row, [Row|RestOfRows]).
setRow(RowNum, [CurrentRow|RestOfRows], Row, [CurrentRow|RestUndefined]):-
    RowNumNew is RowNum-1,
    setRow(RowNumNew, RestOfRows, Row, RestUndefined).



%---------------------------------%
%----   Movement Verifying   -----%
%---------------------------------%

% Checks if a position is valid, that is, if it's inside the board
validPosition(RowNumber, CollumnNumber):-
    between(1, 5, RowNumber),
    between(1, 5, CollumnNumber).

%Checks if Initial Team is equal to Piece Team
validTeam(InitialTeam, PieceTeam):-
    InitialTeam == PieceTeam.


% Checks if a move is valid    trace,    trace,
validMove(Piece,InitialTeam, RowFrom, ColFrom, RowTo, ColTo, Board):-
    validPosition(RowFrom, ColFrom),
    validPosition(RowTo, ColTo),!,
    getPiece(RowTo, ColTo, Board, DestPiece),
    getTeam(Piece,Team),
    validTeam(InitialTeam,Team),!,
    Team \= empty,
    getTeam(DestPiece,DestTeam),!,
    Team \= DestTeam, !,
    checkMove(Piece, RowFrom, ColFrom, RowTo, ColTo, Board).

% Checking unitary movement
checkMove(_, RowFrom, ColFrom, RowTo, ColTo, _):-
    RowFrom-RowTo =< 1,
    RowFrom-RowTo >= -1,
    ColFrom-ColTo =< 1,
    ColFrom-ColTo >= -1.
% Checking horse-like movement
checkMove(Piece, RowFrom, ColFrom, RowTo, ColTo, _):-
    checkHorse(Piece), !,
    checkHorseMovement(RowFrom, ColFrom, RowTo, ColTo, _).
% Checking bishop-like movement
checkMove(Piece, RowFrom, ColFrom, RowTo, ColTo, Board):-
    checkBishop(Piece), !, 
    checkBishopMovement(RowFrom, ColFrom, RowTo, ColTo),
    checkFreeDiagonal(RowFrom, ColFrom, RowTo, ColTo, Board).

% Auxiliary predicate to check horse-like movement
checkHorseMovement(RowFrom, ColFrom, RowTo, ColTo, _):-
    abs(RowFrom-RowTo) =:= 2,
    abs(ColFrom-ColTo) =:= 1.
checkHorseMovement(RowFrom, ColFrom, RowTo, ColTo, _):-
    abs(RowFrom-RowTo) =:= 1,
    abs(ColFrom-ColTo) =:= 2.

% Auxiliary predicate to check bishop-like movement
checkBishopMovement(RowFrom, ColFrom, RowTo, ColTo):-
    abs(RowFrom-RowTo) =:= abs(ColFrom-ColTo).

% Auxiliary predicate to check if a diagonal is free, when movement is bishop-like
checkFreeDiagonal(RowFrom, ColFrom, RowTo, ColTo, Board):-
    incrementDiagonal(RowFrom, ColFrom, RowTo, ColTo, RowNew, ColNew),
    checkFreeDiagonalAux(RowNew, ColNew, RowTo, ColTo, Board).

checkFreeDiagonalAux(Row, Col, Row, Col, _).
checkFreeDiagonalAux(RowFrom, ColFrom, RowTo, ColTo, Board):-
    getPiece(RowFrom, ColFrom, Board, Piece),
    getTeam(Piece, Team),
    Team == empty,
    incrementDiagonal(RowFrom, ColFrom, RowTo, ColTo, RowNew, ColNew),    
    checkFreeDiagonalAux(RowNew, ColNew, RowTo, ColTo, Board).

incrementDiagonal(RowFrom, ColFrom, RowTo, ColTo, RowNew, ColNew):-
    RowTo < RowFrom, ColTo < ColFrom,
    RowNew is RowFrom-1, ColNew is ColFrom-1.
incrementDiagonal(RowFrom, ColFrom, RowTo, ColTo, RowNew, ColNew):-
    RowTo > RowFrom, ColTo < ColFrom,
    RowNew is RowFrom+1, ColNew is ColFrom-1.
incrementDiagonal(RowFrom, ColFrom, RowTo, ColTo, RowNew, ColNew):-
    RowTo < RowFrom, ColTo > ColFrom,
    RowNew is RowFrom-1, ColNew is ColFrom+1.
incrementDiagonal(RowFrom, ColFrom, RowTo, ColTo, RowNew, ColNew):-
    RowTo > RowFrom, ColTo > ColFrom,
    RowNew is RowFrom+1, ColNew is ColFrom+1.



%---------------------------------%
%----    Movement Applying   -----%
%---------------------------------%

% Performs the movement of a piece, checking if the movement if valid
move(Team,Number,NewNumber,RowFrom, ColFrom, RowTo, ColTo, Board, NewBoard):-
    getPiece(RowFrom, ColFrom, Board, Piece), !,
    validMove(Piece, Team, RowFrom, ColFrom, RowTo, ColTo, Board),
    numberPieces(RowTo, ColTo, Number, Board, NewNumber), !,
    removePiece(RowFrom, ColFrom, Board, NBoard),
    setPiece(RowTo, ColTo, Piece, NBoard, NewBoard).


%---------------------------------%
%----    Number of Pieces    -----%
%---------------------------------%

% Keeps track of the number of pieces
numberPieces(RowTo, ColTo, Number, Board, NewNumber):-
    getPiece(RowTo, ColTo, Board, Piece),
    getTeam(Piece, Team),
    Team == empty,
    NewNumber is Number.

numberPieces(_, _, Number, _, NewNumber):-
    NewNumber is Number-1.


%---------------------------------%
%----     Piece checking     -----%
%---------------------------------%

% Checks if a piece can move like a bishop
checkBishop(Piece):-         
    getNature(Piece,Nature), 
    getColor(Piece,Color),
    Nature = 'bn',
    Color = 'bt'.
checkBishop(Piece):-
    getNature(Piece,Nature),
    getColor(Piece,Color),
    Nature = 'wn',
    Color = 'wt'.

% Checks if a piece can move like a horse
checkHorse(Piece):-         
    getNature(Piece,Nature), 
    getColor(Piece,Color),
    Nature = 'wn',
    Color = 'bt'.
checkHorse(Piece):-         
    getNature(Piece,Nature), 
    getColor(Piece,Color),
    Nature = 'bn',
    Color = 'wt'.
