import type { Prisma } from "@prisma/client";

export default async () => {
  try {
    console.log("Running Prisma seed");
  } catch (error) {
    console.error(error);
  }
};
