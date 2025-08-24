import React from 'react'

function Grid() {
  return (
    <>
      <div className="py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            
            {/* Card 1 */}
            <a
              href="#"
              className="group relative flex h-80 items-end overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg"
            >
              <img
                src="/anal.jpg"
                loading="lazy"
                alt="Photo by Fakurian Design"
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              />

              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              <div className="relative flex flex-col">
                <span className="text-gray-300">Analyze</span>
                <span className="text-lg font-semibold text-white lg:text-xl">
                  Your Industry
                </span>
              </div>
            </a>

            {/* Card 2 */}
            <a
              href="#"
              className="group relative flex h-80 items-end overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg"
            >
              <img
                src="/comp.jpg"
                loading="lazy"
                alt="Know Your Competitor"
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              />

              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              <div className="relative flex flex-col">
                <span className="text-gray-300">Know</span>
                <span className="text-lg font-semibold text-white lg:text-xl">
                  Your Competition
                </span>
              </div>
            </a>

          </div>
        </div>
      </div>
    </>
  )
}

export default Grid
