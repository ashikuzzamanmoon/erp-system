import { type Sale } from '../../api/transactions';

interface InvoicePrintableProps {
  sale: Sale | null;
}

export function InvoicePrintable({ sale }: InvoicePrintableProps) {
  if (!sale) return null;

  return (
    <div className="hidden print:block absolute inset-0 bg-white text-black p-8 z-[99999]">
      <div className="max-w-2xl mx-auto border border-slate-200 p-8 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">INVOICE</h1>
            <p className="text-sm text-slate-500 mt-1">Receipt for your transaction</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tracking-tight text-slate-900">Code Bondhu ERP</div>
            <p className="text-sm text-slate-500">123 Tech Avenue, Suite 100</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</h3>
            <p className="font-semibold text-slate-900">{sale.customer?.name || 'Walk-in Customer'}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Invoice Details</h3>
            <p className="text-slate-900 font-medium">Invoice No: <span className="text-slate-600 font-normal">#{sale.id.slice(0, 8).toUpperCase()}</span></p>
            <p className="text-slate-900 font-medium">Date: <span className="text-slate-600 font-normal">{new Date(sale.created_at).toLocaleDateString()}</span></p>
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="py-3 px-4 text-left text-xs font-bold text-slate-600 uppercase">Item Description</th>
              <th className="py-3 px-4 text-center text-xs font-bold text-slate-600 uppercase">Qty</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-slate-600 uppercase">Unit Price</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-slate-600 uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-4 px-4 font-medium text-slate-900">{sale.product?.name || 'Unknown Product'}</td>
              <td className="py-4 px-4 text-center text-slate-600">{sale.quantity}</td>
              <td className="py-4 px-4 text-right text-slate-600">৳{sale.product?.price?.toFixed(2) || '0.00'}</td>
              <td className="py-4 px-4 text-right font-semibold text-slate-900">৳{sale.total_amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="font-semibold text-slate-900">৳{sale.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Tax (0%)</span>
              <span className="font-semibold text-slate-900">৳0.00</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-lg font-bold text-slate-900">Total Due</span>
              <span className="text-2xl font-black text-primary">৳{sale.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>Thank you for doing business with us!</p>
        </div>
      </div>
    </div>
  );
}
