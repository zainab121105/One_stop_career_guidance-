import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Target, TrendingUp } from "lucide-react";

const RoadmapLoader = ({
  message = "Generating your personalized career roadmap...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-8">
      {/* Animated AI brain icon */}
      <motion.div
        className="relative mb-8"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
          <Brain className="w-12 h-12 text-white" />
        </div>

        {/* Floating particles */}
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{
            y: [-10, -20, -10],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0,
          }}
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </motion.div>

        <motion.div
          className="absolute -bottom-2 -left-2"
          animate={{
            y: [10, 20, 10],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
          }}
        >
          <Target className="w-5 h-5 text-green-400" />
        </motion.div>

        <motion.div
          className="absolute top-1/2 -right-8"
          animate={{
            x: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1,
          }}
        >
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </motion.div>
      </motion.div>

      {/* Loading message */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          AI is Working Its Magic
        </h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </motion.div>

      {/* Progress steps */}
      <div className="w-full max-w-md">
        <div className="space-y-3">
          {[
            { step: 1, text: "Analyzing your profile", delay: 0 },
            { step: 2, text: "Identifying career paths", delay: 1 },
            { step: 3, text: "Generating learning milestones", delay: 2 },
            { step: 4, text: "Creating personalized roadmap", delay: 3 },
          ].map(({ step, text, delay }) => (
            <motion.div
              key={step}
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay * 0.5 + 1 }}
            >
              <motion.div
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
                animate={{
                  scale: [1, 1.2, 1],
                  backgroundColor: ["#3B82F6", "#10B981", "#3B82F6"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: delay * 0.5,
                }}
              >
                {step}
              </motion.div>
              <span className="text-gray-700">{text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Loading bar */}
      <motion.div
        className="w-full max-w-md mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          This may take 15-30 seconds...
        </p>
      </motion.div>
    </div>
  );
};

export default RoadmapLoader;
