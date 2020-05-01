import { Component } from '@angular/core';
import { CityQuiz } from './city-quiz.model';
import { Game, GameLevel, LEVEL_SCORE_TO_COMPLETE, LEVEL_TIMER_BONUS_GOAL } from './game.model';
import { GameService } from './game.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {

  game: Game;
  gameStatus: string = 'PLAYING'; // 'PLAYING', 'OVER_LOST', 'OVER_WON'
  // level
  currentLevel: GameLevel;
  currentLevelScoreGoal = LEVEL_SCORE_TO_COMPLETE;
  currentLevelTimerBonusGoal = LEVEL_TIMER_BONUS_GOAL;
  currentLevelTimerValue: number = 0;
  currentLevelRightAnswersCount = 0;
  currentQuestion: CityQuiz;
  currentQuestionIndex: number = 0;
  // config
  locale: string = 'fr'; // for now only french supported

  answerModel: string; // TODO set a real city search input
  answerStatus: string = 'NA'; //'NA', 'CORRECT', 'WRONG'
  answerRevealed: boolean = false;

  score: number = 0;

  timer: any;
  timerValueSeconds: number = 0;

  constructor(public gameService: GameService) {
    this.game = this.gameService.loadGame();
    this.startGame();
  }

  onNextQuestion() {
    if (this.answerStatus == 'NA') {
      // you need to try to answer before going to next question
      return;
    }
    this.resetAnswer();
    if (this.currentLevelRightAnswersCount == this.currentLevelScoreGoal) {
      // current level is completed
      this.setCurrentLevelCompleted();
    } else if (this.currentQuestionIndex < this.currentLevel.questions.length - 1) {
      // next question
      this.currentQuestionIndex++;
      this.currentQuestion = this.currentLevel.questions[this.currentQuestionIndex];
    } else {
      // game over
      this.endGame(false);
    }
  }

  onNextLevel() {
    if (!this.currentLevel.completed) {
      return;
    }
    const currentLevelIndex = this.currentLevel.level - 1;
    if (currentLevelIndex < this.game.levels.length - 1) {
      const nextLevel = this.game.levels[currentLevelIndex + 1];
      this.setCurrentLevel(nextLevel);
      this.resumeTimer();
    } else {
      this.endGame(true);
    }
  }

  onRevealAnswer() {
    this.answerRevealed = true;
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
  }

  onKeyEnter() {
    if (this.answerStatus == 'CORRECT') {
      this.onNextQuestion()
    } else {
      this.onSubmitAnswer()
    }
  }

  onRestartGame() {
    this.startGame();
  }

  private startGame() {
    this.gameStatus = 'PLAYING';
    if (this.game.levels.length > 0) {
      // set first level
      const firstLevel = this.game.levels[0];
      this.setCurrentLevel(firstLevel)
    }
    this.score = 0;
    this.startTimer();
    this.resetAnswer();
  }

  private endGame(success: boolean = false) {
    this.gameStatus = success ? 'OVER_WON' : 'OVER_LOST';
    this.stopTimer();
  }

  private setCurrentLevel(level: GameLevel) {
    this.currentLevel = level;
    this.currentLevel.shuffleQuestions();
    this.currentLevel.completed = false;
    this.currentLevelRightAnswersCount = 0;
    this.currentLevelTimerValue = 0;
    this.currentQuestionIndex = 0;
    this.currentQuestion = this.currentLevel.questions[0];
  }

  private setCurrentLevelCompleted() {
    this.currentLevel.completed = true;
    this.setCurrentLevelBonusScore();
    if (this.hasNextLevel()) {
      this.stopTimer(); // stop timer before moving to next level
    } else {
      this.endGame(true); // no next level, game is finished
    }
  }

  private setCurrentLevelBonusScore() {
    if (this.currentLevel.completed) {
      if (this.currentLevelTimerValue <= this.currentLevelTimerBonusGoal) {
        // time bonus point
        this.score++;
      }
      if ((this.currentQuestionIndex + 1) == this.currentLevelScoreGoal) {
        // all questions have been successfully replied
        this.score++;
      }
    }
  }

  private hasNextLevel() {
    return this.currentLevel && this.currentLevel.level < this.game.levels.length;
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
    this.answerRevealed = false;
  }

  private startTimer() {
    this.timerValueSeconds = 0;
    this.resumeTimer();
  }

  private resumeTimer() {
    this.timer = setInterval(() => {
      this.timerValueSeconds++;
      this.currentLevelTimerValue++;
      if (this.timerValueSeconds >= 3600) { // limit: 1h, just to stop the game
        this.endGame(false);
      }
    }, 1000)
  }

  private stopTimer() {
    clearInterval(this.timer)
  }

}
