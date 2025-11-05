import React from 'react';

interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  showSign?: boolean;
  className?: string;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$'
};

export function CurrencyDisplay({ amount, currency, showSign = false, className = '' }: CurrencyDisplayProps) {
  const symbol = currencySymbols[currency] || currency;
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Math.abs(amount));
  
  const sign = showSign && amount !== 0 ? (amount > 0 ? '+' : '-') : '';
  
  return (
    <span className={className} aria-label={`${sign}${formattedAmount} ${currency}`}>
      {sign}{symbol}{formattedAmount}
    </span>
  );
}
