"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ImageHoverPage() {
  const router = useRouter();

  const cards = [
    {
      img: "/failed.jpeg",
      title: "From Dreamer to Founder",
      desc: "Learn from the journeys of dreamers who made it happen.",
      link: "/page1",
    },
    {
      img: "/success.jpeg",
      title: "Missteps to Mindsets",
      desc: "Every failure is a classroom. Here's what dreamers before you learned the hard way",
      link: "/page2",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center gap-8 bg-slate-950 p-8">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.05 }}
          className="relative w-80 h-56 rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
          onClick={() => router.push(card.link)}
        >
          {/* Image */}
          <Image
            src={card.img}
            alt={card.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center text-center p-4">
            <h3 className="text-xl font-bold text-white">{card.title}</h3>
            <p className="text-sm text-gray-200 mt-2">{card.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
