import { connectDB } from "@/lib/db";
import { Expense } from "@/models/expense";
import { verifyToken } from "@/utils/helpers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


const patchExpenseSchema = z.object(
  {
    title: z.string().optional(),
    amount: z.coerce.number().optional(),
    date: z.coerce.date().optional(),
    note: z.string().optional(),
  }
)


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ expenseId: string }> },
) {
  try {
    const { expenseId } = await params;
    
    await verifyToken();
    await connectDB();

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          msg: "Expense not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        msg: "Expense fetched successfully",
        data: expense
      }
    )

    
    
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        msg: "Internal server error",
      },
      { status: 500 },
    );
  }
}


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ expenseId: string }> }) {
  try {
    await verifyToken();

    const { expenseId } = await params;

    await connectDB();

    const expense = await Expense.findByIdAndDelete(expenseId);

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          msg: "Expense does not exist",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        msg: "Expense deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        msg: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ expenseId: string }> }) {
  try {
    const { expenseId } = await params;
    
    await verifyToken();

    const body = await req.json();

    const parsedBody = patchExpenseSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          msg: parsedBody.error
        },
        { status: 400 },
      );
    }

    const { title, amount, date, note } = parsedBody.data;

    await connectDB();

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          msg: "Expense not found",
        },
        { status: 404 },
      );
    }

    if(title !== undefined) expense.title = title;
    if(amount !== undefined) expense.amount = amount;
    if(date !== undefined) expense.date = date;
    if(note !== undefined) expense.note = note;


    await expense.save();

    return NextResponse.json(
      {
        success: true,
        msg: "Expense updated successfully",
        expense,
      },
      { status: 200 },
    );
    
    
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        msg: "Internal server error",
      },
      { status: 500 },
    );
  }
}


