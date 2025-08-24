import React from 'react'

function Grid() {
  return (
    <>
    <div class=" py-6 sm:py-8 lg:py-12">
  <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
    <div class="grid gap-6 sm:grid-cols-2">
      {/* <!-- product - start --> */}
      <a href="#" class="group relative flex h-80 items-end overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg">
        <img src="/anal.jpg" loading="lazy" alt="Photo by Fakurian Design" class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

        <div class="relative flex flex-col">
          <span class="text-gray-300">Analyze</span>
          <span class="text-lg font-semibold text-white lg:text-xl">Your Industry</span>
        </div>
      </a>
      {/* <!-- product - end -->

      <!-- product - start --> */}
      <a href="#" class="group relative flex h-80 items-end overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg">
        <img src="/comp.jpg" loading="lazy" alt="Know Your COmpetitor" class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

        <div class="relative flex flex-col">
          <span class="text-gray-300">Know</span>
          <span class="text-lg font-semibold text-white lg:text-xl">Your Competition</span>
        </div>
      </a>
      {/* <!-- product - end --> */}
    </div>
  </div>
</div>
    </>
  )
}

export default Grid