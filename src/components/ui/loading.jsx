import { motion } from "framer-motion";

function Loading() {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="h-12 flex items-center justify-center">
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-gray-500"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}

export default Loading;
