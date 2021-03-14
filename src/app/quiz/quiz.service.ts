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
    quizName: null,
    currentRound: null,
    totalRounds: null,
    progress: 0,
    mappings: [],
    questions: [],
    currentQuestion: null,
    quizEndedShowResult: false
  });
  constructor(private httpClient: HttpClient) { }

  getQuizList() {
    // const apiUrl = `${environment.apiUrl}/api/quiz/all`;
    const apiUrl = 'http://54.221.109.49:4000/api/quiz/all';
    return this.httpClient.get<QuizTopic[]>(apiUrl);
  }

  getQuiz(id: string) {
    // const apiUrl =  `${environment.apiUrl}/api/quiz-questions/all/${id}`;
    const apiUrl = 'http://54.221.109.49:4000/api/quiz-questions/all/' + id;
    return this.httpClient.get<QuizQuestion>(apiUrl);
  }

  getQuizScore({ quiz_id, mappings, questions }: any) {
    // const apiUrl =  `${environment.apiUrl}/api/user/quiz-score`;
    const apiUrl = 'http://54.221.109.49:4000/api/user/quiz-score';
    return this.httpClient.post(apiUrl, { quiz_id, mappings });
  }
}
