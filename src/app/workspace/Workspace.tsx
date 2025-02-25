import { useEffect, useState } from "react";
import { readNote, write } from "@/utils/fs";
import { useNavigate, useParams } from "react-router";
import { Editor } from "@/components/editor/Editor";
import { useNoteStore } from "@/store/note/note.store";

export const Workspace = () => {
  const { "*": splat } = useParams();
  const navigate = useNavigate();

  const note = useNoteStore((state) => state.note);
  const setNote = useNoteStore((state) => state.setNote);
  const updateContent = useNoteStore((state) => state.updateContent);
  const [content, setContent] = useState<string | undefined>(note?.content);

  const noFile = () => {
    setNote(null);
    navigate("/no-file", { replace: true });
  };

  useEffect(() => {
    readNote(splat!)
      .then((data) => {
        setNote(data);
        setContent(data.content);
      })
      .catch(noFile);
  }, [splat]);

  if (!splat) noFile();
  if (!note) return null;

  return (
    <div className="flex-1 overflow-auto px-8 pt-32">
      <div className="editor-wrapper mx-auto w-full max-w-2xl *:h-full">
        <Editor
          className="pb-[40vh] print:pb-3"
          content={content}
          readonly={note.readonly}
          onChange={async (editor) => {
            const content = editor.getHTML();
            updateContent(content);
            await write(splat!, {
              ...note,
              content,
            });
          }}
        />
      </div>
    </div>
  );
};
