import React, { useRef } from 'react'
import { useLoaderAnimation } from '../hooks/useLoaderAnimation';

const Loader = ({ setLoading }) => {

  const name = ['M', 'O', 'H', 'D', ' ', 'A', 'Y', 'A', 'N'];

  const loaderRef = useRef(null)
  useLoaderAnimation(loaderRef, setLoading)

  return (
    <div ref={loaderRef} className="w-screen h-screen fixed inset-0 flex z-50 overflow-hidden">

      {/* Left panel */}
      <div className="loader-left bg-[#d8d8d7] w-1/2 h-full"></div>

      {/* Right panel */}
      {/* Original */}
      {/* <div className="loader-right bg-[#1a0b00] w-1/2 h-full"></div> */}

      <div className="loader-right bg-[#241002] w-1/2 h-full"></div>
      {/* <div className="loader-right bg-[#70d2df] w-1/2 h-full"></div> */}

      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

        {/* Dark text — only left half */}
        <div className="absolute inset-0 overflow-hidden">
          <h1 className="absolute inset-0 flex items-center justify-center text-4xl md:text-6xl font-black text-[#1a0b00] whitespace-nowrap">
            {name.map((char, idx) => <span className='loader-letter' key={idx}>{char}</span>)}
          </h1>
        </div>

        {/* Cream text — only right half */}
        <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden">
          <h1 className="absolute top-0 right-0 w-screen h-full flex items-center justify-center text-4xl md:text-6xl font-black text-[#d8d8d7] whitespace-nowrap">
            {name.map((char, idx) => <span className='loader-letter' key={idx}>{char}</span>)}
          </h1>
        </div>

      </div>

    </div>
  )
}

export default Loader