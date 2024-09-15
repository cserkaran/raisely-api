// The Exchange Rate Structure to handle the various exchange rate records
// in a type safe manner.
interface ExchangeRateData {
    rates: Record<string, number>;
  }