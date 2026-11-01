"use client";

export interface CardDetails {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
}

export const emptyCard: CardDetails = { cardNumber: "", expMonth: "", expYear: "", cvc: "" };

const inputClass =
  "w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function CardFields({ card, onChange }: { card: CardDetails; onChange: (card: CardDetails) => void }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <input
        required
        inputMode="numeric"
        pattern="\d{16}"
        maxLength={16}
        placeholder="Card number (16 digits)"
        value={card.cardNumber}
        onChange={(e) => onChange({ ...card, cardNumber: digitsOnly(e.target.value) })}
        className={`${inputClass} col-span-3`}
        autoComplete="cc-number"
      />
      <input
        required
        inputMode="numeric"
        pattern="0[1-9]|1[0-2]"
        maxLength={2}
        placeholder="MM"
        value={card.expMonth}
        onChange={(e) => onChange({ ...card, expMonth: digitsOnly(e.target.value) })}
        className={inputClass}
        autoComplete="cc-exp-month"
      />
      <input
        required
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        placeholder="YYYY"
        value={card.expYear}
        onChange={(e) => onChange({ ...card, expYear: digitsOnly(e.target.value) })}
        className={inputClass}
        autoComplete="cc-exp-year"
      />
      <input
        required
        inputMode="numeric"
        pattern="\d{3,4}"
        maxLength={4}
        placeholder="CVC"
        value={card.cvc}
        onChange={(e) => onChange({ ...card, cvc: digitsOnly(e.target.value) })}
        className={inputClass}
        autoComplete="cc-csc"
      />
      <p className="col-span-3 text-on-surface-variant font-caption">
        Payments run through a test gateway; no real charge is made.
      </p>
    </div>
  );
}
