:- use_module(library(http/http_json)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_error)).
:- use_module(library(http/http_server)).

:- include('movement.pl').

:- http_handler(root(move), moveHandler, []).

initializeServer():-
    http_server([port(8080)]).

moveHandler(Request):-
    http_read_json(Request, JSONIn),
    json_to_prolog(JSONIn, moveRequest(Team, Number, RowFrom, ColFrom, RowTo, ColTo, Board)),
    move(Team,Number,NewNumber,RowFrom, ColFrom, RowTo, ColTo, Board, NewBoard),
    prolog_to_json(moveResult(NewNumber, NewBoard), JSONOut),
    reply_json(JSONOut).

:- json_object moveRequest(team: atom, number: integer, rowFrom: integer, colFrom: integer, rowTo: integer, colTo: integer, board: list).
:- json_object moveResult(newNumber: integer, newBoard: list).