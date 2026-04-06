export type {
  SlideType,
  GenerateRequest,
  GenerateResponse,
  Slide,
  SlideInstruction,
  Format,
  Category,
} from './types';

export { CATEGORIES } from './categories';
export { FORMATS } from './formats';
export { sanitizeInput, sanitizeHexColor } from './sanitize';
export type { AccountProfile, GoalType, ToneType } from './accountProfile';
export {
  GOAL_LABELS,
  TONE_LABELS,
  ACCOUNT_PROFILE_KEY,
  loadAccountProfile,
  saveAccountProfile,
} from './accountProfile';
export type { IndustryPattern } from './industryPatterns';
export { INDUSTRY_PATTERNS, matchIndustryPattern } from './industryPatterns';
