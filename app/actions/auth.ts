"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Server action to clear invalid session and redirect to home
 */
export async function clearInvalidSessionAction() {
  redirect("/auth/signin");
}

/**
 * Server action to sign out using Auth.js
 */
export async function signOutAction() {
  // Note: signOut from next-auth/react is client-side
  // For server actions, we just redirect to sign-in
  redirect("/auth/signin");
}

/**
 * Server action to disconnect an OAuth account
 */
export async function disconnectOAuthAccountAction(provider: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  try {
    // Get user with accounts and check if they have a password
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
        deleted_at: null,
      },
      include: {
        accounts: {
          where: { provider },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user has a password (email/password auth)
    if (!user.password) {
      throw new Error(
        "Cannot disconnect OAuth account without email/password authentication set up"
      );
    }

    // Check if the account exists
    if (user.accounts.length === 0) {
      throw new Error(`${provider} account not found`);
    }

    // Delete the OAuth account
    await prisma.account.deleteMany({
      where: {
        userId: user.id,
        provider: provider,
      },
    });

    // Revalidate the profile page to show updated state
    revalidatePath("/profile");

    return { success: true, message: `${provider} account disconnected successfully` };
  } catch (error) {
    console.error("Error disconnecting OAuth account:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error(`Failed to disconnect ${provider} account`);
  }
}

/**
 * Server action for quick admin login in development
 * Only works in local development environment
 */
export async function quickAdminLoginAction() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    throw new Error("Quick admin login is only available in development");
  }

  const adminEmail = process.env.ADMIN_MAIL;
  const adminPassword = process.env.ADMIN_PASS;

  if (!adminEmail || !adminPassword) {
    throw new Error("Admin credentials not configured in environment variables");
  }

  // Find the admin user
  const adminUser = await prisma.user.findFirst({
    where: {
      email: adminEmail,
      deleted_at: null,
    },
    include: {
      roles: {
        where: { deleted_at: null },
        include: {
          role: true,
        },
      },
    },
  });

  if (!adminUser) {
    throw new Error("Admin user not found in database");
  }

  // Check if user has admin role
  const hasAdminRole = adminUser.roles.some(
    (userRole) => userRole.role.name === "admin" && userRole.role.deleted_at === null
  );

  if (!hasAdminRole) {
    throw new Error("User does not have admin role");
  }

  return {
    email: adminEmail,
    password: adminPassword,
  };
}
