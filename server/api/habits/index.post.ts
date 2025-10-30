import { PrismaClient } from '@prisma/client'
import { serverSupabaseUser } from '#supabase/server'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const body = await readBody(event);

    // ✅ Validate required fields
    const { name, categoryId, customFields = [], rewards = [], ...rest } = body;

    if (!name || !categoryId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Both 'name' and 'categoryId' are required.",
      });
    }

    // ✅ Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: "Category not found.",
      });
    }

    // ✅ Atomic creation using transaction
    const [habit] = await prisma.$transaction([
      prisma.habit.create({
        data: {
          ...rest,
          name,
          categoryId,
          userId: user.sub,
          customFields: customFields.length
            ? {
                create: customFields.map((field: any) => ({
                  title: field.title,
                  type: field.type,
                  options: field.options ?? null,
                  isRequired: field.isRequired ?? false,
                  sortingOrder: field.sortingOrder ?? 0,
                })),
              }
            : undefined,
          rewards: rewards.length
            ? {
                create: rewards.map((reward: any) => ({
                  milestoneValue: reward.milestoneValue,
                  name: reward.name,
                  description: reward.description ?? "",
                  icon: reward.icon ?? "🏆",
                  sortingOrder: reward.sortingOrder ?? 0,
                })),
              }
            : undefined,
        },
        include: {
          customFields: true,
          rewards: true,
        },
      }),
    ]);

    return {
      success: true,
      message: "Habit created successfully.",
      data: habit,
    };
  } catch (error: any) {
    console.error("Error creating habit:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to create habit.",
    });
  }
});

