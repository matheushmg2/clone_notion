/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { NoteType } from "@/lib/db/schema";
import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Text from "@tiptap/extension-text";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./tipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Props = { note: NoteType };

const TipTapEditor = ({ note }: Props) => {
    const [editorState, setEditorState] = useState(
        note.editorState || `<h1>${note.name}</h1>`
    );

    const saveNote = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/saveNote", {
                noteId: note.id,
                editorState,
            });
            return response.data;
        },
    });

    const customText = Text.extend({
        addKeyboardShortcuts() {
            return {
                "Shift-a": () => {
                    const prompt = this.editor
                        .getText()
                        .split(" ")
                        .slice(-30)
                        .join(" ");
                    return true;
                },
            };
        },
    });

    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit, customText],
        content: editorState,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            setEditorState(editor.getHTML());
        },
    });

    const debouncedEditorState = useDebounce(editorState, 100);

    useEffect(() => {
        if (debouncedEditorState === "") return;
        saveNote.mutate(undefined, {
            onSuccess: (data) => {},
            onError: (err) => {
                console.error(err);
            },
        });
    }, [debouncedEditorState]);

    return (
        <>
            <div className="flex">
                {editor && <TipTapMenuBar editor={editor} />}
                <Button disabled variant={"outline"}>
                    {saveNote.status === "pending" ? "Saving..." : "Saved"}
                </Button>
            </div>
            <div className="prose">
                <EditorContent editor={editor} />
            </div>
        </>
    );
};

// Minuto 1:36:00

export default TipTapEditor;
