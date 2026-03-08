import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CursorPhysics = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [cursorText, setCursorText] = useState("");

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for cursor movement
    const smoothX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 });
    const smoothY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 });

    // Secondary trailing dot spring (softer/lagging)
    const trailX = useSpring(mouseX, { damping: 40, stiffness: 150, mass: 1 });
    const trailY = useSpring(mouseY, { damping: 40, stiffness: 150, mass: 1 });

    useEffect(() => {
        // Hide default cursor across the entire page (we'll also do this in CSS, but this covers react mounts)
        document.body.style.cursor = 'none';

        const manageMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if we're hovering a clickable element or an element requesting magnetic hover
            if (
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') || target.closest('button') ||
                target.dataset.magnetic === "true"
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", manageMouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            document.body.style.cursor = 'auto'; // restore on unmount
            window.removeEventListener("mousemove", manageMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [mouseX, mouseY]);

    return (
        <>
            {/* Primary responsive dot */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full z-[100] pointer-events-none mix-blend-difference"
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovering ? 2 : 1,
                    opacity: isHovering ? 0 : 1
                }}
                transition={{ duration: 0.2 }}
            />

            {/* Trailing larger ring that expands on hover */}
            <motion.div
                className="fixed top-0 left-0 border border-primary/50 rounded-full z-[99] pointer-events-none backdrop-blur-[2px] flex items-center justify-center text-[10px] text-white font-medium"
                style={{
                    x: trailX,
                    y: trailY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: isHovering ? "80px" : "40px",
                    height: isHovering ? "80px" : "40px",
                    backgroundColor: isHovering ? "rgba(139, 92, 246, 0.1)" : "transparent",
                    borderColor: isHovering ? "rgba(139, 92, 246, 0.8)" : "rgba(139, 92, 246, 0.5)",
                }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
            >
                <motion.span
                    animate={{ opacity: isHovering ? 1 : 0 }}
                    className="tracking-widest"
                >
                    {isHovering ? "CLICK" : ""}
                </motion.span>
            </motion.div>
        </>
    );
};

export default CursorPhysics;
