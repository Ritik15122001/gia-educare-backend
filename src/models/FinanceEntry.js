import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

export const ENTRY_TYPES = ['income', 'expense'];

/**
 * Profit & loss heads. Every entry is tagged to one by hand, and the P&L
 * statement is built from these tags alone:
 *   gross profit     = revenue − direct costs
 *   operating profit = gross profit − operating expenses
 *   net profit       = operating profit + other income − other expenses
 * `excluded` keeps an entry on the books (capital purchases, loans, owner
 * drawings, transfers) without letting it touch profit.
 */
export const PL_TAGS = [
  { key: 'revenue', label: 'Revenue', type: 'income', hint: 'Money earned from the core business — counselling fees, university commissions, test prep, visa services.' },
  { key: 'other_income', label: 'Other income', type: 'income', hint: 'Income outside the core business — interest, refunds received, one-off gains.' },
  { key: 'direct_cost', label: 'Direct costs', type: 'expense', hint: 'Costs tied to delivering a specific student\'s service — sub-agent commissions, application or courier fees paid on their behalf.' },
  { key: 'operating_expense', label: 'Operating expenses', type: 'expense', hint: 'Day-to-day running costs — rent, salaries, marketing, software, utilities, travel.' },
  { key: 'other_expense', label: 'Other expenses', type: 'expense', hint: 'Outside normal operations — loan interest, penalties, one-off write-offs.' },
  { key: 'excluded', label: 'Not in P&L', type: 'any', hint: 'Recorded but kept out of profit — equipment purchases, loans, owner drawings, transfers between accounts.' },
];
export const PL_TAG_KEYS = PL_TAGS.map((t) => t.key);

// Which tags make sense for which entry type. `excluded` fits both.
export const tagsForType = (type) => PL_TAGS.filter((t) => t.type === type || t.type === 'any').map((t) => t.key);

export const PAYMENT_MODES = ['bank_transfer', 'upi', 'cash', 'card', 'cheque', 'other'];

// Starting suggestions for the category field. Categories stay free text, so
// anything typed before also shows up as a suggestion.
export const CATEGORY_PRESETS = {
  income: ['Counselling fees', 'University commission', 'Test preparation fees', 'Visa services', 'Loan & partner referrals', 'Interest', 'Other income'],
  expense: ['Rent', 'Salaries', 'Marketing & ads', 'Software & subscriptions', 'Utilities & internet', 'Travel', 'Office supplies', 'Professional fees', 'Sub-agent commission', 'Bank charges', 'Taxes & GST', 'Equipment', 'Other expense'],
};

// The tag the entry form pre-selects for a preset category. Only a suggestion —
// whoever records the entry can tag it differently.
export const SUGGESTED_TAGS = {
  Interest: 'other_income',
  'Other income': 'other_income',
  'Sub-agent commission': 'direct_cost',
  Equipment: 'excluded',
};

const financeEntrySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ENTRY_TYPES, required: true, index: true },
    // Calendar day of the transaction, stored as midnight UTC.
    date: { type: Date, required: true, index: true },
    // INR, in rupees with up to two decimals.
    amount: { type: Number, required: true, min: [0.01, 'Amount must be more than zero'] },
    category: { type: String, required: true, trim: true, maxlength: 80, index: true },
    plTag: { type: String, enum: PL_TAG_KEYS, required: true, index: true },
    description: { type: String, default: '', trim: true, maxlength: 500 },
    party: { type: String, default: '', trim: true, maxlength: 120 },
    paymentMode: { type: String, enum: [...PAYMENT_MODES, ''], default: '' },
    reference: { type: String, default: '', trim: true, maxlength: 80 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdByName: { type: String, default: '', trim: true },
    updatedByName: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

financeEntrySchema.plugin(toJSONPlugin);
financeEntrySchema.index({ date: -1, createdAt: -1 });

export const FinanceEntry = mongoose.model('FinanceEntry', financeEntrySchema);
