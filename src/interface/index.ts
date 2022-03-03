type typeQuestion = 'question' | 'error';
export interface ResponseQuestions {
    object: typeQuestion,
    message?: string,
    rows?: Question[]
}

export interface Question {
    id: number;
    question: string;
}

type typeAnswer = 'answer' | 'error';
export interface ResponseAnswers {
    object: typeAnswer,
    message: string,
    row: Answer
}

export interface Answer {
    questionId: number;
    answer: string;
}

export interface customEventTarget extends EventTarget {
    id: string;
}

export interface ConfigEnv {
    hostname: string;
    port: number;
}