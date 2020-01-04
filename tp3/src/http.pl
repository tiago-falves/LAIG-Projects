:- use_module(library(http/http_json)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_error)).
:- use_module(library(http/http_server)).
:- use_module(library(http/http_cors)).

:- include('chameleon.pl').


%http://localhost:8080/endgameMyTurn
%no body sao enviados os argumentos
:- http_handler(root(move), moveHandler, []).
:- http_handler(root(endgameMyTurn), endgameMyTurnHandler, []).
:- http_handler(root(endgameHisTurn), endgameHisTurnHandler, []).
:- http_handler(root(chooseMove), chooseMoveHandler, []).

initializeServer():-
    http_server([port(8080)]).

:- set_setting(http:cors, [*]).

%move
moveHandler(Request):-
    option(method(options), Request), !,
    cors_enable(Request,
                [ methods([get,post,delete])
                ]),
    format('~n').

moveHandler(Request):-
    cors_enable,
    http_read_json(Request, JSONIn),
    json_to_prolog(JSONIn, moveRequest(Team, Number, RowFrom, ColFrom, RowTo, ColTo, Board)),
    movePredicate(Team,Number,NewNumber,RowFrom, ColFrom, RowTo, ColTo, Board, NewBoard, Valid),
    prolog_to_json(moveResult(Valid, NewNumber, NewBoard), JSONOut),
    reply_json(JSONOut).

movePredicate(Team,Number,NewNumber,RowFrom, ColFrom, RowTo, ColTo, Board, NewBoard, 1):-
    move(Team,Number,NewNumber,RowFrom, ColFrom, RowTo, ColTo, Board, NewBoard),
    !.

movePredicate(_,_,0,_, _, _, _, _, [], 0).

:- json_object moveRequest(team: atom, number: integer, rowFrom: integer, colFrom: integer, rowTo: integer, colTo: integer, board: list).
:- json_object moveResult(valid: integer, newNumber: integer, newBoard: list).

%endgame my turn
endgameMyTurnHandler(Request):-
    option(method(options), Request), !,
    cors_enable(Request,
                [ methods([get,post,delete])
                ]),
    format('~n').

endgameMyTurnHandler(Request):-
    cors_enable,
    http_read_json(Request, JSONIn),
    json_to_prolog(JSONIn, endgameRequest(Team, Number, Board)),
    game_over(Board, Team, Number, onePiece),
    prolog_to_json(endgameResult(1), JSONOut),
    reply_json(JSONOut).

%endgame his turn
endgameHisTurnHandler(Request):-
    option(method(options), Request), !,
    cors_enable(Request,
                [ methods([get,post,delete])
                ]),
    format('~n').

endgameHisTurnHandler(Request):-
    cors_enable,
    http_read_json(Request, JSONIn),
    json_to_prolog(JSONIn, endgameRequest(Team, Number, Board)),
    game_over(Board, Team, Number, lastline),
    prolog_to_json(endgameResult(1), JSONOut),
    reply_json(JSONOut).

:- json_object endgameRequest(team: atom, number: integer, board: list).
:- json_object endgameResult(won: integer).

%choose move
chooseMoveHandler(Request):-
    option(method(options), Request), !,
    cors_enable(Request,
                [ methods([get,post,delete])
                ]),
    format('~n').

chooseMoveHandler(Request):-
    cors_enable,
    http_read_json(Request, JSONIn),
    json_to_prolog(JSONIn, chooseMoveRequest(Board, Team, Difficulty, NumberOpponentPieces)),
    choose_move(Board, Team, Difficulty, NumberOpponentPieces, Move),
    prolog_to_json(chooseMoveResult(Move), JSONOut),
    reply_json(JSONOut).

:- json_object chooseMoveRequest(board: list, team: atom, difficulty: atom, numberOpponentPieces: integer).
:- json_object chooseMoveResult(move: list).