import { QuizComponent } from './quiz.component';
import { GameService } from './game.service';

describe('QuizComponent', () => {
  let quizComponent: QuizComponent;

  beforeEach(() => {
    quizComponent = new QuizComponent(new GameService());
  });

  describe('load game in constructor', () => {

    it('should load game with all levels', () => {
      expect(quizComponent.game).toBeDefined();
      expect(quizComponent.game.levels.length).toEqual(3);
    });

    it('should start game', () => {
      // game
      expect(quizComponent.gameStatus).toEqual('PLAYING');
      // current level & question
      expect(quizComponent.currentLevel).toBeDefined();
      expect(quizComponent.currentLevel.level).toEqual(1);
      expect(quizComponent.currentLevel.completed).toBeFalsy();
      expect(quizComponent.currentLevelRightAnswersCount).toEqual(0);
      expect(quizComponent.currentLevelTimerValue).toEqual(0);
      expect(quizComponent.currentQuestionIndex).toEqual(0);
      expect(quizComponent.currentQuestion).toBeDefined();
      // score & timer
      expect(quizComponent.score).toEqual(0);
      expect(quizComponent.timerValueSeconds).toEqual(0);
      // answer
      expect(quizComponent.answerStatus).toEqual('NA');
      expect(quizComponent.answerModel).toEqual('');
      expect(quizComponent.answerRevealed).toBeFalsy();
    });

  });
});
