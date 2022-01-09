import currency from "currency.js";

export const customCurrency = (value : any) => currency(value, { symbol: '$', decimal: ',', separator: ' ', precision: 0 });