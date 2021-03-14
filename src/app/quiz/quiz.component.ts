import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { QuizService } from './quiz.service';
import { QuizQuestion, QuizState } from './quiz-interface';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  quizState$: Observable<QuizState>;
  quizQuestion$: Observable<QuizQuestion>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService
  ) { }

  ngOnInit() {
    const quizId = this.activatedRoute.snapshot.params['id'];
    this.quizState$ = this.quizService.quizState$;

    this.quizQuestion$ = this.quizService.getQuiz(quizId).pipe(take(1));

    // setting initial quiz state
    this.quizQuestion$.subscribe((res) => {
      this.quizService.quizState$.next({
        quiz_id: quizId,
        currentRound: 1,
        totalRounds: res.questions.length,
        progress: (1 / res.questions.length) * 100,
        answerStatus: []
      });
    });
  }

  onAnswerSelected(quizOption, questionIndex) {
    console.log(quizOption, questionIndex);
    // {
    //   "quiz_id": "1",
    //   "mappings": [{
    //       "ques_id": 1,
    //       "submitted_option": "Rice"
    //     },
    //     {
    //       "ques_id": 2,
    //       "submitted_option": "NZ"
    //     }
    //   ]
    // }
  }
}
