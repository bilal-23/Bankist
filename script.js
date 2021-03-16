'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2021-03-13T14:11:59.604Z',
        '2021-03-14T17:01:17.194Z',
        '2021-03-15T23:36:17.929Z',
        '2021-03-16T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////////////////


// Data
// const account1 = {
//     owner: 'Jonas Schmedtmann',
//     movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//     interestRate: 1.2, // %
//     pin: 1111,
// };

// const account2 = {
//     owner: 'Jessica Davis',
//     movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//     interestRate: 1.5,
//     pin: 2222,
// };

// const account3 = {
//     owner: 'Steven Thomas Williams',
//     movements: [200, -200, 340, -300, -20, 50, 400, -460],
//     interestRate: 0.7,
//     pin: 3333,
// };

// const account4 = {
//     owner: 'Sarah Smith',
//     movements: [430, 1000, 700, 50, 90],
//     interestRate: 1,
//     pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// CODE



//CREATE USERNAME
function createUsername(acc) {
    acc.forEach(function (account) {
        account.username = account.owner
            .toLowerCase()
            .split(' ')
            .reduce((total, value) => {
                return total + value[0];
            }, "")
    })
}
createUsername(accounts);


//formate MV+OVEMENTS DATE
function formatMovementDate(date, locale) {
    const calcDays = (date1, date2) =>
        Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24))


    const daysPassed = (calcDays(new Date(), date));
    // console.log(daysPassed);
    if (daysPassed === 0) return `Today`
    if (daysPassed === 1) return `Yesterday`
    if (daysPassed <= 7) return `${daysPassed} days ago`

    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`
    return new Intl.DateTimeFormat(locale).format(date)
}
//FORMAT CURRENCY
function formatCurrency(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(value);
}


//DISPLAY  MOVEMENTS
function displayMovement(acc, sort = false) {
    containerMovements.textContent = "";

    //sorting movs
    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';


        const date = new Date(acc.movementsDates[i]);

        const displayDate = formatMovementDate(date, acc.locale);
        const formattedMov = formatCurrency(mov, acc.locale, acc.currency);



        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', html)
    })
}



//DISPLAY TOTAL BALANCE
function calcPrintBalance(acc) {
    const balance = acc.movements.reduce((total, value) => { return total + value }).toFixed(2);
    acc.balance = balance;
    labelBalance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency);
}




//DISPLAY SUMMARY OF IN OUT AND INTEREST
function calcDisplaySummary(acc) {
    const income = acc.movements.filter(x => x > 0).reduce((total, cur) => { return total + cur }, 0).toFixed(2);
    labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency);

    const outgoing = acc.movements.filter(x => x < 0).reduce((total, cur) => { return total + cur }, 0).toFixed(2);
    labelSumOut.textContent = formatCurrency(outgoing, acc.locale, acc.currency);

    const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100).filter(x => x >= 1).reduce((int, cur) => { return int + cur }, 0).toFixed(2);
    labelSumInterest.textContent = formatCurrency(interest, acc.locale, acc.currency);
}

//SORT MOVEMENTS
let sorted = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovement(currentAccount, !sorted);
    sorted = !sorted;
});
//     const acc = currentAccount.movements;
//     if (!sort) {
//         acc.sort((a, b) => a - b);
//         sort = true;
//     } else if (sort) {
//         acc.sort((a, b) => b - a);
//         sort = false;
//     }
//     updateUI(currentAccount)
// })

function updateUI(acc) {
    //Display MOVEMENTS
    displayMovement(acc);
    //DISPLAY BALANCE
    calcPrintBalance(acc);
    //DISPLAY SUMMARY
    calcDisplaySummary(acc);
    //START TIMER

}




let currentAccount, timer;



//LOGOUT TIMER
function startLogoutTimer() {
    const tick = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, '0');
        const sec = String(time % 60).padStart(2, '0');
        //in each call print the remaining time to ui
        labelTimer.textContent = `${min}:${sec}`;
        //whensecond  is 0 clear timeer and logout
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = "Login to get started"
            containerApp.style.opacity = 0;
        }
        //decrease timer
        time--;
    }
    //setiing time to 5mins
    let time = 300;
    tick();
    let timer = setInterval(tick, 1000)
    return timer;

}






//EVENT HANDLERS LOGIN
btnLogin.addEventListener('click', function (e) {
    e.preventDefault();
    // console.log("login");
    currentAccount = accounts.find(acc => inputLoginUsername.value === acc.username);
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        //DISPLAY UI 
        labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]} `;

        //CURRENT DATE AND TIME
        const now = new Date();
        const options = {
            day: 'numeric',
            month: 'numeric',
            year: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            // weekday: 'short'

        }
        const locale = currentAccount.locale;
        labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now)


        // const now = new Date();
        // const day = `${now.getDate()}`.padStart(2, 0);
        // const month = `${now.getMonth() + 1}`.padStart(2, 0);
        // const year = now.getFullYear();
        // const hours = `${now.getHours()}`.padStart(2, 0);
        // const mins = `${now.getMinutes()}`.padStart(2, 0);
        // labelDate.textContent = `${day}/${month}/${year} ${hours}:${mins}`;
        containerApp.style.opacity = 100;

        //Clear input field
        inputLoginPin.value = '';
        inputLoginUsername.value = '';
        inputLoginPin.blur();

        //UPDTE UI
        updateUI(currentAccount);
        if (timer) clearInterval(timer);
        timer = startLogoutTimer();
    }

});

//TRANSFER AMOUNT
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(acc =>
        acc.username === inputTransferTo.value);
    // console.log(amount, receiverAcc);
    if (receiverAcc && amount > 0 && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        //Transfer Date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());


        inputTransferAmount.value = inputTransferTo.value = '';
        inputTransferAmount.blur();



        //UPDATE UI
        setTimeout(function () {
            updateUI(currentAccount);
        }, 2500);
    }
    //Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();

});

//TAKE LOAN
btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(a => a > 0.1 * amount)) {
        setTimeout(function () {
            currentAccount.movements.push(amount);
            //Loan Date
            currentAccount.movementsDates.push(new Date().toISOString());

            updateUI(currentAccount);
        }, 2500)


    } else if (amount == 0) {
        alert("Amount cannot be 0");
    }
    else {
        alert("You are not elgible to take loan for this much amount")
    }
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
    //Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();

})





//DELETE ACCOUNT
btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (inputCloseUsername.value === currentAccount.username &&
        Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(acc => acc.username === currentAccount.username);
        accounts.splice(index, 1);
        labelWelcome.textContent = 'Log in to get started'
        containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
})


/////////////////////////////////////////////
////////////////////////////////////////////////
//////////////////////////////////////////////

// console.log(accounts.map(acc => acc.movements).flat().reduce((acc, cur) => acc + cur))
// console.log(deposits, withdrawals, balance);
// const num = 1234323432;
// const options = {
//     style: 'currency',
//     currency: 'INR'
// }
// console.log(new Intl.NumberFormat('en-US', options).format(num))
// console.log(new Intl.NumberFormat('en-IN', options).format(num))
// console.log(new Intl.NumberFormat('en-GB', options).format(num))
// console.log(new Intl.NumberFormat('ar-SY', options).format(num))