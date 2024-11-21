import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");

  const addHabit = () => {
    if (habitName.trim()) {
      setHabits((prev) => [
        ...prev,
        { name: habitName, progress: Array(7).fill(false) },
      ]);
      setHabitName("");
    }
  };

  const toggleProgress = (habitIndex, dayIndex) => {
    const updatedHabits = [...habits];
    updatedHabits[habitIndex].progress[dayIndex] =
      !updatedHabits[habitIndex].progress[dayIndex];
    setHabits(updatedHabits);
  };

  const deleteHabit = (index) => {
    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white 
    rounded-lg shadow-xl max-w-lg mx-auto overflow-scroll">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Habit Tracker
      </h2>

      {/* Add Habit */}
      <div className="flex mb-6">
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Add a habit"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
        />
        <button
          onClick={addHabit}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-r-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 shadow-lg"
        >
          Add
        </button>
      </div>

      {/* Habit List with Framer Motion */}
      <div className="space-y-6">
        <AnimatePresence>
          {habits.map((habit, habitIndex) => (
            <motion.div
              key={habitIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 80 }}
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  {habit.name}
                </h3>
                <button
                  onClick={() => deleteHabit(habitIndex)}
                  className="text-red-500 text-sm font-medium hover:underline"
                >
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-7 gap-3">
                {habit.progress.map((done, dayIndex) => (
                  <motion.button
                    key={dayIndex}
                    onClick={() => toggleProgress(habitIndex, dayIndex)}
                    whileTap={{ scale: 0.9 }}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold text-sm transition-all duration-300 ${
                      done
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {["S", "M", "T", "W", "T", "F", "S"][dayIndex]}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HabitTracker;
