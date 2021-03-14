import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { QuizTopic, QuizState, QuizQuestion } from './quiz-interface';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  quizState$ = new BehaviorSubject<QuizState>({
    quiz_id: null,
    currentRound: null,
    totalRounds: null,
    progress: 0,
    answerStatus: []
  });

  constructor(private httpClient: HttpClient) { }

  getQuizList() {
    // const apiUrl = `${environment.apiUrl}/api/quiz/all`;
    const apiUrl = 'http://54.221.109.49:4001/api/quiz/all';
    return this.httpClient.get<QuizTopic[]>(apiUrl);
  }

  getQuiz(id) {
    // const apiUrl =  `${environment.apiUrl}/api/quiz-questions/all/${id}`;
    const apiUrl = 'http://54.221.109.49:4001/api/quiz-questions/all/' + id;
    return this.httpClient.get<QuizQuestion>(apiUrl);
  }
}
