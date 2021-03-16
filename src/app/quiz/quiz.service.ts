import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Subject } from 'rxjs';

import { environment } from './../../environments/environment';
import { QuizTopic, QuizState, QuizQuestion } from './quiz.interface';

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
  resultState$ = new Subject<any>();
  constructor(private httpClient: HttpClient) { }

  getApiUrl() {
    return environment.apiUrl;
  }

  getQuizList() {
    const apiUrl = `${this.getApiUrl()}/api/quiz/all`;
    return this.httpClient.get<QuizTopic[]>(apiUrl);
  }

  getQuiz(id: string) {
    const apiUrl =  `${this.getApiUrl()}/api/quiz-questions/all/${id}`;
    return this.httpClient.get<QuizQuestion>(apiUrl);
  }

  getQuizScore({ quiz_id, mappings, questions }: any) {
    const apiUrl =  `${this.getApiUrl()}/api/user/quiz-score`;
    return this.httpClient.post(apiUrl, { quiz_id, mappings })
      .pipe(map((res: any) => {
        const questionMap = new Map();
        for (let question of questions) {
            questionMap.set(question.id, question.name)
        }
        res.questions = res.questions.map(question => {
            return {
                ...question,
                question: questionMap.get(question.ques_id)
            }
        })
        return res;
      }));
  }
}
