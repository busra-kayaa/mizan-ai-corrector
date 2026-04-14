export type CorrectionType = 
  | 'typographic' 
  | 'punctuation' 
  | 'grammar' 
  | 'lexical' 
  | 'deascii' 
  | 'terminology'
  | string;

export interface Correction {
  original: string;
  corrected: string;
  type: CorrectionType;
  explanation: string;
}

export interface AnalysisResponse {
  originalText: string;  
  correctedText: string; 
  corrections: Correction[];
  
  metadata?: {
    regex_count?: number;
    neural_count?: number;
    error_count?: number;
    engine?: string;
    processing_time_ms?: number;
    char_count?: number;
  };

  score?: number;
  timestamp?: string;
  feedback?: 'up' | 'down' | null; 
}