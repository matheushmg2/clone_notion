"use server";

import DeleteButton from "@/components/deleteButton";
import TipTapEditor from "@/components/tipTapEditor";
import { Button } from "@/components/ui/button";
import clerk from "@/lib/clerk-server";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";

type Props = {
    params: {
        noteId: string;
    };
};

const NotebookPage = async ({ params }: Props) => {
    const { userId } = await auth();
    const { noteId } = await params;

    if (!noteId) {
        notFound();
    }

    if (!userId) {
        return redirect("/sign-in");
    }

    const user = await clerk.users.getUser(userId);

    const { firstName, lastName, username } = user;

    const notes = await db
        .select()
        .from($notes)
        .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));

    if (notes.length !== 1) {
        return redirect("/dashboard");
    }

    const note = notes[0];

    return (
        <div className="min-h-screen grainy p-8">
            <div className="max-w-4xl mx-auto">
                <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
                    <Link href="/dashboard">
                        <Button className="bg-green-600" size="sm">
                            <ArrowLeft className="mr-1 w-4 h-4" />
                            Back
                        </Button>
                    </Link>
                    <div className="w-3" />
                    <span className="font-semibold">
                        {[firstName, lastName, username]
                            .filter(Boolean)
                            .join(" - ")}
                    </span>
                    <span className="inline-block mx-1">/</span>
                    <span className="text-stone-500 font-semibold">
                        {note.name}
                    </span>
                    <div className="w-3" />
                    <Image
                        src={note.imageUrl || ""}
                        width={35}
                        height={35}
                        alt={note.name}
                        className="w-[35px] h-[35px] rounded-full border-2 border-stone-500 p-[2px]"
                    />
                    <div className="ml-auto"><DeleteButton noteId={note.id} /></div>
                </div>
                <div className="h-4"></div>
                <div className="border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full">
                    <TipTapEditor note={note} />
                </div>
            </div>
        </div>
    );
};

export default NotebookPage;
