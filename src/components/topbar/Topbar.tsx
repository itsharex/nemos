import { useUIStore } from "@/store/ui/ui.store";
import { EllipsisVertical, Lock, Menu, PenLine } from "lucide-react";
import { Button } from "../ui/button/Button";
import { Filename } from "./filename/Filename";
import { write } from "@/utils/fs";
import { useParams } from "react-router";
import { useNoteStore } from "@/store/note/note.store";

// TODO:
// - Move readonly button

export const Topbar = () => {
  const toogleSidebar = useUIStore((store) => store.toggleSidebar);
  const { "*": splat } = useParams();

  const note = useNoteStore((state) => state.note);
  const setReadonly = useNoteStore((state) => state.setReadOnly);

  const onSetReadonly = async () => {
    if (!splat || !note) return;
    await write(splat, { ...note, readonly: !note.readonly });
    setReadonly(!note.readonly);
  };

  return (
    <div className="flex h-topbar items-center justify-between border-b border-border px-2.5 print:hidden">
      <Button onClick={() => toogleSidebar()}>
        <Menu className="h-4 w-4" />
      </Button>
      <Filename />
      <div className="flex gap-1">
        <Button onClick={onSetReadonly}>
          {note?.readonly ? (
            <Lock className="size-4" />
          ) : (
            <PenLine className="size-4" />
          )}
        </Button>
        <Button>
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
