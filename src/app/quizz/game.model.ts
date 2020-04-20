import { CityQuiz } from './city-quiz.model';

export const MAX_LEVEL: number = 10;

export class Game {
  levels: GameLevel[] = [];

  constructor(data: any) {
    this.levels = data.levels.map(level => new GameLevel(level));
  }
}

export class GameLevel {
  level: number;
  questions: CityQuiz[] = [];

  constructor(data: any) {
    this.level = data.level;
    this.questions = data.questions.map(question => new CityQuiz(question));
  }
}
