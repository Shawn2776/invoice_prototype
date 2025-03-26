"use server";

import prisma from "@/lib/prisma";

export default async function createUser(params) {
  const { clerkId, email, firstName, lastName, tenantId } = params;

  try {
    const user = await prisma.user.create({
      data: {
        clerkId,
        email,
        firstName,
        lastName,
        tenantId: tenantId ?? null, // Ensure null is stored if no tenantId is provided
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: error.message };
  }
}
