// models/Subscription.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notifications: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can only subscribe to a channel once
SubscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);