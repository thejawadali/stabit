import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'


export default defineEventHandler(async (event) => {
  try {
    const user = requireAuth(event);

    const body = await readBody(event);

    // ✅ Validate required fields
    const { name, categoryId, customFields = [], ...rest } = body;

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

    // Initialize currentTargetValue to initialValue if not provided
    const initialValue = rest.initialValue ?? 0
    const currentTargetValue = rest.currentTargetValue ?? initialValue

    // ✅ Atomic creation using transaction
    const [habit] = await prisma.$transaction([
      prisma.habit.create({
        data: {
          ...rest,
          name,
          categoryId,
          userId: user.id,
          currentTargetValue,
          customFields: customFields.length
            ? {
                create: customFields.map((field: any) => ({
                  title: field.title,
                  type: field.type,
                  options: field.options ?? null,
                  placeholder: field.placeholder ?? null,
                  isRequired: field.isRequired ?? false,
                  sortingOrder: field.sortingOrder ?? 0,
                })),
              }
            : undefined,
        },
        include: {
          customFields: true,
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

