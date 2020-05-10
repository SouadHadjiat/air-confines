import { Component } from '@angular/core';
import { CityQuiz } from './city-quiz.model';
import { Game, GameLevel, GameResult, LEVEL_SCORE_TO_COMPLETE, LEVEL_TIMER_BONUS_GOAL } from './game.model';
import { GameService } from './game.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {

  game: Game;
  gameStatus: string = 'PLAYING'; // 'PLAYING', 'OVER_LOST', 'OVER_WON'
  gameBestResult: GameResult;
  gameHasNewBestResult: boolean = false;
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

  // share
  windowNavigator: any = window.navigator;
  shareData: {title: string, text: string, url: string};

  constructor(public gameService: GameService) {
    this.game = this.gameService.loadGame();
    this.gameBestResult = this.gameService.loadGameBestResult();
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
    if (!this.answerModel || this.answerStatus == 'CORRECT' || this.answerRevealed) {
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

  onShareScore() {
    if (this.windowNavigator.share) {
      this.windowNavigator.share({
        title: this.shareData.title,
        text: this.shareData.text,
        url: this.shareData.url
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch(console.error);
    } else {
      console.log('web api share not supported');
    }
  }

  onCopyShareText() {
    const copyInput = document.createElement("textarea");
    copyInput.value = this.shareData.text + " " + this.shareData.url;
    document.body.appendChild(copyInput);
    copyInput.focus();
    copyInput.select();
    document.execCommand('copy');
    document.body.removeChild(copyInput);
  }

  /******** game *********/

  private startGame() {
    this.gameStatus = 'PLAYING';
    if (this.game.levels.length > 0) {
      // set first level
      const firstLevel = this.game.levels[0];
      this.setCurrentLevel(firstLevel)
    }
    this.score = 0;
    this.gameHasNewBestResult = false;
    this.startTimer();
    this.resetAnswer();
  }

  private endGame(success: boolean = false) {
    this.stopTimer();
    this.gameStatus = success ? 'OVER_WON' : 'OVER_LOST';
    this.buildShareData();
    // save best game result
    this.saveBestGameResult();
  }

  private saveBestGameResult() {
    // save best game result
    if (this.hasNewBestResult()) {
      this.gameBestResult = this.gameService.saveGameBestResult(
        new GameResult({
          level: this.currentLevel.level,
          score: this.score,
          time: this.timerValueSeconds
        })
      );
      this.gameHasNewBestResult = true;
    }
    this.gameBestResult = this.gameService.saveGameBestResult(this.gameBestResult);
  }

  private hasNewBestResult() {
    return (this.score > this.gameBestResult.score // better score or better time for same score
      || (this.score == this.gameBestResult.score && this.timerValueSeconds < this.gameBestResult.time));
  }

  private buildShareData() {
    const shareText = "Mon score sur Air Confinés est de " + this.score + " points en " + this.timerValueSeconds + "s";
    const shareUrl = "https://airconfines.fr";
    this.shareData = {
      title: "Air Confinés",
      text: shareText,
      url: shareUrl
    }
  }

  /******** current level *********/

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

  /******** answer *********/

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

  /******** timer *********/

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
