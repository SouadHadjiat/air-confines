import { Injectable } from '@angular/core';
// @ts-ignore
import gameConfig from "./game-config.json";
import { Game, GameResult } from './game.model';

@Injectable()
export class GameService {

  static readonly GAME_BEST_RESULT_STORAGE_KEY: string = 'best-result';

  constructor() {}

  loadGame(): Game {
    return new Game(gameConfig);
  }

  saveGameBestResult(gameResult: GameResult): GameResult {
    if (localStorage && gameResult) {
      localStorage.setItem(GameService.GAME_BEST_RESULT_STORAGE_KEY, JSON.stringify(gameResult));
    }
    return gameResult;
  }

  loadGameBestResult(): GameResult {
    if (!localStorage) {
      return new GameResult();
    }
    let gameStoredResult = localStorage.getItem(GameService.GAME_BEST_RESULT_STORAGE_KEY);
    if (gameStoredResult) {
      return new GameResult(JSON.parse(gameStoredResult));
    }
    return new GameResult();
  }
}
