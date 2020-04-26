import { CityQuiz } from './city-quiz.model';

export const MAX_LEVEL: number = 10;
export const LEVEL_SCORE_TO_COMPLETE: number = 5;

export class Game {
  levels: GameLevel[] = [];

  constructor(data: any) {
    this.levels = data.levels.map(level => new GameLevel(level));
  }
}

export class GameLevel {
  level: number;
  questions: CityQuiz[] = [];
  completed: boolean = false; //

  constructor(data: any) {
    this.level = data.level;
    this.questions = data.questions.map(question => new CityQuiz(question));
  }

  shuffleQuestions() {
      let j, x, i;
      for (i = this.questions.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = this.questions[i];
        this.questions[i] = this.questions[j];
        this.questions[j] = x;
      }
  }

}