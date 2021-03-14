import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  quizId: string;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.quizId = this.activatedRoute.snapshot.params['id'];
  }

}
