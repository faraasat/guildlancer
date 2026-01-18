// app/api/realtime/auth/route.ts
// Pusher channel authentication endpoint

import { auth } from "@/lib/auth";
import { authenticateChannel } from "@/lib/realtime/pusher-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { socket_id, channel_name } = await request.json();

    if (!socket_id || !channel_name) {
      return NextResponse.json(
        { error: "Missing socket_id or channel_name" },
        { status: 400 }
      );
    }

    // Verify user has access to the channel
    const userId = session.user.id;

    // Private user channel
    if (channel_name === `private-user-${userId}`) {
      const authResponse = authenticateChannel(socket_id, channel_name, userId);
      return NextResponse.json(authResponse);
    }

    // DM channel - check if user is one of the participants
    if (channel_name.startsWith("dm-")) {
      const dmParticipants = channel_name.replace("dm-", "").split("-");
      if (dmParticipants.includes(userId)) {
        const authResponse = authenticateChannel(socket_id, channel_name, userId);
        return NextResponse.json(authResponse);
      }
    }

    // Guild channel - check if user is a member (implement guild membership check)
    if (channel_name.startsWith("guild-")) {
      // TODO: Verify guild membership
      const authResponse = authenticateChannel(socket_id, channel_name, userId);
      return NextResponse.json(authResponse);
    }

    // Dispute channel - check if user is involved (implement dispute access check)
    if (channel_name.startsWith("dispute-")) {
      // TODO: Verify dispute access
      const authResponse = authenticateChannel(socket_id, channel_name, userId);
      return NextResponse.json(authResponse);
    }

    // Global channel is public
    if (channel_name === "platform-global") {
      const authResponse = authenticateChannel(socket_id, channel_name, userId);
      return NextResponse.json(authResponse);
    }

    return NextResponse.json(
      { error: "Forbidden - not authorized for this channel" },
      { status: 403 }
    );
  } catch (error) {
    console.error("Pusher auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
