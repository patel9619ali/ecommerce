"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";

type WalletTransaction = {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  reason: string;
  createdAt: string;
};

export default function WalletPage() {
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWallet = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/wallet", { cache: "no-store" });
        const data = await res.json();

        if (res.status === 401) {
          router.push("/sign-in");
          return;
        }
        if (!res.ok) throw new Error(data.error || "Failed to load wallet");

        setWalletBalance(data.walletBalance ?? 0);
        setTransactions(data.transactions ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load wallet");
      } finally {
        setLoading(false);
      }
    };

    loadWallet();
  }, [router]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-[#fff2e5] flex items-center justify-center">
              <Wallet className="h-5 w-5 text-[#ff8000]" />
            </div>
            <h1 className="text-xl font-bold text-[#111827]">My Wallet</h1>
          </div>
          <p className="text-sm text-[#6b7280]">Current Balance</p>
          <p className="text-3xl font-bold text-[#111827] mt-1">Rs {walletBalance.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Recent Transactions</h2>

          {loading ? <p className="text-sm text-[#6b7280]">Loading wallet...</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {!loading && !error && transactions.length === 0 ? (
            <p className="text-sm text-[#6b7280]">No wallet transactions yet.</p>
          ) : null}

          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium text-[#111827]">{txn.reason}</p>
                  <p className="text-xs text-[#6b7280]">
                    {new Date(txn.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <div
                  className={`text-sm font-semibold ${txn.type === "CREDIT" ? "text-[#16a34a]" : "text-[#dc2626]"}`}
                >
                  {txn.type === "CREDIT" ? "+" : "-"}Rs {txn.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
