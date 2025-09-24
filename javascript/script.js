import { addressFromContractId } from './utils.js';
///////// Получаем значения из элементов
// Inputs
const collateralAlphInput = document.getElementById('collateralAlphInput');
const borrowAbdInput = document.getElementById('borrowAbdInput');
const addressInput = document.getElementById('addressInput');
const fetchButton = document.getElementById('fetchButton');
const fetchStatus = document.getElementById('fetchStatus');
// Переменные от Inputs
let collateralALPH = 0;
let borrowABD = 0;
// Вставляем значения в элементы
// Outputs
const collateralUsdOutput = document.getElementById('collateralUsdOutput');
const collateralRateOutput = document.getElementById('collateralRateOutput');
const conclusion = document.getElementById('conclusion');
const liquidationPrice = document.getElementById('liquidationPrice');
const liquidationPriceParagraph = document.getElementById('liquidationPriceParagraph');
const lossALPH = document.getElementById('lossALPH');
// Переменные с ALPH и ABD в USD
let collateralUSD = 0;
let borrowUSD = 0;
// Outputs
const borrowUsdOutput = document.getElementById('borrowUsdOutput');
// Переменная CR
let CR = 0;
let LP = 0;
let LA = 0;
// Selects
let interestRateSelect = document.getElementById('interestRateSelect');
// Вставляем значения в элементы
const hoursALPHOutput = document.getElementById('hoursALPHOutput');
const dayALPHOutput = document.getElementById('dayALPHOutput');
const weekALPHOutput = document.getElementById('weekALPHOutput');
const monthALPHOutput = document.getElementById('monthALPHOutput');
const yearALPHOutput = document.getElementById('yearALPHOutput');
const hoursUSDOutput = document.getElementById('hoursUSDOutput');
const dayUSDOutput = document.getElementById('dayUSDOutput');
const weekUSDOutput = document.getElementById('weekUSDOutput');
const monthUSDOutput = document.getElementById('monthUSDOutput');
const yearUSDOutput = document.getElementById('yearUSDOutput');
// Елементы для изменения цвета
const crResultColor = document.getElementById('crResultColor');
// Переменная для цены ALPH
let alphPrice = 0;
// Доступ к элементу с ценой ALPH
const alphPriceOutput = document.getElementById('alphPriceOutput');
// Загрузка цены ALPH
async function fetchAlephiumPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=alephium&vs_currencies=usd');
        const data = await response.json();
        // Получаем цену в USD
        const price = data.alephium.usd;
        // Добавляем в переменную с ценой для рассчета
        alphPrice = data.alephium.usd;
        // Обновляем элемент на странице
        alphPriceOutput.textContent = `${price.toFixed(4)}$`;
    }
    catch (error) {
        console.error('Ошибка при получении цены Alephium:', error);
        alphPriceOutput.textContent = `Error`;
    }
}
fetchAlephiumPrice(); // Вызываем функцию при загрузке страницы
setInterval(fetchAlephiumPrice, 120000); // Обновляем цену каждые 60 секунд (опционально)
// Функция для рассчета залога в USD
function calcCollateralUsd() {
    const collateral = Number(collateralAlphInput.value);
    if (collateral > 0) {
        collateralUSD = collateral * alphPrice;
        collateralUsdOutput.textContent = `${collateralUSD.toFixed(2)}$`;
    }
    else {
        collateralUSD = 0;
        collateralUsdOutput.textContent = `0$`;
    }
}
// Функция для рассчета займа в USD
function calcBorrowUsd() {
    const borrow = Number(borrowAbdInput.value);
    if (borrow > 0) {
        borrowUSD = borrow * 1;
        borrowUsdOutput.textContent = `${borrowUSD.toFixed(2)}$`;
    }
    else {
        borrowUSD = 0;
        borrowUsdOutput.textContent = `0$`;
    }
}
// Функция рассчета CR
function calcCR() {
    const collateral = collateralUSD;
    const borrow = borrowUSD;
    if (borrow > 0 && collateral > 0) {
        CR = (collateral / borrow) * 100;
        collateralRateOutput.textContent = `${CR.toFixed(2)}%`;
        if (CR >= 400) {
            conclusion.textContent = `Status: ✅ Conservative (CR 400%+)`;
            crResultColor.style.background = `rgb(0, 255, 0, 0.9)`;
            liquidationPriceParagraph.style.color = `rgb(77, 155, 0)`;
        }
        if (CR < 400 && CR >= 280) {
            conclusion.textContent = `Status: ⚖️ Moderate (CR 400%-280%)`;
            crResultColor.style.background = `rgb(255, 255, 0, 0.9)`;
            liquidationPriceParagraph.style.color = `rgb(224, 224, 0)`;
        }
        if (CR < 280 && CR >= 230) {
            conclusion.textContent = `Status: 🎲 Aggressive (CR 280%-230%)`;
            crResultColor.style.background = `rgb(255, 102, 0, 0.9)`;
            liquidationPriceParagraph.style.color = `rgb(255, 102, 0)`;
        }
        if (CR < 230 && CR >= 200) {
            conclusion.textContent = `Status: 🧨 High risk (CR 230%-200%)`;
            crResultColor.style.background = `rgb(236, 47, 0, 0.9)`;
            liquidationPriceParagraph.style.color = `rgb(236, 47, 0)`;
        }
        if (CR < 200 && CR >= 0) {
            conclusion.textContent = `Status: 🚩 Liquidation (CR 200%-100%)`;
            crResultColor.style.background = `rgb(214, 0, 0, 0.9)`;
            liquidationPriceParagraph.style.color = `rgb(214, 0, 0)`;
        }
        if (CR <= 100) {
            conclusion.textContent = `Status: 🕳️ Liquidated (CR < 100%)`;
            crResultColor.style.background = `rgb(139, 0, 0, 0.5)`;
            liquidationPriceParagraph.style.color = `rgb(139, 0, 0)`;
        }
    }
    else {
        CR = 0;
        collateralRateOutput.textContent = `${CR.toFixed(2)}%`;
        conclusion.textContent = `Status: Loan Status: 0 (CR = 0%)`;
        crResultColor.style.background = `rgba(245, 245, 245, 0.6)`;
    }
}
// Функция рассчета годовых процентов
function calcInterestPayment(interestRate) {
    let currentInterestRate = Number(interestRate);
    let hoursUSD = (borrowUSD * (currentInterestRate / 100)) / 365 / 4;
    let dayUSD = (borrowUSD * (currentInterestRate / 100)) / 365;
    let weekUSD = (borrowUSD * (currentInterestRate / 100)) / 365 * 7;
    let monthUSD = (borrowUSD * (currentInterestRate / 100)) / 12;
    let yearUSD = (borrowUSD * (currentInterestRate / 100));
    let hoursALPH = hoursUSD / alphPrice;
    let dayALPH = dayUSD / alphPrice;
    let weekALPH = weekUSD / alphPrice;
    let monthALPH = monthUSD / alphPrice;
    let yearALPH = yearUSD / alphPrice;
    hoursALPHOutput.textContent = `${hoursALPH.toFixed(2)}`;
    dayALPHOutput.textContent = `${dayALPH.toFixed(2)}`;
    weekALPHOutput.textContent = `${weekALPH.toFixed(2)}`;
    monthALPHOutput.textContent = `${monthALPH.toFixed(2)}`;
    yearALPHOutput.textContent = `${yearALPH.toFixed(2)}`;
    hoursUSDOutput.textContent = `${hoursUSD.toFixed(2)}`;
    dayUSDOutput.textContent = `${dayUSD.toFixed(2)}`;
    weekUSDOutput.textContent = `${weekUSD.toFixed(2)}`;
    monthUSDOutput.textContent = `${monthUSD.toFixed(2)}`;
    yearUSDOutput.textContent = `${yearUSD.toFixed(2)}`;
}
function calcLiquidationPrice() {
    const liquidationPercent = 200;
    const calcLP = (liquidationPercent * alphPrice) / CR;
    LP = calcLP;
    const calcLA = borrowUSD / LP + ((borrowUSD / LP) * 0.10);
    LA = calcLA;
    if (CR >= 200) {
        liquidationPrice.textContent = `${LP.toFixed(4)}$`;
        lossALPH.textContent = `~${LA.toFixed(2)}`;
    }
    if (CR < 200) {
        liquidationPrice.textContent = `Marked for liquidation`;
        lossALPH.textContent = `~${LA.toFixed(2)}`;
    }
    if (CR <= 0) {
        liquidationPrice.textContent = `0.00$`;
        lossALPH.textContent = `~${LA.toFixed(2)}`;
    }
}
// Find address for post parameters
async function findAddressForParams(userAddress) {
    try {
        const response = await fetch('https://lb-fullnode-alephium.notrustverify.ch/contracts/call-contract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "args": [{
                        "value": userAddress,
                        "type": "Address"
                    }],
                "group": 0,
                "address": "tpxjsWJSaUh5i7XzNAsTWMRtD9QvDTV9zmMNeHHS6jQB",
                "methodIndex": 23
            })
        });
        const data = await response.json();
        if (data.type === "CallContractSucceeded" && data.returns && data.returns[0]) {
            // Return the raw hex value from the API response
            return data.returns[0].value;
        }
        throw new Error('Invalid response format');
    }
    catch (error) {
        console.error('Error finding address for params:', error);
        throw error;
    }
}
// Fetch user's specific borrowed ABD
async function fetchUserBorrowed(userAddress) {
    try {
        // First get the user's position address
        const contractId = await findAddressForParams(userAddress);
        const positionAddress = addressFromContractId(contractId);
        console.log('Contract ID:', contractId, 'Position Address:', positionAddress);
        // Then fetch the borrowed amount for that position
        const response = await fetch('https://lb-fullnode-alephium.notrustverify.ch/contracts/call-contract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "args": [],
                "group": 0,
                "address": positionAddress,
                "methodIndex": 9
            })
        });
        const data = await response.json();
        if (data.type === "CallContractSucceeded" && data.returns && data.returns[0]) {
            const borrowedValue = data.returns[0].value;
            const borrowedABD = parseInt(borrowedValue) / Math.pow(10, 9);
            return borrowedABD;
        }
        return 0; // Return 0 if no borrowed amount found
    }
    catch (error) {
        console.error('Error fetching user borrowed:', error);
        return 0; // Return 0 on error
    }
}
// Fetch interest rate
async function fetchInterestRate(positionAddress) {
    try {
        const response = await fetch('https://lb-fullnode-alephium.notrustverify.ch/contracts/call-contract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "args": [],
                "group": 0,
                "address": positionAddress,
                "methodIndex": 5
            })
        });
        const data = await response.json();
        if (data.type === "CallContractSucceeded" && data.returns && data.returns[0]) {
            const interestValue = data.returns[0].value;
            // Convert from basis points to percentage (assuming it's in basis points)
            const currentInterestRate = parseInt(interestValue); // Store globally
            return currentInterestRate;
        }
        return 5; // Return default rate if fetch fails
    }
    catch (error) {
        console.error('Error fetching interest rate:', error);
        return 5; // Return default rate on error
    }
}
function showFetchStatus(message, type = 'info') {
    fetchStatus.textContent = message;
    fetchStatus.className = `fetch-status ${type}`;
    // Clear status after 5 seconds
    setTimeout(() => {
        fetchStatus.textContent = '';
        fetchStatus.className = 'fetch-status';
    }, 5000);
}
async function fetchLoanData(address) {
    if (!address.trim()) {
        showFetchStatus('Please enter a valid address.', 'error');
        return;
    }
    showFetchStatus('Fetching loan data...', 'info');
    console.log('Starting fetch for address:', address);
    try {
        // Fetch collateral data
        console.log('Fetching collateral data...');
        const collateralRes = await fetch(`https://corsproxy.io/?https://api.alphbanx.com/api/loan/${address}`);
        console.log('Collateral response status:', collateralRes.status);
        if (collateralRes.status === 404) {
            showFetchStatus('Address does not have a loan on AlphBanx.', 'error');
            return;
        }
        if (!collateralRes.ok) {
            console.error('Collateral API error:', collateralRes.status, collateralRes.statusText);
            throw new Error(`Network error: ${collateralRes.status}`);
        }
        const collateralData = await collateralRes.json();
        console.log('Collateral data:', collateralData);
        // Get position address
        console.log('Finding address for params...');
        const contractId = await findAddressForParams(address);
        console.log('Contract ID:', contractId);
        const positionAddress = addressFromContractId(contractId);
        console.log('Position address:', positionAddress);
        // Fetch borrowed amount using the new API
        console.log('Fetching borrowed amount...');
        const borrowedAmount = await fetchUserBorrowed(address);
        console.log('Borrowed amount:', borrowedAmount);
        // Fetch interest rate using position address
        console.log('Fetching interest rate...');
        const interestRate = await fetchInterestRate(positionAddress);
        console.log('Interest rate:', interestRate);
        if (typeof collateralData.currentCollateral === 'number') {
            collateralAlphInput.value = collateralData.currentCollateral.toString();
            borrowAbdInput.value = borrowedAmount.toFixed(2);
            // Update interest rate select if the fetched rate matches an option
            const interestRateSelect = document.getElementById('interestRateSelect');
            const options = Array.from(interestRateSelect.options);
            const matchingOption = options.find(option => Number(option.value) === interestRate);
            if (matchingOption) {
                interestRateSelect.value = matchingOption.value;
            }
            // Trigger calculations
            calcCollateralUsd();
            calcBorrowUsd();
            calcCR();
            calcLiquidationPrice();
            calcInterestPayment(interestRateSelect.value);
            showFetchStatus('Loan data fetched successfully!', 'success');
        }
        else {
            console.log('Invalid collateral data:', collateralData);
            showFetchStatus('No valid collateral data found for this address.', 'error');
        }
    }
    catch (error) {
        console.error('Error fetching loan data:', error);
        showFetchStatus(`Failed to fetch loan data: ${error.message}`, 'error');
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, checking elements...');
    console.log('fetchButton:', fetchButton);
    console.log('addressInput:', addressInput);
    console.log('fetchStatus:', fetchStatus);
    await fetchAlephiumPrice();
    calcCollateralUsd();
    calcBorrowUsd();
    calcCR();
    calcLiquidationPrice();
    calcInterestPayment(interestRateSelect.value);
    // Add event listeners after DOM is loaded
    collateralAlphInput.addEventListener(`input`, calcCollateralUsd);
    borrowAbdInput.addEventListener(`input`, calcBorrowUsd);
    collateralAlphInput.addEventListener(`input`, calcCR);
    borrowAbdInput.addEventListener(`input`, calcCR);
    collateralAlphInput.addEventListener(`input`, calcLiquidationPrice);
    borrowAbdInput.addEventListener(`input`, calcLiquidationPrice);
    borrowAbdInput.addEventListener('input', () => calcInterestPayment(interestRateSelect.value));
    interestRateSelect.addEventListener('input', () => calcInterestPayment(interestRateSelect.value));
    // Address fetch functionality
    fetchButton.addEventListener('click', () => {
        console.log('Fetch button clicked!');
        const address = addressInput.value.trim();
        console.log('Address value:', address);
        if (address) {
            console.log('Calling fetchLoanData...');
            fetchLoanData(address);
        }
        else {
            console.log('No address entered');
            showFetchStatus('Please enter a wallet address.', 'error');
        }
    });
    // Allow Enter key to trigger fetch
    addressInput.addEventListener('keypress', (e) => {
        console.log('Key pressed:', e.key);
        if (e.key === 'Enter') {
            console.log('Enter key pressed');
            const address = addressInput.value.trim();
            if (address) {
                fetchLoanData(address);
            }
            else {
                showFetchStatus('Please enter a wallet address.', 'error');
            }
        }
    });
});
//# sourceMappingURL=script.js.map