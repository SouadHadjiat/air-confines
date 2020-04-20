import { Component } from '@angular/core';
import { CityQuiz } from './city-quiz.model';
import { Game, GameLevel } from './game.model';
import { GameService } from './game.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {

  game: Game;
  currentLevel: GameLevel;
  currentQuestion: CityQuiz;
  currentQuestionIndex: number = 0;
  score: number = 0;

  answerModel: string;

  constructor(public gameService: GameService) {
    this.game = this.gameService.loadGame();
    if (this.game.levels.length > 0) {
      this.currentLevel = this.game.levels[0];
      this.currentQuestion = this.currentLevel.questions[0];
    }
  }

  onNextQuestion() {
    if (this.currentQuestionIndex < this.currentLevel.questions.length - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.currentLevel.questions[this.currentQuestionIndex];
    } else {
      this.onNextLevel();
    }
  }

  onNextLevel() {
    const currentLevel = this.currentLevel.level;
    if (currentLevel < this.game.levels.length - 1) {
      this.currentLevel = this.game.levels[currentLevel];
    }
  }

  onSubmitAnswer() {
    if (this.answerModel && this.currentQuestion.cityName.toLowerCase() == this.answerModel.toLowerCase()) {
      this.score++;
    }
  }
  
}
