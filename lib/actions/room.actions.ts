"use server";

import { RoomAccesses } from "@liveblocks/node";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { liveblocks } from "../liveblocks";
import { parseStringify } from "../utils";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"],
    });

    revalidatePath("/");
    return parseStringify(room);
  } catch (error) {
    console.log(`Error creating room: ${error}`);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    // if (!hasAccess) throw new Error("You do not have access to this document");

    return parseStringify(room);
  } catch (error) {
    console.log(`Error getting document: ${error}`);
  }
};

export const updateDocument = async ({
  roomId,
  newTitle,
}: {
  roomId: string;
  newTitle: string;
}) => {
  try {
    const updateRoom = await liveblocks.updateRoom(roomId, {
      metadata: { title: newTitle },
    });
    return parseStringify(updateRoom);
  } catch (error) {
    console.log(`Error updateing document: ${error}`);
  }
};

export const getAllDocuments = async ({ email }: { email: string }) => {
  console.log(email);
  try {
    const rooms = await liveblocks.getRooms({ userId: email });

    return parseStringify(rooms);
  } catch (error) {
    console.log(`Error getting document: ${error}`);
  }
};
