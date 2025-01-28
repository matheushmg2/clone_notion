// /api/createNoteBook

import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { unsplashGeneration } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("unauthorised", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    const image_url = await unsplashGeneration(name);

    if (!image_url) {
        return new NextResponse("failed to generate image description", {
            status: 500,
        });
    }

    const note_ids = await db
        .insert($notes)
        .values({
            name,
            userId,
            imageUrl: image_url,
        })
        .returning({
            insertedId: $notes.id,
        });

    return NextResponse.json({
        note_id: note_ids[0].insertedId,
    });
}
