import connectDB from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// GET /api/bookmarks
export const GET = async () => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }

    const { userId } = sessionUser;

    // Find user in database
    const user = await User.findOne({ _id: userId });

    // Get users bookmarks
    const bookmarks = await Property.find({ _id: { $in: user.bookmarks } });
    return new Response(JSON.stringify(bookmarks), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Somethings went wrong", { status: 200 });
  }
};

// POST /api/bookmarks

export const POST = async (request) => {
  try {
    await connectDB();

    const { propertyId } = await request.json();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }

    const { userId } = sessionUser;

    // Find user in database
    const user = await User.findOne({ _id: userId });

    // Check if Property is bookmarked
    let isBookmarked = user.bookmarks.includes(propertyId);

    let message;

    if (isBookmarked) {
      // if already bookmarked, remove it
      user.bookmarks.pull(propertyId);
      message = "Bookmark remove Successfully";
      isBookmarked = false;
    } else {
      // if not bookmarked , add it
      user.bookmarks.push(propertyId);
      message = "Bookmark added successfully";
      isBookmarked = true;
    }

    await user.save();

    return new Response(JSON.stringify({ message, isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Somethings went wrong", { status: 500 });
  }
};
