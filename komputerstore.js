
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
    // internal function for the bank to handle new loans
    this.GetNewLoanBalance = function () {
        // checks if loan is over 0 if so continue
        if (this.loanAmount > 0) {
            return alert("You Cannot take more then one hold. pay your current one back before taking a new one")
        }
        // stores the amount x wants to loan for later use
        const wantedLoanAmount = parseFloat(prompt("How much do you want to loan"))

        // checks if value actually contains anything or not and if not immediately return false
        if (isNaN(wantedLoanAmount)) return false

        // checks to see if the amount x wants to loan is not more then 2 times the balance, otherwise return a alert
        if ((wantedLoanAmount) > (this.balance * 2)) {
            return alert("Unable to provide loan, cannot be more then double your current balance")
        }

        // if all checks above succeed continue by adding the amount x wants to loan to their loan balance
        this.loanAmount = parseFloat(this.loanAmount + wantedLoanAmount)
        // adds the amount x wants to loan to bank balance
        this.balance = parseFloat(this.balance + wantedLoanAmount)
        
        return true
    }

    // internal function for bank to handle repaying the loan
    this.RepayLoan = function (amount) {
        // checks to see if the amount x wants to pay back is over the amount x already have 
        if (amount > this.loanAmount) {
            // stores the remainder of amount and current loan
            let remainder = amount - this.loanAmount
            // removes the amount from current pay
            newWork.RemovePayBalance(amount)
            // ensures that loan gets zeroed out
            this.loanAmount -= this.loanAmount
            // adds the remainder to the bank balance.
            this.Deposit(remainder)

        }
        // if above fails then check if the amount x has as loan is over the amount one wants to pay
        else if (this.loanAmount >= amount) {
            // removes amount from amount
            this.loanAmount -= amount
            //removes the amount from pay balance
            newWork.RemovePayBalance(amount)
        }

    }
    // defines functions to allow usage outside the object 
    this.WithDrawBalance = function (amount) { this.balance -= amount } // removes from balance based on amount
    this.GetBalance = function () { return this.balance } // returns current amount of balance
    this.GetLoanBalance = function () { return this.loanAmount } // returns current amount of loan

}

// defines object for work 
function Work() {
    // stores pay Balance
    let payBalance = 0

    // defines functions to allow usage outside the object 
    this.AddToPayBalance = function (amount) { payBalance += amount } // adds amount to pay balance
    this.RemovePayBalance = function (amount) { return payBalance -= amount } // removes pay based on amount
    this.GetPayBalance = function () { return payBalance } // returns current pay balance
}

// defines function for adding computers to a select list
const AddComputerToList = (data) => {
    // runs a foreach loop on element to create a new computer object and store that object into the computers array
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

        const computerElement = document.createElement("option") // creates a element called option
        computerElement.value = element.id // assign the id of the computer to the new element
        computerElement.appendChild(document.createTextNode(element.title)) // adds a new textnode with a computers name to the option element
        computerList.appendChild(computerElement) // adds the new element option to the select list 

        computers.push(newComputer) // adds the newComputer object to the array of computers
    });
    HandleDefaultSelectedComputer(computers) // defaults to the first computer in the array
}

const HandleFeatureList = (e) => {
    ClearInnerHtml(computerFeatures) // clears the inner html 

    const selectedComputer = computers[e.target.selectedIndex] // stores the selected computer
    currentOption = computers[e.target.selectedIndex] // stores the selected computer
    // runs through the specs of a computer
    for (let index = 0; index < selectedComputer.specs.length; index++) { 
        const element = document.createElement("li") // creates a new list element and store it
        element.value = index // give the element a value of index
        element.appendChild(document.createTextNode(selectedComputer.specs[index])) // creates a new text node with the text from computer specs based on the index
        computerFeatures.appendChild(element) // adds the element to the actual select list so it can be displayed
    }

}

const HandleSelectedComputer = (e) => {
    const selectedComputer = computers[e.target.selectedIndex] // stores the selected computer
    currentOption = computers[e.target.selectedIndex] // stores the selected computer 

    // checks to see if the given image exist with jpeg, if not then check for png
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

    computerNameElement.innerHTML = selectedComputer.title // sets the inner html to that of the computers name
    computerDescriptionElement.innerHTML = selectedComputer.description // sets a description of the computer
    computerPriceElement.innerHTML = parseFloat(selectedComputer.price).toFixed(2) + " DK" // sets the price of a computer and fixes it to a 2 decimal unit
}

const DoWork = () => {
    newWork.AddToPayBalance(100) // adds pay to pay balance
    UpdatePayDisplay() // updates the pay display
}

const AddSalaryToBank = () => {
    newBankAccount.Deposit(newWork.GetPayBalance()) // deposits the pay to the bank
    newWork.RemovePayBalance(newWork.GetPayBalance()) // removes pay from pay balance

    // checks to see if loan balance is 0 or below if not continue
    if (newBankAccount.GetLoanBalance() <= 0) {
        ChangeElementVisibility(repayLoanButtonElement, "hidden"); // changes the visibility of repay to hidden
        ChangeElementVisibility(loanBalance, "hidden") // changes the visibility of loan balance to hidden
        ChangeElementVisibility(getLoanButtonElement, "visible"); // changes the visibility of loan button to show
    }

    UpdatePayDisplay() // updates Pay UI
    UpdateBankBalanceDisplay() // updates bank balance UI
    UpdateLoanBalanceDisplay() // updates loan balance UI
}

const GetLoan = () => {
    if (newBankAccount.GetNewLoanBalance() === true) {

        ChangeElementVisibility(repayLoanButtonElement, "visible"); // changes the visibility of repay to show
        ChangeElementVisibility(loanBalance, "visible") // changes the visibility of loan balance to show
        ChangeElementVisibility(getLoanButtonElement, "hidden"); // changes the visibility of loan button to hidden

        UpdateBankBalanceDisplay() // updates bank balance UI
        UpdateLoanBalanceDisplay() // updates loan balance UI
    }
}

const PayLoan = () => {

    newBankAccount.RepayLoan(newWork.GetPayBalance())

    if (newBankAccount.GetLoanBalance() <= 0) {
        ChangeElementVisibility(repayLoanButtonElement, "hidden"); // changes the visibility of repay to hidden
        ChangeElementVisibility(loanBalance, "hidden") // changes the visibility of loan balance to hidden
        ChangeElementVisibility(getLoanButtonElement, "visible"); // changes the visibility of loan button to show
    }

    UpdatePayDisplay() // updates Pay UI
    UpdateBankBalanceDisplay() // updates bank balance UI
    UpdateLoanBalanceDisplay() // updates loan balance UI

}

const UpdatePayDisplay = () => {
    paySalary.innerHTML = `Total Pay: ${newWork.GetPayBalance().toFixed(2)}`; // Updates the UI and sets the value based on pay balance and calls toFixed in order to only show 2 Decimal units
}

const UpdateBankBalanceDisplay = () => {
    totalBalance.innerHTML = `Total Balance: ${newBankAccount.GetBalance().toFixed(2)}`;// Updates the UI and sets the value based on  balance and calls toFixed in order to only show 2 Decimal units
}

const UpdateLoanBalanceDisplay = () => {
    loanBalance.innerHTML = `Loan Balance: ${newBankAccount.GetLoanBalance().toFixed(2)}`; // Updates the UI and sets the value based on loan balance and calls toFixed in order to only show 2 Decimal units
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

// Stores a new Work Object for global use
const newWork = new Work();
// Stores a Bank Object for global use
const newBankAccount = new Bank();

//#region Event Listeners
pay_salary_button.addEventListener("click", DoWork);
bankSalaryButton.addEventListener("click", AddSalaryToBank);
getLoanButtonElement.addEventListener("click", GetLoan);
repayLoanButtonElement.addEventListener("click", PayLoan);
computerList.addEventListener("change", HandleFeatureList);
computerList.addEventListener("change", HandleSelectedComputer);
computerBuyNowButton.addEventListener("click", HandleBuyComputer);
//#endregion

// calls a function to change the desired element visibility 
ChangeElementVisibility(repayLoanButtonElement, "hidden"); // changes the repay button to be hidden
ChangeElementVisibility(loanBalance, "hidden") // changes the loan balance text to be hidden
