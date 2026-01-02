'use client';

interface TokenCounterProps {
  count: number;
}

export default function TokenCounter({ count }: TokenCounterProps) {
  return (
    <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">{count.toLocaleString()}</div>
        <div className="text-sm text-gray-600 mt-1">Estimated Tokens</div>
      </div>
    </div>
  );
}
