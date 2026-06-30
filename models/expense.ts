import mongoose, {Document, Schema} from "mongoose";

export interface IExpense extends Document {
  title: string,
  amount: number,
  userId: mongoose.Types.ObjectId,
  date: Date,
  note: string,
  createdAt: Date
}

const expenseSchema: Schema<IExpense> = new Schema({
  title: {
    type: String,
    required: true
  }, 
  amount: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  note: {
    type: String,
    required: false
  }
}, {timestamps: true})


export const Expense = mongoose.models.Expense as mongoose.Model<IExpense> || mongoose.model("Expense", expenseSchema)