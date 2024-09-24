import React, { useState, useRef, useEffect, SyntheticEvent } from 'react';

interface Tag {
  tag: string;
  id: string;
}

const suggestedTags = ["React", "Typescript", "Tailwind", "JavaScript", "CSS"];

const DynamicInput = () => {

  const divRef = useRef<HTMLDivElement>(null);
  const [tags, setTags] = useState<Tag[]>([]);

  const removeTagById = (id: string) => {
    const updatedTags = tags.filter((tag: Tag) => tag.id !== id);
    setTags(updatedTags);

    const spanToRemove = divRef.current?.querySelector(`span[data-id='${id}']`);
    if (spanToRemove) {
      spanToRemove.remove();
    }

    setTimeout(() => {
      divRef.current?.focus(); 
    }, 0);
  };

  const handleButtonClick = (tag: string) => () => {
    const selection = window.getSelection();

    if (divRef.current && selection &&  !divRef.current.contains(selection.anchorNode)) {
      divRef.current.focus();
    }

    const newTag = { tag, id: String(Date.now()) };

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Создаем span для тэга
      const tagNode = document.createElement("span");
      tagNode.contentEditable = 'false';
      tagNode.className = "inline-flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm mr-1";
      tagNode.dataset.id = newTag.id;
      tagNode.innerHTML = `${tag} <button class="ml-2 text-gray-600 hover:text-gray-900" data-id="${newTag.id}">&times;</button>`;

      range.deleteContents(); 
      range.insertNode(tagNode); 

      // Обновляем состояние с новым тэгом
      setTags((prevTags) => [...prevTags, newTag]);

      // Восстанавливаем фокус на div
      setTimeout(() => {
        divRef.current?.focus(); 

        const newRange = document.createRange();
        const newSelection = window.getSelection();
        newRange.setStartAfter(tagNode); 
        newRange.collapse(true); 
        
        if(newSelection) {
          newSelection.removeAllRanges();
          newSelection.addRange(newRange);
        }
      }, 0);
    }
  };

  const handleDeleteTag = (e: SyntheticEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' && target.dataset.id) {
      removeTagById(target.dataset.id);
    }
  };
            
  useEffect(() => {
    if (divRef.current && tags.length === 0) {
      divRef.current.focus();
    }
  }, [tags]);

  return (
    <div className="max-w-md mx-auto mt-10">
        <div
          ref={divRef}
          role="textbox"
          aria-multiline="true"
          contentEditable="true"
          className="border p-2 min-h-[40px] outline-none"
          suppressContentEditableWarning={true}
          onClick={handleDeleteTag}
        >
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestedTags.map((tag, index) => (
            <button
              key={`${tag}-${index}`}
              className="bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200"
              onClick={handleButtonClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
    </div>
  );
};

export default DynamicInput;