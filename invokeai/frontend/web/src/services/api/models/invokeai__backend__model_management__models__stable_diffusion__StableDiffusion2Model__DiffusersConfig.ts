/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ModelError } from './ModelError';
import type { ModelVariantType } from './ModelVariantType';
import type { SchedulerPredictionType } from './SchedulerPredictionType';

export type invokeai__backend__model_management__models__stable_diffusion__StableDiffusion2Model__DiffusersConfig = {
  path: string;
  description?: string;
  format: 'diffusers';
  default?: boolean;
  error?: ModelError;
  vae?: string;
  variant: ModelVariantType;
  prediction_type: SchedulerPredictionType;
  upcast_attention: boolean;
};

