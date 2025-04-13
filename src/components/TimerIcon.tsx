import React from 'react';

export const TimerIcon = (svgProps: React.SVGAttributes<any>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svgProps}
  >
    <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#8E97AB"></path>
    <path d="M17 14L16 15.7321L11 13L11.8038 11L17 14Z" fill="#8E97AB"></path>
    <rect x="11" y="11" width="2" height="2" fill="#8E97AB"></rect>
    <rect className="path" x="11" y="6" width="2" height="7" fill="#8E97AB"></rect>
  </svg>
);