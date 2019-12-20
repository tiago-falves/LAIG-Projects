:- include('input.pl').
:- include('ai.pl').

%---------------------------------%
%----        Main Menu       -----%
%---------------------------------%

% First predicate that is called.
% Initializes the game by showing the main menu.
% If an input is invalid, that is, there's no true
% 'chooseOption' for it, asks again.
play:-
    mainMenu,
    askInt(Option),
    chooseOption(Option).
play:-
    nl, write('Invalid option.'), nl,
    askEnter,
    play.   

% predicate that handles user input and goes to the intended menu
chooseOption(1):-
    playOption.
chooseOption(2):-
    howToPlay,
    askEnter,
    play.
chooseOption(3):-
    thankYou,
    abort.
chooseOption(4):-
    thankYouGarfield,
    abort.    

% Generic predicate to be used in the end of a game, so that
% the program doesn't stop. It just goes back to the main menu.
returnToMain:-
    nl, askEnter,
    play.



%---------------------------------%
%----        Play Menu       -----%
%---------------------------------%

% Show the 'Play Menu', where all forms of playing are displayed
% (HvH, HvM, MvH, MvM)
playOption:-
    playersMainMenu,
    tryChoosePlayOption.

% Input handler for the 'Play Menu'
tryChoosePlayOption:-
    askInt(Option),
    choosePlayOption(Option).
tryChoosePlayOption:-
    nl, write('Invalid option.'), nl,
    askEnter,
    playOption.

% Goes to the next stage, given the chosen option. The only one that
% starts the game right away is option 1 (HvH). The other ones need
% difficulty choosing
choosePlayOption(1):-
    initGame(5,human,human).
choosePlayOption(2):-
    playerVsComputer.
choosePlayOption(3):-
    computerVsPlayer.
choosePlayOption(4):-
    computerVsComputer.
choosePlayOption(5):-
    play.


%---------------------------------%
%----        HvM Menu        -----%
%---------------------------------%

% Asks for difficulty and starts the game (player is red, computer is blue)
playerVsComputer:-
    difficultyMenuBlue,
    askInt(Option),
    checkGoBackDifficulty(Option),
    chooseDifficulty(Option, blue).
playerVsComputer:-
    nl, write('Invalid option for difficulty.'), nl,
    askEnter,
    playerVsComputer.

% Checks if the 'Go Back' option was selected and applies it
checkGoBackDifficulty(5):-
    !, playOption.
checkGoBackDifficulty(_).



%---------------------------------%
%----        MvH Menu        -----%
%---------------------------------%

% Asks for difficulty and starts the game (computer is red, player is blue)
computerVsPlayer:-
    difficultyMenuRed,
    askInt(Option),
    checkGoBackDifficulty(Option),
    chooseDifficulty(Option, red).
computerVsPlayer:-
    nl, write('Invalid option for difficulty.'), nl,
    askEnter,
    computerVsPlayer.



%---------------------------------%
%----        MvM Menu        -----%
%---------------------------------%

% Asks for both ai's difficulties and starts the game
computerVsComputer:-
    difficultyMenuRed,
    askInt(Red),
    checkGoBackDifficulty(Red),
    difficultyMenuBlue,
    askInt(Blue),
    checkGoBackDifficulty(Blue),
    chooseDifficulty(Red,Blue).
computerVsComputer:-
    nl, write('Invalid options for difficulty.'), nl,
    askEnter,
    computerVsComputer. 



%------------------------------------------%
%----    Machine Difficulty Options    ----%
%------------------------------------------%

% Player vs Computer (Player is Red, Computer is Blue)
chooseDifficulty(BlueNumber, blue):-
    parseDifficulty(BlueNumber, Difficulty),
    initGame(5, human, Difficulty).

% Computer vs Player (Computer is Red, Player is Blue)
chooseDifficulty(RedNumber, red):-
    parseDifficulty(RedNumber, Difficulty),
    initGame(5, Difficulty, human).

% Computer vs Computer
chooseDifficulty(RedNumber, BlueNumber):-
    parseDifficulty(RedNumber, RedDifficulty),
    parseDifficulty(BlueNumber, BlueDifficulty),
    initGame(5, RedDifficulty, BlueDifficulty).



%---------------------------------%
%----    Game Initializing   -----%
%---------------------------------%

% Initializes the game. Red is always first
initGame(BoardSize, ModeRed, ModeBlue):-
    getInitialBoard(Board),
    NumRedPieces is BoardSize,
    NumBluePieces is BoardSize,
    gameRedCheckLossBeforePlay(ModeRed,ModeBlue,BoardSize,NumRedPieces,NumBluePieces,Board).



%---------------------------------%
%----        Game Flow       -----%
%---------------------------------%

% Before red's play, checks if blue has won by the 'one piece left' rule
gameRedCheckLossBeforePlay(ModeRed, ModeBlue, BoardSize, NumRedPieces, NumBluePieces, Board):-
    \+ game_over(Board, blue, NumBluePieces, onePiece),
    gameRedPlay(ModeRed,ModeBlue,BoardSize, NumRedPieces, NumBluePieces, Board).
gameRedCheckLossBeforePlay(_,_,_, _, _, Board):-
    displayBoard(Board),
    displayBlueWins,
    !, returnToMain.

% Red makes a play
gameRedPlay(ModeRed, ModeBlue, BoardSize, NumRedPieces, NumBluePieces, Board):-
    displayBoard(Board),
    askAndMove(ModeRed,'Red team', 'red', NumBluePieces, NewNumBluePieces, Board, NewBoard),
    gameRedCheckWin(ModeRed,ModeBlue,BoardSize, NumRedPieces, NewNumBluePieces, NewBoard).

% Checks if, after the play, red has won by eating all of blue's pieces
gameRedCheckWin(ModeRed, ModeBlue, BoardSize, NumRedPieces, NumBluePieces, Board):-
    \+ game_over(_, red, NumBluePieces, ateAll),
    gameRedCheckLossAfterPlay(ModeRed,ModeBlue,BoardSize, NumRedPieces, NumBluePieces, Board).
gameRedCheckWin(_,_,_, _, _, Board):-
    displayBoard(Board),
    displayRedWins, 
    !, returnToMain.

% After red's play and before blue's play, checks if blue has won by the 'last line' rule
gameRedCheckLossAfterPlay(ModeRed, ModeBlue, BoardSize, NumRedPieces, NumBluePieces, Board):-
    \+ game_over(Board, blue, _, lastLine),
    gameBlueCheckLossBeforePlay(ModeRed, ModeBlue, BoardSize, NumRedPieces, NumBluePieces, Board).
gameRedCheckLossAfterPlay(_,_,_, _, _, Board):-
    displayBoard(Board),
    displayBlueWins,
    !, returnToMain.


% Before blue's play, checks if red has won by the 'one piece left' rule
gameBlueCheckLossBeforePlay(ModeRed, ModeBlue, BoardSize, NumRedPieces, NumBluePieces, Board):-
    \+ game_over(Board, red, NumRedPieces, onePiece),
    gameBluePlay(ModeRed, ModeBlue, BoardSize, NumRedPieces, NumBluePieces, Board).
gameBlueCheckLossBeforePlay(_,_,_, _, _, _):-
    displayRedWins,
    !, returnToMain.

% Blue makes a play
gameBluePlay(ModeRed, ModeBlue, BoardSize, NumRedPieces, NumBluePieces, Board):-
    displayBoard(Board),
    askAndMove(ModeBlue,'Blue team', 'blue', NumRedPieces, NewNumRedPieces, Board, NewBoard),
    gameBlueCheckWin(ModeRed,ModeBlue,BoardSize, NewNumRedPieces, NumBluePieces, NewBoard).

% Checks if, after the play, blue has won by eating all of red's pieces
gameBlueCheckWin(ModeRed, ModeBlue, BoardSize, NumRedPieces, NumBluePieces, Board):-
    \+ game_over(_, blue, NumRedPieces, ateAll),
    gameBlueCheckLossAfterPlay(ModeRed,ModeBlue,BoardSize, NumRedPieces, NumBluePieces, Board).
gameBlueCheckWin(_,_,_, _, _, Board):-
    displayBoard(Board),
    displayBlueWins,
    !, returnToMain.

% After blue's play and before red's play, checks if red has won by the 'last line' rule
gameBlueCheckLossAfterPlay(ModeRed, ModeBlue, BoardSize, NumRedPieces, NumBluePieces, Board):-
    \+ game_over(Board, red, _, lastLine),
    gameRedCheckLossBeforePlay(ModeRed,ModeBlue,BoardSize, NumRedPieces, NumBluePieces, Board).
gameBlueCheckLossAfterPlay(_,_,_, _, _, Board):-
    displayBoard(Board),
    displayRedWins,
    !, returnToMain.



%---------------------------------%
%----    Movement asking     -----%
%---------------------------------%

% Human is asked for a play, then plays it. Repeats until a play is valid
askAndMove(human, Player, Team, NumPieces, NewNumPieces, Board, NewBoard):-
    askForPlay(RowFrom, ColFrom, RowTo, ColTo, Player),
    andMove(Player, Team, NumPieces, NewNumPieces, RowFrom, ColFrom, RowTo, ColTo, Board, NewBoard).

% CPU performs a move, in a specific difficulty (easy, normal, hard or expert)
askAndMove(Difficulty, _, Team, NumPieces, NewNumPieces, Board, NewBoard):-
    displayCpuTurn(Team),
    choose_move(Board, Team, Difficulty, NumPieces, Move),
    askEnter,
    getMoveCoords(Move, RowFrom, ColFrom, RowTo, ColTo),
    move(Team, NumPieces, NewNumPieces, RowFrom, ColFrom, RowTo, ColTo, Board, NewBoard).

% Auxiliary predicate for the askAndMove-human variant, that checks if a move is valid after user input
% If it isn't, asks for a move again
andMove(_, Team, NumPieces, NewNumPieces, RowFrom, ColFrom, RowTo, ColTo, Board, NewBoard):-
    move(Team, NumPieces, NewNumPieces, RowFrom, ColFrom, RowTo, ColTo, Board, NewBoard).
andMove(Player, Team, NumPieces, NewNumPieces, _, _, _, _ , Board, NewBoard):-
    invalidMove,
    nl, nl,
    displayBoard(Board),
    askAndMove(human, Player, Team, NumPieces, NewNumPieces, Board, NewBoard).

%---------------------------------%
%----      Board State       -----%
%---------------------------------%
      
getInitialBoard([[[blue,wn,bt], [blue,bn,wt], [blue,wn,bt], [blue,bn,wt], [blue,wn,bt]],
                  [[empty,null,wt], [empty,null,bt], [empty,null,wt], [empty,null,bt], [empty,null,wt]],
                  [[empty,null,bt], [empty,null,wt], [empty,null,bt], [empty,null,wt], [empty,null,bt]],
                  [[empty,null,wt], [empty,null,bt], [empty,null,wt], [empty,null,bt], [empty,null,wt]],
                  [[red,wn,bt], [red,bn,wt], [red,wn,bt], [red,bn,wt], [red,wn,bt]]]
).

