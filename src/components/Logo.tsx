import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface LogoProps {
  style?: React.CSSProperties;
}

export const Logo = ({ style }: LogoProps) => {
  return (
    <MotionBox
      position="relative"
      width="40px"
      height="40px"
      initial={{ scale: 0.95, rotate: 0 }}
      animate={{
        scale: [0.95, 1.05, 0.95],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      {...(style && { style })}
    >
      {/* Keycap shadow */}
      <Box
        position="absolute"
        bottom="-2px"
        left="50%"
        transform="translateX(-50%)"
        width="32px"
        height="4px"
        bg="rgba(0, 0, 0, 0.3)"
        borderRadius="full"
        filter="blur(4px)"
      />

      {/* Keycap base */}
      <Box
        position="absolute"
        bottom="2px"
        left="4px"
        width="32px"
        height="36px"
        bg="rgba(255, 255, 255, 0.1)"
        borderRadius="6px"
        transform="perspective(100px) rotateX(30deg)"
        border="1px solid rgba(255, 255, 255, 0.2)"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
      />

      {/* Keycap top */}
      <Box
        position="absolute"
        top="2px"
        left="4px"
        width="32px"
        height="32px"
        bg="rgba(255, 255, 255, 0.15)"
        borderRadius="6px"
        transform="perspective(100px) rotateX(30deg)"
        border="1px solid rgba(255, 255, 255, 0.3)"
        boxShadow="0 0 20px rgba(255, 255, 255, 0.1)"
        _before={{
          content: '""',
          position: "absolute",
          top: "4px",
          left: "4px",
          right: "4px",
          bottom: "4px",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)",
          borderRadius: "4px",
          filter: "blur(2px)",
        }}
        _after={{
          content: '"T"',
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotateX(-30deg)",
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: "16px",
          fontWeight: "bold",
          textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
        }}
      />
    </MotionBox>
  );
};
