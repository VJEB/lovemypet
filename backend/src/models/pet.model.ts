import mongoose, { Schema, Document } from 'mongoose';

export interface IPet extends Document {
  id?: string;
  name: string;
  breed: string;
  status: string;
  images?: string[];
  description: string;
  category: 'Dog' | 'Cat';
  owner?: mongoose.Types.ObjectId;
}

const PetSchema: Schema = new Schema({
  name: { type: String,  },
  breed: { type: String,  },
  status: { type: String,  },
  images: [{ type: String }],
  description: { type: String },
  category: { type: String, },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  // Use GeoJSON for location; coordinates: [longitude, latitude]
});

// Create a geospatial index on the location field
PetSchema.index({ location: '2dsphere' });

export default mongoose.model<IPet>('Pet', PetSchema);
