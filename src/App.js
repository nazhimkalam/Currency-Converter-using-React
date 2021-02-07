import { useEffect, useState } from 'react';
import './App.css';

function App() {
	const BASE_URL = 'https://api.exchangeratesapi.io/latest';
	const [currencyOptions, setCurrencyOptions] = useState([]);
	const [fromCurrency, setFromCurrency] = useState();
	const [toCurrency, setToCurrency] = useState();
	const [amount, setAmount] = useState(1);
	const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
	const [exchangeRate, setExchangeRate] = useState();

	let toAmount, fromAmount;
	if (amountInFromCurrency) {
		fromAmount = amount;
		toAmount = amount * exchangeRate;
	} else {
		toAmount = amount;
		fromAmount = amount / exchangeRate;
	}
	useEffect(() => {
		fetch(BASE_URL)
			.then((res) => res.json())
			.then((data) => {
				const firstCurrency = Object.keys(data.rates)[0];
				setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
				setFromCurrency(data.base);
				setToCurrency(firstCurrency);
				setExchangeRate(data.rates[firstCurrency]);
			});
	}, []);

	useEffect(() => {
		if (fromCurrency != null && toCurrency != null) {
			fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
				.then((res) => res.json())
				.then((data) => setExchangeRate(data.rates[toCurrency]));
		}
	}, [fromCurrency, toCurrency]);

	const handleFromAmountChange = (e) => {
		setAmount(e.target.value);
		setAmountInFromCurrency(true);
	};

	const handleToAmountChange = (e) => {
		setAmount(e.target.value);
		setAmountInFromCurrency(false);
	};
	return (
		<div className="app">
			<h2>Currency Converter</h2>

			<div className="app__container">
				<div className="app__converterOne">
					<input type="number" value={fromAmount} onChange={handleFromAmountChange} />
					<select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
						{currencyOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>

				<p>=</p>

				<div className="app__converterRow">
					<input type="number" value={toAmount} onChange={handleToAmountChange} />
					<select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
						{currencyOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}

export default App;
