import { Component } from '@angular/core';
import { CityQuiz } from './city-quiz.model';
import { Game, GameLevel, LEVEL_SCORE_TO_COMPLETE } from './game.model';
import { GameService } from './game.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {

  game: Game;
  currentLevel: GameLevel;
  currentLevelScoreGoal = LEVEL_SCORE_TO_COMPLETE;
  currentLevelRightAnswersCount = 0;
  currentQuestion: CityQuiz;
  currentQuestionIndex: number = 0;
  score: number = 0;
  locale: string = 'fr'; // for now only french supported

  answerModel: string; // TODO set a real city search input
  answerStatus: string = 'NA'; //'NA', 'CORRECT', 'WRONG'
  gameOver: boolean = false;

  timer: any;
  timerValueSeconds: number = 0;

  constructor(public gameService: GameService) {
    this.game = this.gameService.loadGame();
    if (this.game.levels.length > 0) {
      // set first level
      const firstLevel = this.game.levels[0];
      this.setCurrentLevel(firstLevel)
    }
    this.startTimer();
  }

  onNextQuestion() {
    if (this.answerStatus == 'NA') {
      // you need to try to answer before going to next question
      return;
    }
    this.resetAnswer();
    if (this.currentLevel.completed) {
      // current level is already completed, next level
      this.onNextLevel();
    } else if (this.currentQuestionIndex < this.currentLevel.questions.length - 1) {
      // next question
      this.currentQuestionIndex++;
      this.currentQuestion = this.currentLevel.questions[this.currentQuestionIndex];
    } else {
      // restart level at 0 ?
      this.currentQuestionIndex = 0;
      this.currentQuestion = this.currentLevel.questions[this.currentQuestionIndex];
    }
  }

  onNextLevel() {
    const currentLevel = this.currentLevel.level;
    if (currentLevel < this.game.levels.length - 1) {
      const nextLevel = this.game.levels[currentLevel];
      this.setCurrentLevel(nextLevel)
    } else {
      this.endGame();
    }
  }

  onSubmitAnswer() {
    if (!this.answerModel || this.answerStatus == 'CORRECT') {
      return;
    }
    if (this.currentQuestion.checkIsCorrectAnswer(this.answerModel, this.locale)) {
      this.score++;
      this.currentLevelRightAnswersCount++;
      this.setCorrectAnswerStatus();
    } else {
      this.setWrongAnswerStatus()
    }
    if (this.currentLevelRightAnswersCount == this.currentLevelScoreGoal) {
      this.currentLevel.completed = true
    }
  }

  onKeyEnter() {
    if (this.answerStatus == 'CORRECT') {
      this.onNextQuestion()
    } else {
      this.onSubmitAnswer()
    }
  }

  private endGame() {
    this.gameOver = true;
    this.stopTimer();
  }

  private setCurrentLevel(level: GameLevel) {
    this.currentLevel = level;
    this.currentLevel.shuffleQuestions();
    this.currentQuestionIndex = 0;
    this.currentQuestion = this.currentLevel.questions[0];
  }

  private setCorrectAnswerStatus() {
    this.answerStatus = 'CORRECT'
  }

  private setWrongAnswerStatus() {
    this.answerStatus = 'WRONG'
  }

  private resetAnswer() {
    this.answerStatus = 'NA';
    this.answerModel = '';
  }

  private startTimer() {
    this.timer = setInterval(() => {this.timerValueSeconds++}, 1000)
  }

  private stopTimer() {
    clearInterval(this.timer)
  }

}
