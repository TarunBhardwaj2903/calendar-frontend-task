"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface NoteEditorProps {
  onSave: (text: string) => void;
  primaryColor: string;
  placeholder?: string;
}

/**
 * Textarea + save button for creating a new note.
 * Uses a light tint of the active theme color for its background.
 * Ctrl/Cmd + Enter to save.
 */
export default function NoteEditor({
  onSave,
  primaryColor,
  placeholder = "Write a note...",
}: NoteEditorProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        rows={2}
        className="flex-1 resize-none rounded-lg border px-3 py-2 text-sm
                   focus:outline-none transition-all duration-200"
        style={{
          backgroundColor: isFocused ? `${primaryColor}08` : `${primaryColor}06`,
          borderColor: isFocused ? `${primaryColor}50` : `${primaryColor}25`,
          boxShadow: isFocused ? `0 0 0 3px ${primaryColor}15` : "none",
        }}
      />
      <motion.button
        onClick={handleSave}
        disabled={!text.trim()}
        whileHover={{ scale: text.trim() ? 1.05 : 1 }}
        whileTap={{ scale: text.trim() ? 0.92 : 1 }}
        className="flex items-center justify-center w-9 h-9 rounded-lg
                   text-white transition-all duration-200 shrink-0
                   disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        style={{
          backgroundColor: primaryColor,
          boxShadow: text.trim() ? `0 2px 8px ${primaryColor}40` : "none",
        }}
        aria-label="Add note"
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
