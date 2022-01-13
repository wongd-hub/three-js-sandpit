// Largely sourced from this sandbox: https://codesandbox.io/s/framer-motion-3d-shapes-button-ke8wx
import { motion } from "framer-motion/three";
import { MotionConfig, useSpring, useTransform } from "framer-motion";
import { useRef, useLayoutEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";

// Define smooth transition function and transition settings
function useSmoothTransform(value: any, springOptions: any, transformer: any) {
    return useSpring(useTransform(value, transformer), springOptions);
}

const transition = {
    type: "spring",
    duration: 0.7,
    bounce: 0.2
  };

export default function PlayButton(props: {}) {


    return (

            <motion.div
                // variants={{ hover: { scale: 0.85 }, press: { scale: 1.1 } }}
                className="label"
            >
            hover
            </motion.div>

    )

}