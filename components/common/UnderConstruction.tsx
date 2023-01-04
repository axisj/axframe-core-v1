import * as React from "react";
import styled from "@emotion/styled";
import { SMixinFlexColumn } from "@core/styles/emotion";

function UnderConstruction() {
  return (
    <Container>
      <Cover>
        <svg viewBox='0 0 200 200' version='1.0'>
          <g transform='translate(-211.88 -270.59)'>
            <g stroke='#000'>
              <rect
                strokeLinejoin='round'
                ry='0'
                rx='0'
                transform='matrix(.70742 -.70679 .70679 .70742 0 0)'
                height='138.1'
                width='138.09'
                y='413.54'
                x='-110.35'
                strokeWidth='4.7022'
                fill='#ff0'
              />
              <g transform='matrix(.44444 0 0 .44444 156.05 236.16)'>
                <path
                  d='m323.64 396.82h134.93c-7.12-19.07-15.71-5.79-25.34-16.79-1.74-21.77-17.36-23.06-17.36-23.06-15.94-14.23-13.36-11.28-21.06-11.39-20.5-0.28-19.88 26.8-36.72 26.19-16.8-0.57-13.1 16.51-34.45 25.05z'
                  strokeWidth='1px'
                  fillRule='evenodd'
                />
                <path d='m253.9 386l11.11-48.1 1.28-41.06' strokeWidth='22' strokeLinecap='round' fill='none' />
                <path
                  d='m291.76 386l23.06-48.1-23.06-37.29-13.38-9.39'
                  strokeWidth='22'
                  strokeLinecap='round'
                  fill='none'
                />
                <path
                  d='m259.6 288.65l53.94-58.06s1.49-1.85 6.97-1.85l28.18 33.16-50.1 31.31-38.99-4.56z'
                  strokeWidth='1px'
                  fillRule='evenodd'
                />
                <path d='m315.25 232.51l-34.87 0.35-14.59 31.24' strokeWidth='14' strokeLinecap='round' fill='none' />
                <path d='m318.31 305.45l25.26-39.55' strokeWidth='14' strokeLinecap='round' fill='none' />
                <path d='m258.39 252.5l118.48 109.88v0' strokeWidth='6' strokeLinecap='round' fill='none' />
                <path
                  strokeLinejoin='round'
                  d='m385.7 216.35a17.079 17.079 0 1 1 -34.16 0 17.079 17.079 0 1 1 34.16 0z'
                  transform='translate(-14.517 11.671)'
                  strokeLinecap='round'
                  strokeWidth='6'
                />
              </g>
            </g>
          </g>
        </svg>
      </Cover>
      <h2>Under Construction</h2>
      <p>Sorry for the dust! We know it’s taking a while but sit tight and we’ll be with you soon.</p>
    </Container>
  );
}

const Container = styled.div`
  ${SMixinFlexColumn("center", "center")};
`;
const Cover = styled.div`
  min-width: 200px;
  min-height: 200px;
`;

export default UnderConstruction;
