import { VStack } from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import IAISelect from 'common/components/IAISelect';
import IAISlider from 'common/components/IAISlider';
import { canvasSelector } from 'features/canvas/store/canvasSelectors';
import {
  setBoundingBoxScaleMethod,
  setScaledBoundingBoxDimensions,
} from 'features/canvas/store/canvasSlice';
import {
  BoundingBoxScale,
  BOUNDING_BOX_SCALES_DICT,
} from 'features/canvas/store/canvasTypes';
import { generationSelector } from 'features/parameters/store/generationSelectors';
import {
  setInfillMethod,
  setTileSize,
} from 'features/parameters/store/generationSlice';
import { systemSelector } from 'features/system/store/systemSelectors';
import { isEqual } from 'lodash-es';

import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

const selector = createSelector(
  [generationSelector, systemSelector, canvasSelector],
  (parameters, system, canvas) => {
    const { tileSize, infillMethod } = parameters;

    const { infillMethods } = system;

    const {
      boundingBoxScaleMethod: boundingBoxScale,
      scaledBoundingBoxDimensions,
    } = canvas;

    return {
      boundingBoxScale,
      scaledBoundingBoxDimensions,
      tileSize,
      infillMethod,
      infillMethods,
      isManual: boundingBoxScale === 'manual',
    };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: isEqual,
    },
  }
);

const InfillAndScalingSettings = () => {
  const dispatch = useAppDispatch();
  const {
    tileSize,
    infillMethod,
    infillMethods,
    boundingBoxScale,
    isManual,
    scaledBoundingBoxDimensions,
  } = useAppSelector(selector);

  const { t } = useTranslation();

  const handleChangeScaledWidth = (v: number) => {
    dispatch(
      setScaledBoundingBoxDimensions({
        ...scaledBoundingBoxDimensions,
        width: Math.floor(v),
      })
    );
  };

  const handleChangeScaledHeight = (v: number) => {
    dispatch(
      setScaledBoundingBoxDimensions({
        ...scaledBoundingBoxDimensions,
        height: Math.floor(v),
      })
    );
  };

  const handleResetScaledWidth = () => {
    dispatch(
      setScaledBoundingBoxDimensions({
        ...scaledBoundingBoxDimensions,
        width: Math.floor(512),
      })
    );
  };

  const handleResetScaledHeight = () => {
    dispatch(
      setScaledBoundingBoxDimensions({
        ...scaledBoundingBoxDimensions,
        height: Math.floor(512),
      })
    );
  };

  const handleChangeBoundingBoxScaleMethod = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(setBoundingBoxScaleMethod(e.target.value as BoundingBoxScale));
  };

  return (
    <VStack gap={2} alignItems="stretch">
      <IAISelect
        label={t('parameters.scaleBeforeProcessing')}
        validValues={BOUNDING_BOX_SCALES_DICT}
        value={boundingBoxScale}
        onChange={handleChangeBoundingBoxScaleMethod}
      />
      <IAISlider
        isDisabled={!isManual}
        label={t('parameters.scaledWidth')}
        min={64}
        max={1024}
        step={64}
        value={scaledBoundingBoxDimensions.width}
        onChange={handleChangeScaledWidth}
        sliderNumberInputProps={{ max: 4096 }}
        withSliderMarks
        withInput
        inputReadOnly
        withReset
        handleReset={handleResetScaledWidth}
      />
      <IAISlider
        isDisabled={!isManual}
        label={t('parameters.scaledHeight')}
        min={64}
        max={1024}
        step={64}
        value={scaledBoundingBoxDimensions.height}
        onChange={handleChangeScaledHeight}
        sliderNumberInputProps={{ max: 4096 }}
        withSliderMarks
        withInput
        inputReadOnly
        withReset
        handleReset={handleResetScaledHeight}
      />
      <IAISelect
        label={t('parameters.infillMethod')}
        value={infillMethod}
        validValues={infillMethods}
        onChange={(e) => dispatch(setInfillMethod(e.target.value))}
      />
      <IAISlider
        isDisabled={infillMethod !== 'tile'}
        label={t('parameters.tileSize')}
        min={16}
        max={64}
        sliderNumberInputProps={{ max: 256 }}
        value={tileSize}
        onChange={(v) => {
          dispatch(setTileSize(v));
        }}
        withInput
        withSliderMarks
        withReset
        handleReset={() => {
          dispatch(setTileSize(32));
        }}
      />
    </VStack>
  );
};

export default InfillAndScalingSettings;
