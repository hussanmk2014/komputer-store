// ----- References to Elements -----
// Bank
const bankBalanceElement = document.getElementById("bankBalance");
const bankLoanElement = document.getElementById("bankLoan");
const loanBalanceElement = document.getElementById("loanBalance");
const loanButtonElement = document.getElementById("loan");

// Work
const salaryBalanceElement = document.getElementById("salaryBalance");
const bankButtonElement = document.getElementById("bankTransfer");
const repayLoanButtonElement = document.getElementById("repay-loan-button");
const workButtonElement = document.getElementById("getSalary");

// Laptops
const laptopsSelectElement = document.getElementById("laptops-selection");
const laptopsSpecsElement = document.getElementById("laptops-specs");

// laptopsInfo
const laptopsInfoImageElement = document.getElementById("laptopsInfo-image").firstElementChild;
const laptopsInfoTitleElement = document.getElementById("laptopsInfo-description").firstElementChild;
const laptopsInfoDescriptionElement = document.getElementById("laptopsInfo-description").lastElementChild;
const laptopsInfoPriceElement = document.getElementById("laptopsInfo-price");
const laptopsInfoBuyButtonElement = document.getElementById("laptopsInfo-buyButton");



let bankBalance = 0;
let salaryBalance = 0;
let monthSalary = 100;
let loan = 0;
const loanRatePercent = 0.1;
let availableLoanAmount = 0;
const currencySign = "kr";
let laptops = [];
const laptopsApi = "https://hickory-quilled-actress.glitch.me/computers";
const laptopsImageAPI= "https://hickory-quilled-actress.glitch.me/";
const missedImageUrl="https://hickory-quilled-actress.glitch.me/assets/images/5.png";



// functions
function earnMoney() {
    salaryBalance += monthSalary;
}

function transferToBank() {
    if (salaryBalance <= 0) {
        return;
    }
    let bankMoneyPart = salaryBalance;
    if (loan>0) {
        const loanPaymentPart = salaryBalance * loanRatePercent;
       

        loan -= loanPaymentPart;
        bankMoneyPart -= loanPaymentPart;
    }
    bankBalance += bankMoneyPart;
    salaryBalance = 0;
}

function calculateAvailableLoan() {
    availableLoanAmount = bankBalance * 2;
}

function getLoan() {
    if (loan>0) {
        alert("Unfortunately, You cannot get more than one bank loan before repaying the last loan.");
        return;
    }

    let inputMoney = prompt(" How much do you want to loan?", "0");
    if (inputMoney == null) {
        return;
    }

    let loanAmount = Number.parseInt(inputMoney);
    if (!Number.isInteger(loanAmount)) {
        alert("you have to enter numbers");
        return;
    }


    if (loanAmount <= 0) {
        alert("the amount has to be more than zero");
        return;
    } else if (bankBalance === 0) {
        alert("your balance is 0, you need to charge your balance firstly");
        return;
    } else if (loanAmount > availableLoanAmount) {
        alert(`You cannot get a loan more than double of your bank balance which is ${availableLoanAmount} ${currencySign}`);
        return;
    }

    loan = loanAmount;
    bankBalance += loanAmount;
}

function repayLoan() {
    if (salaryBalance <= 0) {
        return;
    }

    if (salaryBalance > loan) {
        salaryBalance -= loan;
        loan=0;
    }
    else {
        loan-=salaryBalance;
        salaryBalance=0;
    }

}

function buyLaptop(laptop) {
    let laptopPrice = parseInt(laptop.price);
    if (bankBalance < laptopPrice) {
        alert("Unfortunately, there is no enough money in the bank account to buy the laptop!");
        return;
    }
    else
    bankBalance -= laptopPrice;
    alert(`Great! you are the owner now for the laptop  ${laptop.title} for ${laptop.price} ${currencySign}`)
}


//  On click functions 
function onGetLoanClick() {
    getLoan();
    uppdateLoanInfo();
    uppdateBankBalance();
    uppdateLoanToPayBalance();
 
}


function ontransferToBankClick() {
    transferToBank();
    uppdateBankBalance();
    uppdateLoanToPayBalance();
    uppdateSalaryBalance();
    uppdateLoanInfo();
    calculateAvailableLoan();
}

function onEarnMoneyClick() {
    earnMoney();
    uppdateSalaryBalance();
}

function onRepayLoanClick() {
    repayLoan();
    uppdateSalaryBalance();
    uppdateLoanToPayBalance();
    uppdateLoanInfo();
    calculateAvailableLoan();
}

function onBuyLaptopClick() {
    let laptop = laptops.find(laptop => parseInt(laptop.id) === parseInt(laptopsSelectElement.value));
    buyLaptop(laptop);
    uppdateBankBalance();
    uppdateSalaryBalance();
    calculateAvailableLoan();
}


//  uppdate functions 
function addLaptopsToSelect(laptops) {
    laptops.forEach(x => addLaptopToSelect(x));
}

function addLaptopToSelect(laptop) {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.innerText=(laptop.title);
    laptopsSelectElement.appendChild(laptopElement);
}

function uppdateLaptopSpecs(laptop) {
    laptop["specs"].forEach(x => uppdateLaptopSpec(x));
}

function uppdateLaptopSpec(laptopSpec) {
    const laptopSpecElement = document.createElement('li');
    laptopSpecElement.innerText = laptopSpec;
    laptopsSpecsElement.appendChild(laptopSpecElement);
}

function handleLaptopSelectChange (laptop) {  
    const selectedLaptop = laptops[laptop.target.selectedIndex];
    laptopsSpecsElement.innerHTML = "";
    selectedLaptop["specs"].forEach(x => uppdateLaptopSpec(x));
    uppdatelaptopsInfo(selectedLaptop);
}

function uppdatelaptopsInfo(laptop) {
    if (laptop==laptops[4]) {
        laptopsInfoImageElement.src = missedImageUrl;
    }
    else {laptopsInfoImageElement.src = laptopsImageAPI+ laptop["image"];}
  
    laptopsInfoTitleElement.innerHTML = laptop["title"];
    laptopsInfoDescriptionElement.innerHTML = laptop["description"];
    laptopsInfoPriceElement.innerHTML = `${laptop["price"]} ${currencySign}`;
}

function uppdateBankBalance() {
    bankBalanceElement.innerText = `${bankBalance} ${currencySign}`;
}
function uppdateLoanToPayBalance() {
    loanBalanceElement.innerText = `${loan} ${currencySign}`;
}
function uppdateSalaryBalance() {
    salaryBalanceElement.innerText = `${salaryBalance} ${currencySign}`;
}


// show or hide loan informatin
function uppdateLoanInfo() {
    if (loan===0){
        bankLoan.classList.add("hide");
        repayLoanButtonElement.classList.add("hide");
    }
    else{
        bankLoan.classList.remove("hide");
        repayLoanButtonElement.classList.remove("hide");
    }

}



//  Fetch api  
fetch(laptopsApi )
    .then(response => response.json())
    .then(responseJSON => laptops = responseJSON)
    .then(laptops => addLaptopsToSelect(laptops))
    .then(laptop => {
        uppdateLaptopSpecs(laptops[0]);
        uppdatelaptopsInfo(laptops[0]);
    });


//  Initial uppdating
uppdateBankBalance();
uppdateSalaryBalance();


//  Event listeners 
// Bank
loanButtonElement.addEventListener("click", onGetLoanClick);

// Work
bankButtonElement.addEventListener("click", ontransferToBankClick);
workButtonElement.addEventListener("click", onEarnMoneyClick);
repayLoanButtonElement.addEventListener("click", onRepayLoanClick)

// Laptops selection
laptopsSelectElement.addEventListener("change", handleLaptopSelectChange)

// laptopsInfo
laptopsInfoBuyButtonElement.addEventListener("click", onBuyLaptopClick);