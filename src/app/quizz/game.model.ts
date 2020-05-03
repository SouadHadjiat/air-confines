import { CityQuiz } from './city-quiz.model';

export const LEVEL_SCORE_TO_COMPLETE: number = 8;
export const LEVEL_TIMER_BONUS_GOAL: number = 25;

export class Game {
  levels: GameLevel[] = [];

  constructor(data: any = {}) {
    this.levels = data.levels.map(level => new GameLevel(level));
  }
}

export class GameLevel {
  level: number;
  questions: CityQuiz[] = [];
  completed: boolean = false; //

  constructor(data: any = {}) {
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

export class GameResult {
  level: number = 0;
  score: number = 0;
  time: number = 0;

  constructor(data: any = {}) {
    this.level = data.level || 0;
    this.score = data.score || 0;
    this.time = data.time || 0;
  }
}
