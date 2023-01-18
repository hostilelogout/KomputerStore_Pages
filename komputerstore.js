
//#region Caching document.getElementById for future use and to reduce overall time spent looking for them. Section
const getLoanButtonElement = document.getElementById("get_loan_button");
const repayLoanButtonElement = document.getElementById("repay_loan_button");
const bankSalaryButton = document.getElementById("bank_salary_button");
const paySalaryButton = document.getElementById("pay_salary_button");
const paySalary = document.getElementById("paySalary");
const totalBalance = document.getElementById("totalBalance");
const loanBalance = document.getElementById("loanBalance");

const computerList = document.getElementById("computer_list");
const computerFeatures = document.getElementById("computerFeature");
const computerInformation = document.getElementById("laptopInformation")
const computerImageSource = document.getElementById("imageSource")
const computerNameElement = document.getElementById("computer_name")
const computerDescriptionElement = document.getElementById("computer_description")
const computerPriceElement = document.getElementById("computer_price")
const computerBuyNowButton = document.getElementById("computer_buy_now_button")

//#endregion


// adds any type of html element attribute with a set of value to a element, example adding a hidden attribute to a element
const AddAttribute = (htmlElement, attributeToSet, value = "") => htmlElement.setAttribute(attributeToSet, value);

// removes a attribute from a html element
const RemoveAttribute = (htmlElement, attributeToRemove, value = "") => htmlElement.removeAttribute(attributeToRemove, value);

// changes the specific style called visibility to a set value, example a button is set to hidden or visible.
const ChangeElementVisibility = (htmlElement, value) => htmlElement.style.visibility = value;

// simply clears the innerHtml of any document is given.
const ClearInnerHtml = (htmlElement) => htmlElement.innerHTML = "";

// stores any data related to computers as json elements
let computersData = [];
// stores information about the computer in a object format for easy access to the desired computer 
let computers = [];
// stores the option from the selected computer and it's bound data
let currentOption;

// using the Fetch API to get a list of computers as json and runs a method with the found data
fetch("https://hickory-quilled-actress.glitch.me/computers")
    .then(response => response.json())
    .then(data => computersData = data)
    .then(computersData => AddComputerToList(computersData))

// Defined Computers as Objects for easy use and more manageable
function Computers(id, title, description, specs, price, stock, active, image) {
    this.id = id;
    this.title = title
    this.description = description
    this.specs = [] = specs
    this.price = price
    this.stock = stock
    this.active = active
    this.image = image
}
// Stores bank information and handle any bank related fucntionality 
function Bank() {

    this.balance = 0.0 // defines a float for holding the balance
    this.loanAmount = 0.0 // defines a float for holding how much loan you have
    
    // deposit handle how the money gets inserted
    this.Deposit = function (amount) {

        // check if loan is over 0 if so continue
        if (this.loanAmount > 0) {

            // defines a non changeable value as the amount divided by 10 to get 10% of amount
            const deductedPay = amount / 10
            // take the loan and deduct the amount left after a pay deduction
            this.loanAmount -= deductedPay
            // adds amount left after deduction
            this.balance += (amount - deductedPay)

            // ensures that the function ends and returns
            return
        }

        // runs if loan is below 0 or equal to 0
        this.balance += amount

    }

    this.GetNewLoanBalance = function () {
        if (this.loanAmount > 0) {
            return alert("You Cannot take more then one hold. pay your current one back before taking a new one")
        }

        const wantedLoanAmount = parseFloat(prompt("How much do you want to loan"))

        if (isNaN(wantedLoanAmount)) return false

        if ((wantedLoanAmount) > (this.balance * 2)) {
            return alert("Unable to provide loan, cannot be more then double your current balance")
        }

        this.loanAmount = parseFloat(this.loanAmount + wantedLoanAmount)
        this.balance = parseFloat(this.balance + wantedLoanAmount)
        return true
    }

    this.RepayLoan = function (amount) {

        if (amount > this.loanAmount) {

            let remainder = amount - this.loanAmount

            newWork.RemovePayBalance(amount)

            this.loanAmount -= this.loanAmount

            this.Deposit(remainder)

        }
        else if (this.loanAmount >= amount) {

            this.loanAmount -= amount
            newWork.RemovePayBalance(amount)
        }

    }

    this.WithDrawBalance = function (amount) { this.balance -= amount }
    this.GetBalance = function () { return this.balance }
    this.GetLoanBalance = function () { return this.loanAmount }

}


function Work() {

    let payBalance = 0

    this.AddToPayBalance = function (amount) { payBalance += amount }
    this.RemovePayBalance = function (amount) { return payBalance -= amount }
    this.GetPayBalance = function () { return payBalance }
}


const AddComputerToList = (data) => {
    
    data.forEach(element => {

        let newComputer = new Computers
            (
                id = element.id,
                title = element.title,
                description = element.description,
                specs = element.specs,
                price = element.price,
                stock = element.stock,
                active = element.active,
                image = element.image
            )

        const computerElement = document.createElement("option")
        computerElement.value = element.id
        computerElement.appendChild(document.createTextNode(element.title))
        computerList.appendChild(computerElement)

        computers.push(newComputer)
    });
    HandleDefaultSelectedComputer(computers)
}

const HandleFeatureList = (e) => {
    ClearInnerHtml(computerFeatures)

    const selectedComputer = computers[e.target.selectedIndex]
    currentOption = computers[e.target.selectedIndex]
    for (let index = 0; index < selectedComputer.specs.length; index++) {
        const element = document.createElement("li")
        element.value = index
        element.appendChild(document.createTextNode(selectedComputer.specs[index]))
        computerFeatures.appendChild(element)
    }

}

const HandleSelectedComputer = (e) => {
    const selectedComputer = computers[e.target.selectedIndex]
    currentOption = computers[e.target.selectedIndex]


    fetch("https://hickory-quilled-actress.glitch.me/" + selectedComputer.image, { method: "HEAD" })
        .then(res => {
            if (res.ok) {
                AddAttribute(computerImageSource, "src", "https://hickory-quilled-actress.glitch.me/" + selectedComputer.image)
            }
            else {
                toPng = selectedComputer.image.slice(0, -3)
                toPng += "png"
                AddAttribute(computerImageSource, "src", "https://hickory-quilled-actress.glitch.me/" + toPng)
            }
        })
        .catch(msg => console.log('Could not locate', msg))

    computerNameElement.innerHTML = selectedComputer.title
    computerDescriptionElement.innerHTML = selectedComputer.description
    computerPriceElement.innerHTML = parseFloat(selectedComputer.price).toFixed(2) + " DK"
}

const DoWork = () => {
    newWork.AddToPayBalance(100)
    UpdatePayDisplay()
}

const AddSalaryToBank = () => {
    newBankAccount.Deposit(newWork.GetPayBalance())
    newWork.RemovePayBalance(newWork.GetPayBalance())

    if (newBankAccount.GetLoanBalance() <= 0) {
        ChangeElementVisibility(repayLoanButtonElement, "hidden");
        ChangeElementVisibility(loanBalance, "hidden")
        ChangeElementVisibility(getLoanButtonElement, "visible");
    }

    UpdatePayDisplay()
    UpdateBankBalanceDisplay()
    UpdateLoanBalanceDisplay()
}

const GetLoan = () => {
    if (newBankAccount.GetNewLoanBalance() === true) {

        ChangeElementVisibility(repayLoanButtonElement, "visible");
        ChangeElementVisibility(loanBalance, "visible")
        ChangeElementVisibility(getLoanButtonElement, "hidden");

        UpdateLoanBalanceDisplay()
        UpdateBankBalanceDisplay()
    }
}

const PayLoan = () => {

    newBankAccount.RepayLoan(newWork.GetPayBalance())

    if (newBankAccount.GetLoanBalance() <= 0) {
        ChangeElementVisibility(repayLoanButtonElement, "hidden");
        ChangeElementVisibility(loanBalance, "hidden")
        ChangeElementVisibility(getLoanButtonElement, "visible");
    }

    UpdatePayDisplay()
    UpdateBankBalanceDisplay()
    UpdateLoanBalanceDisplay()

}

const UpdatePayDisplay = () => {
    paySalary.innerHTML = `Total Pay: ${newWork.GetPayBalance().toFixed(2)}`;
}

const UpdateBankBalanceDisplay = () => {
    totalBalance.innerHTML = `Total Balance: ${newBankAccount.GetBalance().toFixed(2)}`;
}

const UpdateLoanBalanceDisplay = () => {
    loanBalance.innerHTML = `Loan Balance: ${newBankAccount.GetLoanBalance().toFixed(2)}`;
}

const HandleDefaultSelectedComputer = (defaultComputer) => {
    currentOption = defaultComputer[0]

    for (let index = 0; index < defaultComputer[0].specs.length; index++) {
        const element = document.createElement("li")
        element.value = index
        element.appendChild(document.createTextNode(defaultComputer[0].specs[index]))
        computerFeatures.appendChild(element)
    }

    AddAttribute(computerImageSource, "src", "https://hickory-quilled-actress.glitch.me/" + defaultComputer[0].image)

    computerNameElement.innerHTML = defaultComputer[0].title
    computerDescriptionElement.innerHTML = defaultComputer[0].description
    computerPriceElement.innerHTML = parseFloat(defaultComputer[0].price).toFixed(2) + " DK"
}

const HandleBuyComputer = () => {
    if (newBankAccount.GetBalance() <= 0 || newBankAccount.GetBalance() < parseFloat(currentOption.price)) {
        return alert("You do Currently not have enough in your account. please transfer money to your bank account")
    }
    else {
        newBankAccount.WithDrawBalance(parseFloat(currentOption.price))
        UpdateBankBalanceDisplay()
        return alert("You are now the owner of " + currentOption.title)
    }
}

const newWork = new Work();
const newBankAccount = new Bank();

pay_salary_button.addEventListener("click", DoWork);
bankSalaryButton.addEventListener("click", AddSalaryToBank);
getLoanButtonElement.addEventListener("click", GetLoan);
repayLoanButtonElement.addEventListener("click", PayLoan);
computerList.addEventListener("change", HandleFeatureList);
computerList.addEventListener("change", HandleSelectedComputer);
computerBuyNowButton.addEventListener("click", HandleBuyComputer);

ChangeElementVisibility(repayLoanButtonElement, "hidden");
ChangeElementVisibility(loanBalance, "hidden")
