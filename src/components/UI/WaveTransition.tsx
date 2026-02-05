import React from 'react';

const WaveTransition: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 z-10 pointer-events-none">
      <svg
        className="relative block w-[calc(100%+1.3px)] h-20 md:h-37.5"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        {/* Jagged, asymmetrical ocean wave path */}
        <path
          d="M0,0V50c0,0,140,40,240,20s160-50,280-30s200,60,320,40s180-50,260-20s100,30,100,30V0H0Z"
          className="fill-white"
        ></path>
      </svg>
    </div>
  );
};

export default WaveTransition;