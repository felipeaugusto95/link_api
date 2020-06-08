import mongoose, { Schema } from 'mongoose';

const DealSchema: Schema = new Schema({
    idDeal: {
        type: Number,
        required: true,
        unique: true
    },  
    creationDate: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model('Deal', DealSchema);