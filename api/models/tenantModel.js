
import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    deleteStatus: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});
const Tenant = mongoose.model('Tenant', tenantSchema);

export default Tenant;
  