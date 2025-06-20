"use strict";
///////// Получаем значения из элементов
// Inputs
const collateralAlphInput = document.getElementById('collateralAlphInput');
const borrowAbdInput = document.getElementById('borrowAbdInput');
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
// Переменные с ALPH и ABD в USD
let collateralUSD = 0;
let borrowUSD = 0;
// Outputs
const borrowUsdOutput = document.getElementById('borrowUsdOutput');
// Переменная CR
let CR = 0;
let LP = 0;
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
    if (CR >= 200) {
        liquidationPrice.textContent = `${LP.toFixed(4)}$`;
    }
    if (CR < 200) {
        liquidationPrice.textContent = `Marked for liquidation`;
    }
    if (CR <= 0) {
        liquidationPrice.textContent = `0.00$`;
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    await fetchAlephiumPrice();
    calcCollateralUsd();
    calcBorrowUsd();
    calcCR();
    calcLiquidationPrice();
    calcInterestPayment(interestRateSelect.value);
});
collateralAlphInput.addEventListener(`input`, calcCollateralUsd);
borrowAbdInput.addEventListener(`input`, calcBorrowUsd);
collateralAlphInput.addEventListener(`input`, calcCR);
borrowAbdInput.addEventListener(`input`, calcCR);
collateralAlphInput.addEventListener(`input`, calcLiquidationPrice);
borrowAbdInput.addEventListener(`input`, calcLiquidationPrice);
borrowAbdInput.addEventListener('input', () => calcInterestPayment(interestRateSelect.value));
interestRateSelect.addEventListener('input', () => calcInterestPayment(interestRateSelect.value));
//# sourceMappingURL=script.js.map