import mongoose, { Schema } from 'mongoose';

const OrderAggregateSchema: Schema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    totalValue: {
        type: Number,
        required: true
    },  
    creationDate: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model('OrderAggregate', OrderAggregateSchema);


