"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
    noteId: number;
};

const DeleteButton = ({ noteId }: Props) => {
    const router = useRouter();

    const [isClick, setIsClick] = useState(false)

    const deleteNote = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/deleteNote", {
                noteId,
            });

            return response.data;
        },
    });

    return (
        <Button
            variant={"destructive"}
            size={"sm"}
            disabled={isClick}
            onClick={() => {
                const confirm = window.confirm(
                    "Are you sure you want to delete this note?"
                );
                if (!confirm) return;

                setIsClick(confirm)

                deleteNote.mutate(undefined, {
                    onSuccess: () => {
                        router.push("/dashboard");
                    },
                    onError: (err) => {
                        console.error(err);
                    },
                });
            }}
        >
            <Trash />
        </Button>
    );
};

export default DeleteButton;
