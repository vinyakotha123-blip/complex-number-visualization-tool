import { Schema, model, models, type Model, type Document } from 'mongoose';

export interface GraphDocument extends Document {
  name: string;
  re: number;
  im: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const GraphSchema = new Schema<GraphDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    re: { type: Number, required: true },
    im: { type: Number, required: true },
    color: { type: String, default: '#7c5cff' },
  },
  { timestamps: true }
);

// Reuse the compiled model across hot-reloads in development.
export const Graph: Model<GraphDocument> = models.Graph || model<GraphDocument>('Graph', GraphSchema);
