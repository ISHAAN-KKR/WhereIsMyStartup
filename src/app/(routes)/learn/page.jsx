"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ImageHoverPage() {
  const router = useRouter();

  const cards = [
    {
      img: "/failed.jpeg",
      title: "Missteps to Mindsets",
      desc: "Every failure is a classroom. Here's what dreamers before you learned the hard way.",
      link: "/learn/f",
      gradient: "from-slate-900/90 via-slate-900/60 to-transparent",
      tint: "bg-blue-500/20",
    },
    {
      img: "/success.jpeg",
      title: "From Dreamer to Founder",
      desc: "Learn from the journeys of dreamers who made it happen.",
      link: "/learn/s",
      gradient: "from-slate-900/90 via-slate-900/60 to-transparent",
      tint: "bg-green-500/20",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 bg-slate-950 p-6">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.03 }}
          className="relative w-full md:w-[400px] h-[520px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
          onClick={() => router.push(card.link)}
        >
          {/* Background Image */}
          <Image
            src={card.img}
            alt={card.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Tint Overlay */}
          <div
            className={`absolute inset-0 ${card.tint} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          ></div>

          {/* Gradient for Text Contrast */}
          <div
            className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t ${card.gradient}`}
          ></div>

          {/* Text Content */}
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-bold mb-3 drop-shadow-lg"
            >
              {card.title}
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-base text-gray-200 leading-relaxed drop-shadow-md"
            >
              {card.desc}
            </motion.p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
