import { Injectable } from '@angular/core';
// @ts-ignore
import gameConfig from "./game-config.json";
import { Game } from './game.model';

@Injectable()
export class GameService {

  constructor() {}

  loadGame(): Game {
    return new Game(gameConfig);
  }
}
