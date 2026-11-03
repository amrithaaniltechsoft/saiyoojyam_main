import { Receipt, ExternalLink, Download } from "lucide-react";
import type { DashboardInvoice } from "./types";

interface PaymentHistoryTabProps {
  invoices?: DashboardInvoice[];
  loading?: boolean;
}

export function PaymentHistoryTab({ invoices = [], loading = false }: PaymentHistoryTabProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-gray-100 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-gray-950">Payment History & Receipts</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            View previous transactions and download verified payment receipts.
          </p>
        </div>
        {invoices.length > 0 && (
          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-center">
            {invoices.length} Total Record(s)
          </span>
        )}
      </div>

      {invoices.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">No payment receipts yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              Your previous transaction receipts will automatically appear here once invoices are paid.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop / Tablet View (Table) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px] sm:text-xs">
                  <th className="py-2.5 sm:py-3 px-3">Receipt #</th>
                  <th className="py-2.5 sm:py-3 px-3">Period</th>
                  <th className="py-2.5 sm:py-3 px-3">Date Paid</th>
                  <th className="py-2.5 sm:py-3 px-3">Amount</th>
                  <th className="py-2.5 sm:py-3 px-3 text-center">Status</th>
                  <th className="py-2.5 sm:py-3 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {invoices.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 sm:py-3.5 px-3 font-semibold text-gray-950 whitespace-nowrap">
                      {tx.id}
                    </td>
                    <td className="py-3 sm:py-3.5 px-3 font-medium text-gray-900">{tx.period}</td>
                    <td className="py-3 sm:py-3.5 px-3 text-gray-600 whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 sm:py-3.5 px-3 font-bold text-gray-950 whitespace-nowrap">
                      {tx.amount}
                    </td>
                    <td className="py-3 sm:py-3.5 px-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold whitespace-nowrap ${
                          tx.status_code === 1 || tx.status_code === 3
                            ? "bg-emerald-100 text-emerald-800"
                            : tx.status_code === 2
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 sm:py-3.5 px-3 text-right">
                      {tx.print_url ? (
                        <a
                          href={tx.print_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#FF561C] hover:bg-orange-50 rounded-md transition-colors"
                        >
                          <span>Print</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="sm:hidden space-y-3">
            {invoices.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-950">{tx.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      tx.status_code === 1 || tx.status_code === 3
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-gray-200">
                  <div>
                    <p className="text-xs font-medium text-gray-900">{tx.period}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Paid on {tx.date}</p>
                  </div>
                  <span className="text-sm font-bold text-[#FF561C]">{tx.amount}</span>
                </div>

                {tx.print_url && (
                  <div className="pt-2 border-t border-gray-200/80 flex justify-end">
                    <a
                      href={tx.print_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-orange-50 border border-gray-200 text-xs font-semibold text-[#FF561C] rounded-md transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
