export interface QuizTopic {
  id: number;
  name: string;
  description: string;
}

export interface QuizState {
  quiz_id: string,
  currentRound: number;
  totalRounds: number;
  progress: number;
  answerStatus:  Answer[];
}

interface Answer {
  ques_id: number,
  submitted_option: string
}

export interface QuizQuestion {
  name: string,
  description: number;
  questions:  Questions[];
}

interface Questions {
  id: number;
  name: string;
  options: string;
  quiz: number,
  points: number
}
