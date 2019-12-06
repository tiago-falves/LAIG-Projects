:- include('rules.pl').

%---------------------------------%
%----     Move Generation    -----%
%---------------------------------%

% Generates all moves for a given team -> returns a list that stores the coordinates from and to, 
% also with the resulting number of opponent pieces. That allows to choose the best move by choosing 
% the one with the least opponent pieces left
valid_moves(Team, NumberOpponentPieces, Board, ListOfMoves):-   
    findall( [ [RowFrom, ColFrom],
               [RowTo, ColTo],
               NumOpponentPiecesLeft
             ],
             possibleMove(Team, NumberOpponentPieces,NumOpponentPiecesLeft, Board,RowFrom, ColFrom, RowTo, ColTo),
             ListResult
           ),
    sort(ListResult, ListResultUnique),                          % Eliminates duplicates
    predsort(sortPieceNumber, ListResultUnique, ListOfMoves).    % Orders By Number of opponents pieces

% Auxiliary structure for findall
possibleMove(Team, NumberOpponentPieces,NumOpponentPiecesLeft, Board,RowFrom, ColFrom, RowTo, ColTo):-
    validPosition(RowFrom, ColFrom),
    validPosition(RowTo, ColTo),
    move(Team, NumberOpponentPieces, NumOpponentPiecesLeft, RowFrom, ColFrom, RowTo, ColTo, Board, _).

%Compare predicate to order generated moves acoording to number of pieces
sortPieceNumber(X,  [_, _, NumberOpponentPieces1], [_, _, NumberOpponentPieces2]) :-
    NumberOpponentPieces1 == NumberOpponentPieces2;
    compare(X, NumberOpponentPieces1, NumberOpponentPieces2).



%---------------------------------%
%----     Useful predicates   -----%
%---------------------------------%

% Given a move gets the Number of opponent Pieces
getOpponentPieceNum([_,_,Number],Number).

% Given Coordinates gets the correspondent Row
getRow([Row,_],Row).

% Given Coordinates gets the correspondent Collumn
getCol([_,Col],Col).

% Gets First Element of a list
getFirstElement([First|_],First).

% Given a Move, Gets the row and collumn from where the piece was moved
getFromCoords([FromCoords,_,_],RowFrom,ColFrom):-
    getRow(FromCoords,RowFrom),
    getCol(FromCoords,ColFrom).

% Given a Move, Gets the row and collumn to where the piece is going to be moved
getToCoords([_,ToCoords,_],RowTo,ColTo):-
    getRow(ToCoords,RowTo),
    getCol(ToCoords,ColTo).

%Given a move Gets the coordinates from where it was moved and to where
getMoveCoords(Move,RowFrom,ColFrom,RowTo,ColTo):-
    getFromCoords(Move,RowFrom,ColFrom),
    getToCoords(Move,RowTo,ColTo).



%---------------------------------%
%----    AI Move Selector    -----%
%---------------------------------%

% CPU in easy mode (Random) -> given a board and a team, generates a completely random play 
choose_move(Board, Team, easy, NumberOpponentPieces, Move):-
    valid_moves(Team, NumberOpponentPieces, Board, ListOfMoves),
    getRandomMove(ListOfMoves, Move).

% CPU in normal mode (Greedy) -> given a board and a team, generates one of the moves that moves 
% the piece closest to the enemy's last line
choose_move(Board, Team, medium, NumberOpponentPieces, Move):-
    valid_moves(Team, NumberOpponentPieces, Board, ListOfMoves),
    getFarthestMoves(Team, ListOfMoves, ListOfFarthestMoves),
    getRandomMove(ListOfFarthestMoves, Move).

% CPU in hard mode (Greedy) -> given a board and a team, generates one of the moves that eats
% an opponent's piece. Otherwise, picks a random move
choose_move(Board, Team, hard, NumberOpponentPieces, Move):-
    valid_moves(Team, NumberOpponentPieces, Board, ListOfMoves),
    getMinimumMoves(ListOfMoves, ListOfMinimumMoves),
    getRandomMove(ListOfMinimumMoves, Move).

% CPU in hard mode (Minimax) -> given a board and a team, applies an evaluation predicate for each
% of the possible moves. It then applies another evaluation predicate for each one of possibilites  
% as an opponent's response to a move, in an attempt to maximize the player's chances and minimize 
% the opponent's chances
choose_move(Board, Team, expert, NumberOpponentPieces, Move):-
    valid_moves(Team, NumberOpponentPieces, Board, ListOfMoves),
    analyseMoves(Team,  Board, ListOfMoves, [], Values),
    max_list(Values, MaxValue),
    indexesOf(Values, MaxValue, 0, [], Indexes),
    length(Indexes, IndexesLength),
    random(0, IndexesLength, Selector),
    nth0(Selector, Indexes, Index),
    length(Values, Length),
    CorrectIndex is Length-1-Index,
    nth0(CorrectIndex, ListOfMoves, Move).



%---------------------------------%
%----    Easy AI Predicates   -----%
%---------------------------------%

% Generates a random move given a List of moves
getRandomMove(ListOfMoves,Move):-
    length(ListOfMoves, Length),
    random(0, Length, Index),
    nth0(Index, ListOfMoves, Move).



%---------------------------------%
%----   Medium AI Predicates  -----%
%---------------------------------%

% Generates all of the moves that are the closest to red's opponent's starting line
getFarthestMoves(red, ListOfMinimumMoves, ListOfFarthestMoves):-
    predsort(sortFarthestRed, ListOfMinimumMoves, ListFarthestFirst),
    getFirstElement(ListFarthestFirst, Move),
    getToCoords(Move, Row, _),
    include(farthestRow(Row), ListFarthestFirst, ListOfFarthestMoves).

% Generates all of the moves that are the closest to blue's opponent's starting line
getFarthestMoves(blue, ListOfMinimumMoves, ListOfFarthestMoves):-
    predsort(sortFarthestBlue, ListOfMinimumMoves, ListFarthestFirst),
    getFirstElement(ListFarthestFirst, Move),
    getToCoords(Move, Row, _),
    include(farthestRow(Row), ListFarthestFirst, ListOfFarthestMoves).

% Auxiliary predicate for predsort, so that the moves closest to the opponent's starting line appear first    
sortFarthestRed(>, [_, [Row1, _], _], [_, [Row2, _], _]) :-
    Row1 < Row2.
sortFarthestRed(<, [_, [Row1, _], _], [_, [Row2, _], _]) :-
    Row1 >= Row2.

% Auxiliary predicate for predsort, so that the moves closest to the opponent's starting line appear first    
sortFarthestBlue(>, [_, [Row1, _], _], [_, [Row2, _], _]) :-
    Row1 >= Row2.
sortFarthestBlue(<, [_, [Row1, _], _], [_, [Row2, _], _]) :-
    Row1 < Row2.

% Auxiliary predicate for include, so that only the closest moves to the opponent's starting line are considered
farthestRow(Row, [_, [Row, _], _]).



%---------------------------------%
%----   Hard AI Predicates   -----%
%---------------------------------%

% Generates moves that have the smallest number of opponent pieces left
getMinimumMoves(ListOfMoves, ListOfMinimumMoves):-
    getFirstElement(ListOfMoves, Move),
    getOpponentPieceNum(Move, Min),
    include(minimumMove(Min), ListOfMoves, ListOfMinimumMoves).

% Auxiliary predicate used in 'include', to extract from a list every move that has 'Min' opponent pieces left
minimumMove(Min, [_, _, Min]).



%---------------------------------%
%----   Expert AI Predicates  ----%
%---------------------------------%

% The main predicate for the Expert AI -> analyses all of the possible moves for the CPU, as well
% as every possible response by the opponent to each of the moves, in a recursive manner
analyseMoves(_, _, [], L, L).
analyseMoves(Team, Board, [Move|RestOfMoves], ValuesSoFar, Values):-
    getOpponentPieceNum(Move, NumberOpponentPieces),
    getBoardAfterMove(Team, Move, Board, NewBoard),
    value(Team, current, NewBoard, _, ValueCurrent),
    value(Team, next, NewBoard, NumberOpponentPieces, ValueNext),
    ValueTotal is ValueCurrent + ValueNext,
    ValuesTemp = [ValueTotal | ValuesSoFar],
    analyseMoves(Team, Board, RestOfMoves, ValuesTemp, Values).

% Gives a concrete value to a given board for the AI to make the best decision
% There are two ways of assigning value: to the current move or to the next move, 
% that is, the opponent's response
value(Team, current, Board,_, Value):-
    getLastLineValue(Team, Board, ValueLastLine),
    getPositionValue(Team, Board, ValuePosition),
    Value is ValuePosition + ValueLastLine.
value(blue, next, Board, NumberOpponentPieces, Value):-
    valid_moves(red, 1, Board, OpponentMoves),
    getNumberOfEatingMoves(OpponentMoves, Eaten),
    Value is -3*NumberOpponentPieces - 2*Eaten.
value(red, next, Board, NumberOpponentPieces, Value):-
    valid_moves(blue, 1, Board, OpponentMoves),
    getNumberOfEatingMoves(OpponentMoves, Eaten),
    Value is -3*NumberOpponentPieces - 2*Eaten.

% Auxiliary predicate for the value predicate of the current move, that checks if a piece is in the CPU's
% first line. If there is one, that means the current move did not eat it, therefore
% it's a bad move and it will make the CPU lose. So, it is assigned a very negative value.
% If there are no pieces there, then 0 is assigned to the value.
getLastLineValue(blue, Board, ValueLastLine):-
    getRow(1, Board, Row),
    checkAndDefineValueLastLine([red|_], Row, ValueLastLine).
getLastLineValue(red, Board, ValueLastLine):-
    getRow(5, Board, Row),
    checkAndDefineValueLastLine([blue|_], Row, ValueLastLine).

% Auxiliary predicate for getLastLineValue, that defines the value itself
checkAndDefineValueLastLine(ToCheck, Row, ValueLastLine):-
    member(ToCheck, Row),
    ValueLastLine is -200.
checkAndDefineValueLastLine(_, _, ValueLastLine):-
    ValueLastLine is 0. 


% Auxiliary predicate for the value predicate of the current move, that checks if one of the CPU's pieces 
% is positioned in the enemy line. If there's one, then it is assigned a positive value,
% because there's a higher chance of winning. If, by playing to the last line is too dangerous,
% the positive value assigned will be counter-balanced in the analysis of the opponent's responses
getPositionValue(blue, Board, ValuePosition):-
    getRow(5, Board, Row),
    checkAndDefineValuePosition([blue|_], Row, ValuePosition).  
getPositionValue(red, Board, ValuePosition):-
    getRow(1, Board, Row),
    checkAndDefineValuePosition([red|_], Row, ValuePosition).  

% Auxiliary predicate for getPosition, that defines the value itself
checkAndDefineValuePosition(ToCheck, Row, ValuePosition):-
    member(ToCheck, Row),
    ValuePosition is 30.
checkAndDefineValuePosition(_, _, ValuePosition):-
    ValuePosition is 0. 

% Auxiliary predicate for the value predicate of the opponent's response, that checks
% how many responses of the opponent involve eating one of the CPU's piece.
% For each one of those plays, a negative value is assigned.
getNumberOfEatingMoves(ListOfMoves, Eaten):-
    include(ateInMove, ListOfMoves, ListOfEatingMoves),
    length(ListOfEatingMoves, Eaten).

% Auxiliary predicate for getNumberOfEatingMoves, that extracts from the list of responses
% the ones that ate a piece
ateInMove([_, _, 0]).

% Auxiliary predicate that generates the resulting board for a given move
getBoardAfterMove(Team, Move, Board, NewBoard):-
    getMoveCoords(Move, RowFrom, ColFrom, RowTo, ColTo),
    move(Team, 1, _, RowFrom, ColFrom, RowTo, ColTo, Board, NewBoard).

% Auxiliary predicate that determines all of the indexes of an element in a list
indexesOf([], _, _, Indexes, Indexes).
indexesOf([Element|RestOfElements], Wanted, CurrentIndex, IndexesSoFar, Indexes):-
    Element == Wanted,
    IndexesTemp = [CurrentIndex | IndexesSoFar],
    NewIndex is CurrentIndex+1,
    indexesOf(RestOfElements, Wanted, NewIndex, IndexesTemp, Indexes).
indexesOf([_|RestOfElements], Wanted, CurrentIndex, IndexesSoFar, Indexes):-
    NewIndex is CurrentIndex+1,
    indexesOf(RestOfElements, Wanted, NewIndex, IndexesSoFar, Indexes).
