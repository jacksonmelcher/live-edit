import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect("/");

  //TODO assess permission level
  const userIds = Object.keys(room.usersAccesses);
  const users = (await getClerkUsers({ userIds })) as User[];

  const usersData = users?.map((user: User) => ({
    ...user,
    userType: (room.usersAccesses[user.email] as unknown as string)?.includes(
      "room:write",
    )
      ? "editor"
      : "viewer",
  })) as User[];

  const currentUserType = (
    room.usersAccesses[
      clerkUser.emailAddresses[0].emailAddress
    ] as unknown as string
  )?.includes("room:write")
    ? "editor"
    : "viewer";

  return (
    <div className="flex w-full items-center">
      <CollaborativeRoom
        /* @ts-ignore  */
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
        roomId={id}
      />
    </div>
  );
};

export default Document;
