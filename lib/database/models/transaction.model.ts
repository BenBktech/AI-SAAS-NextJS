import { Schema, model, models, Document  } from "mongoose";

export interface ITransaction extends Document {
    createdAt?: Date; // Marqué comme optionnel car il est automatiquement défini par Mongoose
    stripeId: string;
    amount: number;
    plan?: string; // Optionnel, n'est pas marqué comme required dans le schéma
    credits?: number; // Optionnel, n'est pas marqué comme required dans le schéma
    buyer?: Schema.Types.ObjectId; // Optionnel et fait référence à un autre document
}

const TransactionSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
  },
  credits: {
    type: Number,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Transaction = models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;