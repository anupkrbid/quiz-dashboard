import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { QuizService } from '../quiz/quiz.service';
import { QuizTopic } from '../quiz/quiz-interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  quizList$: Observable<QuizTopic[]>;
  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.quizList$ = this.quizService.getQuiz().pipe(take(1));
  }
}
