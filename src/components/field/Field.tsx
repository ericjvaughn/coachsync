import React from 'react';
import { Group, Image, Line } from 'react-konva';
import useImage from 'use-image';
import fieldSvg from '../../assets/field.svg';
import { PlayerLayer } from './PlayerLayer';
import { RouteLayer } from './RouteLayer';

// LOS position at 65.8% from top of field
export const LOS_Y_POSITION = 0.658;

interface FieldProps {
  width: number;
  height: number;
}

export function Field({ width, height }: FieldProps) {
  const [image] = useImage(fieldSvg);
  const losY = height * LOS_Y_POSITION;

  return (
    <Group>
      <Image
        image={image}
        width={width}
        height={height}
      />
      {/* Line of Scrimmage */}
      <Line
        points={[0, losY, width, losY]}
        stroke="#FF0000" // Bright red color
        strokeWidth={1.5}
        opacity={1}
      />
      <PlayerLayer width={width} height={height} />
      <RouteLayer width={width} height={height} />      
    </Group>
  );
}
