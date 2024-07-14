import {
  ANSWER_TYPE,
  BLOCK_TYPE,
  FEEDBACK_VISIBILITY,
  SURVEY_STATUS,
  TASK_STATUS,
} from './constants';

export type BlockType = (typeof BLOCK_TYPE)[number];
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type AnswerType = (typeof ANSWER_TYPE)[number];
export type SurveyStatus = (typeof SURVEY_STATUS)[number];
export type FeedbackVisibility = (typeof FEEDBACK_VISIBILITY)[number];
export type TaskStatus = (typeof TASK_STATUS)[number];

export enum OAuthProvidersEnum {
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
  LOCAL = 'local',
}

export function getKeyByValueOAuthProviders(
  value: string,
): keyof typeof OAuthProvidersEnum | undefined {
  return Object.keys(OAuthProvidersEnum).find(
    (key) => OAuthProvidersEnum[key] === value,
  ) as keyof typeof OAuthProvidersEnum | undefined;
}
