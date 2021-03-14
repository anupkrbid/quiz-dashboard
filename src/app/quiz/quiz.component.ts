import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { QuizService } from './quiz.service';
import { QuizState } from './quiz-interface';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

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
  }

  onAnswerSelected(quizOption) {
    console.log(quizOption);
    console.log(this.quizService.quizState$.getValue());
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
}
