import 'dotenv/config';

import { createClerkClient } from "@clerk/backend";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});

export default clerk;