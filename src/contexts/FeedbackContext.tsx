"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ModalFeedback from "@/components/Modal/Feedback";

interface FeedbackContextType {
  showFeedback: (text: string, isOpen: boolean) => void;
  hideFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined
);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<{
    text: string;
    isOpen: boolean;
  } | null>(null);

  const showFeedback = (text: string, isOpen: boolean) => {
    setFeedback({ text, isOpen });
  };

  const hideFeedback = () => {
    setFeedback(null);
  };

  return (
    <FeedbackContext.Provider value={{ showFeedback, hideFeedback }}>
      {children}
      {feedback && (
        <ModalFeedback text={feedback.text} isOpen={feedback.isOpen} />
      )}
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
