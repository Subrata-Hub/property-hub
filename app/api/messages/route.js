import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response(
        JSON.stringify({ message: "You must log in to send a message" }),
        { status: 401 }
      );
    }

    const { userId } = sessionUser;

    const readMessages = await Message.find({ recipient: userId, read: true })
      .sort({ createdAt: -1 })
      .populate("sender", "username")
      .populate("property", "name");

    const unReadMessages = await Message.find({
      recipient: userId,
      read: false,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "username")
      .populate("property", "name");

    const messages = [...unReadMessages, ...readMessages];

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify("Something went wrong"), {
      status: 500,
    });
  }
};

// POST /api/message
export const POST = async (request) => {
  try {
    await connectDB();

    const { name, email, phone, message, property, recipient } =
      await request.json();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response(
        JSON.stringify({ message: "You must log in to send a message" }),
        { status: 401 }
      );
    }

    const { user } = sessionUser;

    // can not send message to self
    if (user.id === recipient) {
      return new Response(
        JSON.stringify({ message: "Cannot send a message to yourself" }),
        { status: 400 }
      );
    }

    const newMessage = new Message({
      sender: user.id,
      name,
      recipient,
      property,
      email,
      phone,
      body: message,
    });

    await newMessage.save();

    return new Response(JSON.stringify({ message: "Message Sent" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify("Something went wrong"), {
      status: 500,
    });
  }
};
