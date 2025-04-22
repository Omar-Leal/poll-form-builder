
export interface PollOption {
    id: string;
    text: string;
  }
  
  export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
 
    responses: Record<string, number>;
  }
  

  export type QuestionType = 'short-answer' | 'long-answer' | 'number' | 'radio';
  
  export interface FormQuestion {
    id: string;
    type: QuestionType;
    text: string;
    options?: string[]; 
    required?: boolean; 
    placeholder?: string; 
  }
  
  export interface Form {
    id: string;
    title: string;
    questions: FormQuestion[];
  }
  
  // Stores answers for a single submission: { questionId: answer }
  export type FormAnswers = Record<string, string | number | null>;
  
  export interface FormResponse {
    id: string; //  ID for every single form submission ...
    formId: string;
    submittedAt: Date;
    answers: FormAnswers;
  }