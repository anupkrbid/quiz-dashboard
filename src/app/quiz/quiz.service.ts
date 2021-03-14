import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { QuizTopic } from './quiz-interface';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private httpClient: HttpClient) { }

  getQuiz() {
    // const apiUrl = environment.apiUrl + '/api/quiz/all';
    const apiUrl = 'http://54.221.109.49:4060/api/quiz/all';
    return this.httpClient.get<QuizTopic[]>(apiUrl);
  }
}
