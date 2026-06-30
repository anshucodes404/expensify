import { connectDB } from "@/lib/db";
import { Expense } from "@/models/expense";
import { verifyToken } from "@/utils/helpers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const expenseSchema = z.object({
  title: z.string(),
  amount: z.coerce.number(),
  date: z.coerce.date(),
  note: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { _id } = await verifyToken();

    const body = await req.json();
    const parsedBody = expenseSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          msg: parsedBody.error,
        },
        { status: 400 },
      );
    }

    const { title, amount, date, note } = parsedBody.data;

    await connectDB();

    const expense = await Expense.create({
      title,
      amount,
      userId: _id,
      date,
      note
    });

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          msg: "Failed to create expense",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        msg: "Expense created successfully",
        expense,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        msg: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
