import mongoose, { Schema } from 'mongoose';
const PetSchema = new Schema({
    name: { type: String, },
    breed: { type: String, },
    status: { type: String, },
    images: [{ type: String }],
    description: { type: String },
    category: { type: String, },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    // Use GeoJSON for location; coordinates: [longitude, latitude]
});
// Create a geospatial index on the location field
PetSchema.index({ location: '2dsphere' });
export default mongoose.model('Pet', PetSchema);
