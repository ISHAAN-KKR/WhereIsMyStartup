import Navbar from "./Navbar";
import Reveal from './Reveal'
const Hero = () => {
    return (
        <>
            <Reveal>
            <section className="pt-20 lg:pt-32 bg-black bg-[url('https://pagedone.io/asset/uploads/1691055810.png')] bg-center bg-cover">
            <Navbar/>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
                    <h1 className="max-w-2xl mx-auto text-center font-manrope font-bold text-4xl text-gray-100 mb-5 md:text-5xl leading-[50px]">
                    Smart Financial Planning for 
                        <span className="text-lime-400"> Your Business</span>
                    </h1>
                    <p className="max-w-sm mx-auto text-center text-base font-normal leading-7 text-gray-300 mb-9">
                    Your business deserves financial clarity and control—we make it possible.
                    </p>
                    <a href="/Start" className="w-full md:w-auto mb-14 inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-white rounded-full bg-lime-600 shadow-xs hover:bg-lime-700 transition-all duration-500">
                        Get Started
                    </a>
                    <div className="flex justify-center">
                        <img src='/image.png' alt="Dashboard" className="rounded-t-3xl h-auto object-cover" />
                    </div>
                </div>
            </section>
            </Reveal>
        </>
    );
};

export default Hero;
