"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Menu,
    ArrowUpRight,
    Sparkles,
    Building,
    BookOpen,
} from "lucide-react";

export default function RootLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const navItems = [
        {
            label: "Grow",
            path: "/grow/dashboard",
            icon: <Sparkles className="w-4 h-4" />,
            angle: -10,
        },
        {
            label: "Build",
            path: "/build",
            icon: <Building className="w-4 h-4" />,
            angle: 30,
        },
        {
            label: "Learn",
            path: "/learn",
            icon: <BookOpen className="w-4 h-4" />,
            angle: 100,
        },
    ];

    const handleNavClick = (path) => {
        router.push(path);
        setIsOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-1500 to-primary-1300 text-white">
            {/* Floating SunRay Navigation */}
            <div className="fixed top-6 left-6 z-50">
                {/* Main Menu Button */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center group backdrop-blur-lg bg-white/10 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <Menu className="w-6 h-6 text-primary-200" />

                    {/* Pulsing glow ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-primary-500/30 blur-md"
                        animate={isOpen ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 2, repeat: isOpen ? Infinity : 0 }}
                    />
                </motion.button>

                {/* Navigation Items */}
                <AnimatePresence>
                    {isOpen &&
                        navItems.map((item, index) => {
                            const distance = 110;
                            const angleRad = (item.angle * Math.PI) / 180;
                            const x = Math.cos(angleRad) * distance;
                            const y = Math.sin(angleRad) * distance;

                            return (
                                <motion.div
                                    key={item.label}
                                    className="absolute top-1/2 left-1/2"
                                    initial={{ x: -28, y: -28, opacity: 0, scale: 0 }}
                                    animate={{ x: x - 28, y: y - 28, opacity: 1, scale: 1 }}
                                    exit={{ x: -28, y: -28, opacity: 0, scale: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.1,
                                        ease: "easeOut",
                                    }}
                                >
                                    <motion.button
                                        onClick={() => handleNavClick(item.path)}
                                        className={`relative flex items-center rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group overflow-hidden px-5 py-3 min-w-max 
    backdrop-blur-xl bg-white/10 border border-white/20`}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.96 }}
                                        transition={{ type: "spring", stiffness: 250, damping: 20 }}
                                    >
                                        {/* Hover glow */}
                                        <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />

                                        {/* Icon + Text */}
                                        <div className="relative z-10 flex items-center gap-2 text-primary-100">
                                            {item.icon}
                                            <span className="text-sm font-medium">{item.label}</span>
                                            <ArrowUpRight className="w-3 h-3 opacity-70" />
                                        </div>
                                    </motion.button>

                                </motion.div>
                            );
                        })}
                </AnimatePresence>

                {/* Background overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsOpen(false)}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Page Content */}
            <main className="">{children}</main>
        </div>
    );
}
