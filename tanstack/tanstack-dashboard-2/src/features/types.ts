/**
 * Shared feature types
 */

export type FeatureStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FeatureState<T> {
  data: T | null;
  status: FeatureStatus;
  error: string | null;
}
