"use strict";

const title = document.getElementById('title');
console.log(title);

const startBtn = document.getElementsByClassName('handler_btn')[0];
const resetBtn = document.getElementsByClassName('handler_btn')[1];
console.log(resetBtn)
const buttonPlus = document.querySelector('.screen-btn');
console.log(buttonPlus);

const otherItemPercent = document.querySelectorAll('.other-items.percent');
console.log(otherItemPercent);

const otherItemNumber = document.querySelectorAll('.other-items.number');
console.log(otherItemNumber);

const rollbackInput = document.querySelector('div.rollback input[type=range]');
console.log(rollbackInput);

const rollbackSpan = document.querySelector('div.rollback span');
console.log(rollbackSpan);

const total = document.getElementsByClassName('total-input')[0];
const totalCount = document.getElementsByClassName('total-input')[1];
const totalICountOther = document.getElementsByClassName('total-input')[2];
const fullTotalCount = document.getElementsByClassName('total-input')[3];
const totalCountRollback = document.getElementsByClassName('total-input')[4];

const range = document.getElementById('range');
const rangeSpan = document.getElementsByClassName('range-value')[0];
const countInput = document.getElementById('count-input');

const countSelect = document.getElementById('select-Count');
console.log(countInput, 'countInput', countInput.value, countSelect, 'countSelect', countSelect.value);
console.log(countInput, typeof (countInput),);
console.log(range, rangeSpan);
console.dir(countInput.value);

let screens = document.querySelectorAll('.screen');
console.log(screens);

const appData = {
    title: '',
    screens: [],
    screenPrice: 0,
    adaptive: true,
    rollback: 10,
    servicePricesPercent: 0,
    servicePricesNumber: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    servicesPersent: {},
    servicesNumber: {},
    init: function () {
        this.addTitle();

        buttonPlus.addEventListener('click', this.addScreenBlock);
        range.addEventListener('change', this.rangesize);
        startBtn.addEventListener('click', () => this.start());
        resetBtn.addEventListener('click', () => this.reset());
    },
    rangesize: function (event) {
        rangeSpan.textContent = event.target.value;
        this.rollback = event.target.value;
        console.log(this.rollback);
    },
    start: function () {
        this.addScreens();
        this.addPrices();
        this.addServisec();
        this.showResult();
        this.disableInputs();
        startBtn.style.display = 'none';
        resetBtn.style.display = 'block';
        console.log(totalICountOther.value)
    },
    disableInputs: function () {
        const inputsToDisable = document.querySelectorAll('#count-input, #select-Count');
        inputsToDisable.forEach(input => {
            input.disabled = true;
        });
    },
    reset: function () {
        // Вернуть кнопку "Рассчитать"
        startBtn.style.display = 'block';

        // Скрыть кнопку "Сброс"
        resetBtn.style.display = 'none';

        // Разблокировать countInput и countSelect
        countInput.removeAttribute('disabled');
        countSelect.removeAttribute('disabled');

        // Очистить и удалить все добавленные экраны
        screens.forEach((screen, index) => {
            if (index > 0) {
                screen.remove();
            }
        });

        // Обнулить массив screens
        this.screens = [];

        // Очистить и удалить все добавленные услуги
        otherItemPercent.forEach(item => {
            const check = item.querySelector('input[type=checkbox]');
            if (check) {
                check.checked = false;
            }
        });

        otherItemNumber.forEach(item => {
            const check = item.querySelector('input[type=checkbox]');
            if (check) {
                check.checked = false;
            }
        });

        // Очистить rollback и сделать select-Count активным
        rollbackInput.value = 0;
        rangeSpan.textContent = '0';
       

        // Обнулить все цены
        total.value = '0';
        totalCount.value = '0';
        totalICountOther.value = '0';
        fullTotalCount.value = '0';
        totalCountRollback.value = '0';
        countSelect.value = '';
        countInput.value = 0;
        appData.fullPrice = 0;
        fullTotalCount.value = 0;
        appData.screenPrice = 0;
        totalICountOther.value = '0';
        
        appData.servicePricesNumber = 0;
        appData.servicePricesPercent = 0;
        // Обнулить услуги
        this.servicesPersent = {};
        this.servicesNumber = {};
    },

    addScreenBlock: function () {
        const cloneScreen = screens[0].cloneNode(true);
        screens[screens.length - 1].after(cloneScreen);
    },
    addScreens: function () {
        screens = document.querySelectorAll('.screen');
        screens.forEach(function (screen, index) {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input');

            const selectName = select.options[select.selectedIndex].textContent;
            appData.screens.push({
                id: index,
                name: selectName,
                price: +select.value * +input.value,
                count: +input.value
            });

            let count = 0;
            appData.screens.forEach(screens => {
                count += screens.count;
            });
            totalCount.value = count;
        });
    },
    addServisec: function () {
        otherItemPercent.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text');
            if (check && check.checked) {
                appData.servicesPersent[label.textContent] = +input.value;
            }
        });
        otherItemNumber.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text');
            if (check && check.checked) {
                appData.servicesNumber[label.textContent] = +input.value;
            }
        });
    },
    addPrices: function () {
        for (let screen of appData.screens) {
            appData.screenPrice += +screen.price;
        }
        for (let key in appData.servicesNumber) {
            appData.servicePricesNumber += +appData.servicesNumber[key];
        }
        for (let key in appData.servicesPersent) {
            appData.servicePricesPercent += appData.screenPrice * (appData.servicesPersent[key] / 100);
        }
        appData.fullPrice = +appData.screenPrice + +appData.servicePricesNumber + +appData.servicePricesPercent;

        totalCountRollback.value = appData.fullPrice - (appData.fullPrice * (appData.rollback / 100));

        console.log(appData.screenPrice, "appData.screenPrice", appData.servicePricesNumber, 'appData.servicePricesNumber', appData.servicePricesPercent, 'appData.servicePricesPercent', appData.rollback, 'appData.rollback', appData.servicePricesNumber, 'appData.servicePricesNumber');
    },
    addTitle: function () {
        document.title = title.textContent;
    },
    showResult: function () {
        total.value = appData.screenPrice;
        totalICountOther.value = appData.servicePricesPercent + appData.servicePricesNumber;
        fullTotalCount.value = appData.fullPrice;
        
    }
};

appData.init();
