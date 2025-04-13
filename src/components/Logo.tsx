import React from 'react';
import { ReactComponent as LogoSVG } from '../logo.svg';

export const Logo = (svgProps: React.SVGAttributes<any>) => (
  <LogoSVG
    {...svgProps}
  />
);

export const FlexCenteredLogo = (svgProps: React.SVGAttributes<any>) => (
  <LogoSVG
    style={{
      display: 'flex',
      margin: '0 auto'
    }}
    {...svgProps}
  />
);

