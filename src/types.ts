export interface LCSHResponse {
  'Library of Congress Subject Headings': string[];
}

export interface APIError {
  message: string;
  status?: number;
}