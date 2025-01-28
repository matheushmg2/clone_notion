"use client";

import React, { FormEvent, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Close } from "@radix-ui/react-dialog";

const CreateNoteDialog = () => {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createNotebook = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/createNoteBook", {
                name: input,
            });
            return response.data;
        },
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (input === "") {
            window.alert("Prease enter a name for your notebook");
            return;
        }

        setIsLoading(true);

        createNotebook.mutate(undefined, {
            onSuccess: ({ note_id }) => {
                router.push(`/notebook/${note_id}`);
            },
            onError: (error) => {
                console.error(error);
                window.alert("Failed to create new notebook");
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger>
                <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
                    <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
                    <h2 className="font-semibold text-green-600 sm:mt-2">
                        New Note Book
                    </h2>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Note Book</DialogTitle>
                    <DialogDescription>
                        You can create a new note by clicking the button below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Name..."
                    />
                    <div className="h-4"></div>
                    <div className="flex items-center gap-2">
                        <Close type="reset" className="bg-secondary text-secondary-foreground hover:bg-slate-500/40 h-10 px-4 py-2 rounded-md text-sm font-medium">
                            Cancel
                        </Close>
                        <Button
                            type="submit"
                            className="bg-green-600"
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateNoteDialog;
