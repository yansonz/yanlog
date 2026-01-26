'use client';

import { QuestionTag } from '@/types/post';

interface QuestionTagsProps {
  questions: QuestionTag[];
}

export default function QuestionTags({ questions }: QuestionTagsProps) {
  if (!questions || questions.length === 0) return null;

  const handleClick = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {questions.map((q, index) => (
          <button
            key={index}
            onClick={() => handleClick(q.anchor)}
            className="px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            {q.text}
          </button>
        ))}
      </div>
    </div>
  );
}
