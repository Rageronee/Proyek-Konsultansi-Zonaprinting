import { motion } from "framer-motion";
import logo from "@/assets/Main_logo.png";
import { useEffect, useState } from "react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [exit, setExit] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExit(true);
            setTimeout(onComplete, 500); // Wait for exit animation
        }, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: exit ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 0.5
                }}
                className="relative flex flex-col items-center"
            >
                <img
                    src={logo}
                    alt="ZonaPrint Logo"
                    className="w-32 md:w-48 object-contain mb-8" // Adjusted size
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-1 bg-primary rounded-full w-32"
                />
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;
