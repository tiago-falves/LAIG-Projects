:- include('movement.pl').

%---------------------------------%
%----   Winning Conditions   -----%
%---------------------------------%

% Checks if red has won by the 'last line' condition, that is,
% it checks if the 5th line has any red Piece
game_over(Board, red, _, lastLine):-
    getRow(1, Board, Row),!,
    member([red|_], Row). 

% Checks if blue has won by the 'last line' condition, that is,
% it checks if the 1st line has any blue Piece
game_over(Board, blue, _, lastLine):-
    getRow(5, Board, Row),!,
    member([blue|_], Row).   

% Checks the 'one piece left' winning condition for a given team 
game_over(Board, Team, 1, onePiece):-
    game_over(Board, Team, _, lastLine).

% Checks if a team has zero pieces left
game_over(_, _, 0, ateAll).

                