import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';

import { QuizService } from './quiz.service';
import { QuizState } from './quiz.interface';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  timer = '15';
  quizState$: Observable<QuizState>;
  resultState$: Observable<any>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService
  ) { }

  ngOnInit() {
    const quizId = this.activatedRoute.snapshot.params['id'];
    this.quizState$ = this.quizService.quizState$;

    // setting initial quiz state
    this.quizService.getQuiz(quizId)
      .pipe(take(1))
      .subscribe((res) => {
        this.quizService.quizState$.next({
          quiz_id: quizId,
          quizName: res.name,
          currentRound: 1,
          totalRounds: res.questions.length,
          progress: (1 / res.questions.length) * 100,
          mappings: [],
          questions: res.questions,
          currentQuestion: res.questions[0],
          quizEndedShowResult: false
        });
    });

    // timer logic
    this.quizService.quizState$.pipe(
      switchMap(_ => {
        return interval(1000);
      }),
      takeUntil(this.quizService.resultState$)
    ).subscribe(time => {
      const timeRemaining = 15 - time;
      this.timer = timeRemaining > 9 ? String(timeRemaining) : '0' + String(timeRemaining);
      console.log(timeRemaining);
      if (timeRemaining === 0) {
        this.showNextQuestion();
      }
    });
  }

  onAnswerSelected(quizOption) {
    const currentQuizState = JSON.parse(JSON.stringify(this.quizService.quizState$.getValue()));

    const nextRound = currentQuizState.currentRound + 1;
    const totalRounds = currentQuizState.totalRounds;

    if (nextRound > totalRounds) {
      const newQuestionState = {
        ...currentQuizState,
        currentQuestion: null,
        mappings: [
          ...currentQuizState.mappings,
          {
            ques_id: currentQuizState.currentQuestion.id,
            submitted_option: quizOption
          }
        ],
        quizEndedShowResult: true
      };

      console.log(newQuestionState);
      // updating quiz state to quiz ended
      this.quizService.quizState$.next(newQuestionState);
      // fetching result state
      this.quizService.resultState$.next();
      this.resultState$ = this.quizService.getQuizScore(newQuestionState).pipe(take(1));
    } else {
      const newQuestionState = {
        ...currentQuizState,
        currentRound: nextRound,
        progress: (nextRound / totalRounds) * 100,
        currentQuestion: currentQuizState.questions[nextRound - 1],
        mappings: [
          ...currentQuizState.mappings,
          {
            ques_id: currentQuizState.currentQuestion.id,
            submitted_option: quizOption
          }
        ]
      };

      console.log(newQuestionState);
      // updating quiz state
      this.quizService.quizState$.next(newQuestionState);
    }
  }

  showNextQuestion() {
    const currentQuizState = JSON.parse(JSON.stringify(this.quizService.quizState$.getValue()));

    const nextRound = currentQuizState.currentRound + 1;
    const totalRounds = currentQuizState.totalRounds;

    if (nextRound > totalRounds) {
      const newQuestionState = {
        ...currentQuizState,
        currentQuestion: null,
        quizEndedShowResult: true
      };

      console.log(newQuestionState);
      // updating quiz state to quiz ended
      this.quizService.quizState$.next(newQuestionState);
      // fetching result state
      this.quizService.resultState$.next();
      this.resultState$ = this.quizService.getQuizScore(newQuestionState).pipe(take(1));
    } else {
      const newQuestionState = {
        ...currentQuizState,
        currentRound: nextRound,
        progress: (nextRound / totalRounds) * 100,
        currentQuestion: currentQuizState.questions[nextRound - 1]
      };

      console.log(newQuestionState);
      // updating quiz state
      this.quizService.quizState$.next(newQuestionState);
    }
  }
}
