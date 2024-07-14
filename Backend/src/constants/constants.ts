export const APP_NAME = 'Odoo Hackthon' as const;
export const BLOCK_TYPE = [
  'TEXT_BLOCK',
  'TEXT_QUESTION',
  'MULTI_CHOICE',
  'RATING',
] as const;
export const ANSWER_TYPE = ['RADIO', 'CHECKBOX'] as const;
export const SURVEY_STATUS = ['CLOSED', 'OPEN', 'NOT_LAUNCHED'] as const;
export const FEEDBACK_VISIBILITY = ['PUBLIC', 'EMPLOYEE'] as const;
export const TASK_STATUS = ['PENDING', 'COMPLETED'] as const;
export interface DefaultEventPayload {
  identifier: string;
  payload: any;
}
