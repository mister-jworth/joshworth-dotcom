
// Simulation settings - UI to set these coming soon
let playbackSpeed = 200 // number of milliseconds between simulated days
let foundingMembers = 3 // number of people at the start of the sim
let stability = 0.95; // probability of people coming and going (0=none 1=high)
let growthRate = 0.5; // (not implemented yet)
let pledgeRate = .07 // percentage of income people pledge
let feeRate = .03 // we can break this into fee types later
let comingleRate = .01 // Comingle's operating fee
// Might Add some controls to play with the income style variations and possible events

// Declare some global variables
// not sure I need all these since some info is now being stored in objects
let share = 0; // The current value of a share
let currentWeek = 1; // The week number
let cominglesCash = 0; // "The Pot" - Simulated bank account 
let currentWeekObj = {} // An object to hold data for the current week
let members = {} // An object to hold all the members
let weekHistory = []; // An array to hold all the weeks
let simulationInterval; // whether the simulation is running
let isPlaying = false; // Tracks the simulation state (same thing?)



// Define what we need to know about a single member ID, name, status, incomeLevel, cashFlowStyle, minBankBalance
class Member {
    static lastId = 0; // for assigning IDs
    static idLength = 5; // Maximum number of digits in an ID
    constructor(name, status, incomeLevel, cashFlowStyle, minBankBalance) {
        Member.lastId++; // Increment and assign the ID
        this.id = Member.lastId.toString().padStart(Member.idLength, '0'); // Format the ID; 
        this.name = name; // Give them a name? 
        this.quote = "I joined"; // what's up with this memmber?
        this.status = status; // preview, active
        this.weeksPaused = 0;
        this.statusTracker = []; // Array to track status for each day of the week
        this.incomeLevel = incomeLevel; // high, med, low
        this.cashFlowStyle = cashFlowStyle;
        this.income = 0;  // their income for the day
        this.pledge = 0;  // their pledge for the day
        this.payOut = 0; // their payout
        this.adjustment = 0;  // their adjustments for the day (WIP)
        this.balance = 0; // their balance at present - never zeroes out. (pos = $ we owe them / neg = $ they owe / debt) 
        this.weekIncome = 0; // their post-tax income for the week (Income Cleared spreadsheet)
        this.weekPledges = 0 // their total pledges for the week (Pledges Owed from spreadsheet)
        this.weekAdjustments = 0 // their adjustments for the week
        this.minBankBalance = minBankBalance; // their post-tax income for the week
        this.currentBankBalance = 0; // the amount that's in their bank when we check
        this.transferAmount = 0; // the amount being sent or received (pos = $ given / neg = $ gotten)
        this.carryover = 0 // any non-zero amount remaining in their balance after a transfer
        this.allTimeIncome = 0 // records cumulative income (doesn't zero out after the week)
        this.allTimeTransfers = 0 // records cumulative transfers (pos = net giver / neg = net getter)
        this.personalImpact = 0 // the difference between their cumulative Income and cumulative Transfers, represented as a perentage 
        this.historicAnnualIncome = 0 // we'll need this for waitlisting
        this.memberHistory = {}; // Object to store weekly data snapshots for the member 
    }
    // Method to update income and related stats
    updateIncome() {
        let baseIncome = generateIncome(this.incomeLevel); //give them some semi-realistic money
        this.income = baseIncome;
        this.pledge = Math.round(this.income * pledgeRate) // calculate the pledge
        this.balance -= this.pledge; // Update balance by subtracting the pledge amount
        this.weekIncome += this.income; // add new income to total for the week
        this.weekPledges += this.pledge; // add new pledge to total for the week
        this.weekAdjustments += this.adjustment; // add new adjustment to total for the week
        this.allTimeIncome += this.income; // add new income to cumulative total
    }
    // Method to update the quote based on where they stand relative to the average income
    updateQuote(avgBalance) { 
        this.quote = this.balance < avgBalance ? "I HAVE $" : "I NEED $";      
    }
    // Method to track if they've been active the whole week
    trackStatus(dayOfWeek, status) {
        this.statusTracker[dayOfWeek] = status;
    }
    // Method to save the current week's data for this member
     saveWeeklyData(weekNumber) {
        this.memberHistory[weekNumber] = {
        weekBalance: this.balance,
        weekIncome: this.weekIncome,
        weekPledges: this.weekPledges,
        payOut: this.payOut
        };
        }

    // Method to reset weekly values
    resetWeeklyStats() {
        this.weekIncome = 0;
        this.weekPledges = 0;
        this.payOut = 0;
        this.weekAdjustments = 0;
    }
}

// Function to create however many new simulated members
function generateMembers(numberOfMembers) {
    const names = ["Alice", "Bob", "Charlie", "Dave", "Eve"]; // Example names
    const status = "active"; // Assuming all members initially active
    const incomeLevels = ["low", "medium", "high"]; // we can get fancier with how we define this later. Might be handy for waitlisting.
    const cashFlowStyles = ["steady", "sporadic","infrequent"]; // we can get fancier with how we define this later
    for (let i = 0; i < numberOfMembers; i++) {
        const ID = (i + 1);
        const name = names[i % names.length] + (i + 1); // Append a number to ensure unique names
        const incomeLevel = incomeLevels[Math.floor(Math.random() * incomeLevels.length)]; // Picks a random high/medium/ low income level
        const cashFlowStyle = cashFlowStyles[Math.floor(Math.random() * cashFlowStyles.length)]; // Picks a random cash flow style
        const minBankBalance = Math.floor(Math.random() * ((5000 - 50) / 50 + 1)) * 50 + 50;
        // Create a new Member instance
        members[ID] = new Member(name, status, incomeLevel, cashFlowStyle, minBankBalance);
    }
    return members;
}

// Function to generate simulated income with 0 occurring most frequently
// REFINE ALL THIS
function generateIncome(incomeLevel) {
    // Basic income generation logic
    let income = Math.random() < 0.8 ? 0 : Math.random() * 1000;
    // Adjust income based on income level
    switch (incomeLevel) {
        case "high":
            income *= 1.5; // Increase for high income level
            break;
        case "medium":
            // Medium income remains as calculated
            break;
        case "low":
            income *= 0.5; // Decrease for low income level
            break;
    }
    return Math.round(income);
}

// Define what we need to know about a week
class Week {
    constructor(number) {
        this.weekNumber = number; // give the week a number
        this.totalIncome = 0; // total of everyone's income
        this.totalPledges = 0; // total of everyone's pledges
        this.totalMembers = foundingMembers;
        this.activeMembers = foundingMembers; // number of active members (we'll need to track other statuses too)
        this.newMembers = foundingMembers; // number of brand new or reactivated members
        this.pausedMembers = 0; // number of paused members
        this.suspendedMembers = 0; // number of brand new or reactivated members
        this.activeAllWeek = 0; // number of members who were active with no interruptions
        this.participants = 0; // number of members who were entitled to a payout (needs better definition) 
        this.share = 0; // totalPledges divided by number of active members (dividend)
        this.cashIn = 0; // transfers received from givers
        this.payout = 0; // cashCollected divided by number of active members
        this.startingCash = 0; //Comingle bank balance before payout
        this.startingBalance = 0; //Comingle ledger balance before transfer
        this.endingCash = 0; //Comingle bank balance after cash in and fees and
        this.cashOut = 0; // transfers sent to getters
        this.drift = 0; // difference between the payout and cash sent
        this.netTransfer = 0; // the difference between collected and sent
        this.getters = 0; // members who received money
        this.givers = 0;  // members who gave money
        this.transferFees = 0; // amount spent on 3rd party fees
        this.comingleFees = 0; // amount held for overhead
        this.subsidy = 0; // bonus cash from non-members - SIMULATE LATER
        this.netBalance = 0; //cumulative member balance
        this.timeToClear = 0; //time from start of transfer in to end of transfer out
        this.carryOver = 0; //unresolved balance
    }
    
    // keep a running tally of member data for the week
    updateWeekTotals(members) {
        Object.values(members).forEach(member => {
        this.totalIncome += member.weekIncome;
        this.totalPledges += member.weekPledges;  
        this.share = this.totalPledges/this.activeMembers; 
        this.netBalance += member.balance;
        });
    }
    // calculate stats for the week
    logWeekStats() {
       //this.cashCollected = 0; 
        //this.payout = 0; 
        //this.cashSent = 0; 
        //this.drift = 0;
        //this.netTransfer += member.transfer; 
        //this.getters = 0; 
        //this.givers = 0; 
        //this.fees = 0; 
        //this.subsidy = 0;
    }

    countMembers(members) {
        // Reset counts
        this.totalMembers = Object.keys(members).length;
        this.activeMembers = 0;
        this.newMembers = 0;
        this.pausedMembers = 0;
        this.suspendedMembers = 0;
        this.activeAllWeek = Object.keys(members).length;

        Object.values(members).forEach(member => {
            // Increment counters based on member status
            if (member.status === 'active') {
                this.activeMembers++;
            }
            if (member.status === 'paused') {
                this.pausedMembers++;
            }
            if (member.status === 'suspended') {
                this.suspendedMembers++;
            }
            /* Assuming statusTracker exists and tracks daily status
            if (Object.values(member.statusTracker).every(status => status === 'active')) {
                this.activeAllWeek++;
            } */
        });
    }}

// Object to keep track of cumulative global stats
class AllTimeStats {
    constructor() {
        this.totalIncome = 0; // grand total of everyone's income
        this.totalPledges = 0; // grand total of everyone's pledges
        //this.activeMembers = 0; // number of active member (we'll need to track other statuses too)
        //this.averageshare = 0; 
        this.cashCollected = 0; // grand total of transfers received from givers
        //this.payout = 0; // cashCollected divided by number of active members
        this.cashSent = 0; // grand total of transfers sent to getters
        //this.drift = 0; // difference between the payout and cash sent
        this.netTransfer = 0; // the difference between collected and sent
        this.getters = 0; // members who received money
        this.givers = 0;  // members who gave money
        this.fees = 0; // grand total of amount spent on fees
        this.subsidy = 0; // grand total of all bonus cash from non-members
    }
}

// Initialize the simulation start date
let currentDate = new Date('2024-01-01');

// Function to format date into dd/mm/yy
function formatDate(date) {
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let dd = String(date.getDate()).padStart(2, '0');
    let yy = date.getFullYear().toString().substr(-2);
    return `${mm}/${dd}/${yy}`;
}

// Function to get the name of the day from a Date object
function getDayName(date) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[date.getDay()];
}

// ------------------
// SIMULATE ONE DAY
// ------------------
function simulateStep() {
    // Label the day
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    const dayName = getDayName(currentDate);
    const formattedDate = formatDate(currentDate);
    // simulate money showing up in member's banks
    Object.values(members).forEach(member => {
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            member.income = 0; // No events get recorded on weekends (might need to allow for weekend adjustments)
        } else {
            member.updateIncome(); // Run this method to update everyone's stats
        }
        const averageBalance = Object.values(members).reduce((acc, member) => acc + member.balance, 0) / Object.keys(members).length;
        member.updateQuote(averageBalance);
        member.trackStatus(dayOfWeek, member.status)
        //update the totals for the week
    });
    updateDate (dayName, formattedDate); // Update the date stamp
    currentWeekObj.countMembers(members);
    currentWeekObj.updateWeekTotals(members);
    displayDataRow(currentWeekObj, currentWeekSummaryData, 'current-week-summary', '.table-row');
    displayDataMemberRows(members, currentMemberActivityData, 'current-member-activity', '.member-activity-data');
    // Perform week closing actions after Saturday
    if (dayOfWeek === 6) { // after Saturday
        CloseWeek();
    }
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
}
//
//
// SIMULATE LOST CONNECTIONS
function randomlyPauseMembers() {
    Object.values(members).forEach(member => {
        // Assuming stability ranges from 0 to 1, where 1 is very stable (low chance of pausing)
        if (Math.random() > stability) { // Lower stability increases chance of pausing
            if (member.status === "active") {
                member.status = "paused";
                member.weeksPaused = (member.weeksPaused || 0) + 1; // Initialize or increment weeksPaused
            }
        } else if (member.status === "paused" && Math.random() > stability) { // Also consider reactivation
            member.status = "active";
            member.weeksPaused = 0; // Reset weeksPaused when reactivated
        }
        // Increment weeksPaused without changing status if still paused
        else if (member.status === "paused") {
            member.weeksPaused = (member.weeksPaused || 0) + 1;
        }
    });
}

function handlePausedMembers() {
    Object.values(members).forEach(member => {
        if (member.status === "paused" && member.weeksPaused > 8) {
            member.status = "suspended";
        }
    });
}


function CloseWeek() {
    currentWeekObj.activeMembers = 3;
     // Check and handle paused members before issuing payouts
    handlePausedMembers();
     if (currentWeek > 1) {
        IssuePayout();
    }
    CalculateTransfer();
    ConductTransfer();
    
    // Store the current week's data
    createWeekReportTables(currentWeek);
    displayTableHeaders(payoutReportHeaders, 'payoutReport-' + currentWeek, '.table-header');
    displayDataRow(currentWeekObj, payoutReportData, 'payoutReport-' + currentWeek, '.table-row')
    displayTableHeaders(transferReportHeaders, 'transferReport-' + currentWeek, '.table-header');
    displayDataRow(currentWeekObj, transferReportData, 'transferReport-' + currentWeek, '.table-row')
    displayTableHeaders(membershipSummaryReportHeaders, 'memberReport-' + currentWeek, '.member-summary-header');
    displayDataRow(currentWeekObj, membershipSummaryReportData, 'memberReport-' + currentWeek, '.member-summary-row');
    displayTableHeaders(membershipDetailReportHeaders, 'memberDetail-' + currentWeek,'.member-detail-header');
    displayDataMemberRows(members, membershipDetailData, 'memberDetail-' + currentWeek,'.member-activity-data');
    // store the week in the week history
    weekHistory[currentWeek] = currentWeekObj;
    // Store each member's current week data and reset it
    Object.values(members).forEach(member => {
        member.saveWeeklyData(currentWeek); 
        member.resetWeeklyStats();
        member.statusTracker = []; // Clear the daily statuses
    });
    // Move to the next week
    currentWeek++;
    currentWeekObj = new Week(currentWeek);
}

function IssuePayout() {
    //REFINE THIS Count the active and paused members
    let activeMemberCount = Object.values(members).filter(member => member.status === "active" || member.status === "paused").length;
    currentWeekObj.activeMembers = activeMemberCount; //update the week record
    currentWeekObj.participants = activeMemberCount; //REFINE THIS
    //
    //CALCULATE THE PAYOUT
    //
    currentWeekObj.startingCash = cominglesCash
    let payout = currentWeekObj.netBalance / activeMemberCount;
    // log the pre-payout stats
    //currentWeekObj.startingCash = cominglesCash;
    //currentWeekObj.startingBalance = cominglesCash;
    //apply the Payout to everyone's balance
    Object.values(members).forEach(member => {
        //issue a payout to anyone who isn't suspended 
        if (member.status === "active" || (member.status === "paused" && member.weeksPaused <= 8)) {
            member.balance += payout; // Update balance with the share from Comingle's Cash
            currentWeekObj.netBalance -= payout; // Subtract the share from Comingle's Cash
        }
    });
    // Log the payout
    currentWeekObj.payout = payout;

}

function CalculateTransfer() {
    Object.values(members).forEach(member => {
        // Calculate the amount needed to bring the balance to 0
        currentWeekObj.startingBalance = currentWeekObj.netBalance;
        let transferAmount = -member.balance; // Negate the balance to calculate transfer amount
        if (transferAmount < 0) {
            // Member receives money
            member.quote = "I GOT $";
            currentWeekObj.getters += 1;
            currentWeekObj.netTransfer += transferAmount;
            currentWeekObj.cashOut += Math.abs(transferAmount);
            cominglesCash -= transferAmount; // Decrease cominglesCash as it's paying out
        } else if (transferAmount > 0) {
            // Member gives money
            member.quote = "I GAVE $";
            currentWeekObj.givers += 1;
            currentWeekObj.netTransfer -= transferAmount;
            currentWeekObj.cashIn += Math.abs(transferAmount);
            cominglesCash += transferAmount; // Increase cominglesCash as it's collecting
        } // No action needed if transferAmount is 0

        // Apply transfer to balance
        member.balance += transferAmount;
        // log transfer to member totals
        member.transferAmount = transferAmount;
        const fees = Math.abs(transferAmount)*.03;
        currentWeekObj.transferFees += fees;
    });
    cominglesCash -= currentWeekObj.transferFees
    currentWeekObj.comingleFees = cominglesCash*.01;
    cominglesCash -= currentWeekObj.comingleFees;
    currentWeekObj.netBalance = cominglesCash;
    currentWeekObj.carryOver = currentWeekObj.netBalance;
    currentWeekObj.drift = currentWeekObj.share - currentWeekObj.payout 
    /* Did cash go negative?
    const cashInBankElement = document.getElementById('cashInBank');
    if (cominglesCash < 0) {
        cashInBankElement.style.color = 'red'; // Set text color to red if cominglesCash is negative
        stopSimulation();
    } else {
        cashInBankElement.style.color = 'black'; // Otherwise, set it to black (or any default color you prefer)
    } */
}

function ConductTransfer() {
    // Placeholder for ConductTransfer logic
}


// DEFINE TABLE HEADERS AND DATA
//
 let currentWeekSummaryHeaders = [ 
    {headerText: "Total Members", styleClass: 'cell-text'},
    {headerText: "Active", styleClass: 'centered'},
    {headerText: "Newly Active", styleClass: 'centered'},
    {headerText: "Paused", styleClass: 'centered'},
    {headerText: "Suspended", styleClass: 'centered'},
    {headerText: "Total Income", styleClass: 'cell-currency'},
    {headerText: "Total Pledges", styleClass: 'cell-currency'},
    {headerText: "Share Value", styleClass: 'cell-currency'},
    {headerText: "Net Balance", styleClass: 'cell-currency'}
    ];   
 let currentWeekSummaryData = [
    { property: 'totalMembers', format: 'number', styleClass: 'cell-text' },
    { property: 'activeMembers', format: 'number', styleClass: 'centered' },
    { property: 'newMembers', format: 'number', styleClass: 'centered' },
    { property: 'pausedMembers', format: 'number', styleClass: 'centered' },
    { property: 'suspendedMembers', format: 'number', styleClass: 'centered' },
    { property: 'totalIncome', format: 'currency', styleClass: 'cell-currency' },
    { property: 'totalPledges', format: 'amount', styleClass: 'cell-currency' },
    { property: 'share', format: 'amount', styleClass: 'cell-currency' },
    { property: 'netBalance', format: 'amount', styleClass: 'cell-currency' }
 ];

 let currentMemberActivityHeaders = [ 
    {headerText: "Member ID", styleClass: 'cell-text'},
    {headerText: " ", styleClass: 'centered'},
    {headerText: "Status", styleClass: 'centered'},
    {headerText: "Annual Income", styleClass: 'centered'},
    {headerText: "Cash Flow", styleClass: 'centered'},
    {headerText: "Income", styleClass: 'align-right'},
    {headerText: "Pledges", styleClass: 'align-right'},
    {headerText: "Adjustments", styleClass: 'align-right'},
    {headerText: "Balance", styleClass: 'align-right'}
 ]; 
let currentMemberActivityData = [ 
    { property: 'id', format: 'text', styleClass: 'cell-text' },
    { property: 'quote', format: 'text', styleClass: 'centered' },
    { property: 'status', format: 'text', styleClass: 'centered' },
    { property: 'incomeLevel', format: 'text', styleClass: 'centered' },
    { property: 'cashFlowStyle', format: 'text', styleClass: 'centered' },
    { property: 'weekIncome', format: 'currency', styleClass: 'cell-currency' },
    { property: 'weekPledges', format: 'amount', styleClass: 'cell-currency' },
    { property: 'weekAdjustments', format: 'amount', styleClass: 'cell-currency' },
    { property: 'balance', format: 'amount', styleClass: 'cell-currency' }
];

let payoutReportHeaders = [ 
    {headerText: "Starting Ca$h", styleClass: 'align-right'},
    {headerText: "Subsidy", styleClass: 'align-right'},
    {headerText: "Participants", styleClass: 'centered'},
    {headerText: "Payout", styleClass: 'align-right'},
    {headerText: "Share Value", styleClass: 'align-right'},
    {headerText: "Drift", styleClass: 'align-right'},
    {headerText: "Ending Ca$h", styleClass: 'align-right'}
 ]; 
let payoutReportData = [ 
    { property: 'startingCash', format: 'currency', styleClass: 'cell-currency' },
    { property: 'subsidy', format: 'amount', styleClass: 'align-right' },
    { property: 'participants', format: 'number', styleClass: 'centered' },
    { property: 'payout', format: 'amount', styleClass: 'align-right' },
    { property: 'share', format: 'amount', styleClass: 'align-right' },
    { property: 'drift', format: 'amount', styleClass: 'cell-currency' },
    { property: 'endingCash', format: 'currency', styleClass: 'cell-currency' }
];

let transferReportHeaders = [ 
    {headerText: "Starting Balance", styleClass: 'align-right'},
    {headerText: "Pledges", styleClass: 'align-right'},
    {headerText: "Participants", styleClass: 'centered'},
    {headerText: "Share Value", styleClass: 'align-right'},
    {headerText: "$ In", styleClass: 'align-right'},
    {headerText: "$ Out", styleClass: 'align-right'},
    {headerText: "Net Transfer", styleClass: 'align-right'},
    {headerText: "Transfer Fees", styleClass: 'align-right'},
    {headerText: "Comingle Fees", styleClass: 'align-right'},
    {headerText: "Time to Clear", styleClass: 'align-right'},
    {headerText: "Carryover", styleClass: 'align-right'}
 ]; 
let transferReportData = [ 
    { property: 'startingBalance', format: 'currency', styleClass: 'cell-currency' }, //logged in IssuePayout()
    { property: 'totalPledges', format: 'amount', styleClass: 'align-right' }, //logged in updateWeekTotals()
    { property: 'participants', format: 'number', styleClass: 'centered' }, //logged in IssuePayout()
    { property: 'share', format: 'amount', styleClass: 'align-right' }, //logged in updateWeekTotals()
    { property: 'cashIn', format: 'currency', styleClass: 'cell-currency' }, //logged in CalculateTransfer()
    { property: 'cashOut', format: 'currency', styleClass: 'cell-currency' }, //logged in CalculateTransfer()
    { property: 'netTransfer', format: 'currency', styleClass: 'cell-currency' }, //logged in CalculateTransfer()
    { property: 'transferFees', format: 'currency', styleClass: 'cell-currency' }, // TO-DO
    { property: 'comingleFees', format: 'amount', styleClass: 'cell-currency' }, //logged in CalculateTransfer()
    { property: 'timeToClear', format: 'amount', styleClass: 'cell-currency' }, //Figure out how to simulate this
    { property: 'carryOver', format: 'amount', styleClass: 'cell-currency' }, //logged in CalculateTransfer()
];

let membershipSummaryReportHeaders = [ 
    {headerText: "Total Members", styleClass: 'centered'},
    {headerText: "Active", styleClass: 'centered'},
    {headerText: "Newly Active", styleClass: 'centered'},       
    {headerText: "Paused", styleClass: 'centered'},
    {headerText: "Suspended", styleClass: 'centered'},
    {headerText: "Active All Week", styleClass: 'centered'}, 
    {headerText: "Avg Income", styleClass: 'align-right'},
    {headerText: "Avg Impact", styleClass: 'align-right'},
    {headerText: "Givers", styleClass: 'centered'},
    {headerText: "Getters", styleClass: 'centered'},
 ]; 
let membershipSummaryReportData = [ 
    { property: 'members', format: 'number', styleClass: 'centered' },
    { property: 'active', format: 'number', styleClass: 'centered' },
    { property: 'newlyActive', format: 'number', styleClass: 'centered' },
    { property: 'paused', format: 'number', styleClass: 'centered' },
    { property: 'suspended', format: 'number', styleClass: 'centered' },
    { property: 'participants', format: 'number', styleClass: 'centered' },
    { property: 'avgIncome', format: 'amount', styleClass: 'cell-currency' },
    { property: 'AvgImpact', format: 'amount', styleClass: 'cell-currency' },
    { property: 'givers', format: 'number', styleClass: 'centered' },
    { property: 'getters', format: 'number', styleClass: 'centered' },
];
let membershipDetailReportHeaders = [ 
    {headerText: "Member ID", styleClass: 'cell-text'},
    {headerText: "Impact", styleClass: 'centered'},
    {headerText: "Status", styleClass: 'centered'},       
    {headerText: "% of All Income", styleClass: 'centered'},
    {headerText: "Cash Flow", styleClass: 'centered'},
    {headerText: "Pledges", styleClass: 'align-right'}, 
    {headerText: "Adjustments", styleClass: 'align-right'},
    {headerText: "Balance In", styleClass: 'align-right'},
    {headerText: "$ in Bank?", styleClass: 'centered'},
    {headerText: "Transfer", styleClass: 'align-right'},
    {headerText: "Time to Clear", styleClass: 'centered'},
    {headerText: "Balance Out", styleClass: 'align-right'},
 ]; 
 let membershipDetailData = [ 
    { property: 'id', format: 'text', styleClass: 'cell-text' },
    { property: 'personalImpact', format: 'text', styleClass: 'centered' },
    { property: 'status', format: 'text', styleClass: 'centered' },
    { property: 'incomeShare', format: 'amount', styleClass: 'centered' },
    { property: 'cashFlowStyle', format: 'text', styleClass: 'centered' },
    { property: 'weekPledges', format: 'amount', styleClass: 'cell-currency' },
    { property: 'weekAdjustments', format: 'amount', styleClass: 'cell-currency' },
    { property: 'balance', format: 'amount', styleClass: 'cell-currency' },
    { property: 'minBankBalance', format: 'amount', styleClass: 'cell-currency' },
    { property: 'transferAmount', format: 'amount', styleClass: 'cell-currency' },
    { property: 'timeToClear', format: 'text', styleClass: 'centered' },
    { property: 'balance', format: 'amount', styleClass: 'cell-currency' }
];


// ---------
// DISPLAY IT ALL

// build a new table for the week report (other tables are already in html)
function createWeekReportTables(weekNumber) {
    const parentContainer = document.getElementById("reportContainer"); // find main container for reports
    // Create a main container for the week's report
    const weekReportContainer = document.createElement("div");
    weekReportContainer.id = `weekReport-${weekNumber}`;
    weekReportContainer.classList.add("table-holder","table--week-report");
    
    const weekTitle = document.createElement("div");
    weekTitle.classList.add("title--report", "title--week");
    weekTitle.textContent = 'Week ' + weekNumber;
    weekReportContainer.appendChild(weekTitle);
    
    // Define titles and IDs for each table
    const tablesInfo = [
        { title: "Payout Report", idSuffix: "payoutReport" },
        { title: "Transfer Report", idSuffix: "transferReport" }
    ];
    
    // Create a container, header, and title for each table
    tablesInfo.forEach((tableInfo) => {
        // Title for the table
        const titleElement = document.createElement("div");
        titleElement.classList.add("title--report");
        titleElement.textContent = tableInfo.title;
        weekReportContainer.appendChild(titleElement);
        // Container for the table
        const tableContainer = document.createElement("div");
        tableContainer.id = `${tableInfo.idSuffix}-${weekNumber}`;
        tableContainer.classList.add("table");
        // Sub-containers for headers and rows
        const tableHeaderDiv = document.createElement("div");
        tableHeaderDiv.classList.add("table-header");
        const tableRowDiv = document.createElement("div");
        tableRowDiv.classList.add("table-row");

        tableContainer.appendChild(tableHeaderDiv);
        tableContainer.appendChild(tableRowDiv);
        // Append the table container to the week's report container
        weekReportContainer.appendChild(tableContainer);
    });
    createMemberReportSection(weekNumber, weekReportContainer);

    // Prepend the week's report container to the parent container
    parentContainer.prepend(weekReportContainer);
}

function createMemberReportSection(weekNumber, weekReportContainer) {
    // Special handling for the Member report, now encapsulated in this function
    const memberReportTitle = document.createElement("div");
    memberReportTitle.classList.add("title--report","accordion-toggle");
    memberReportTitle.textContent = "Member Report";
    weekReportContainer.appendChild(memberReportTitle);

    const memberReportContainer = document.createElement("div");
    memberReportContainer.id = `memberReport-${weekNumber}`; // Unique ID
    memberReportContainer.classList.add("table"); // need ro add "accordion-section" class to a container div

    // Container for the summary table
    const summaryHeaderDiv = document.createElement("div");
    summaryHeaderDiv.classList.add("table-header", "member-summary-header");
    const summaryRowDiv = document.createElement("div");
    summaryRowDiv.classList.add("table-row", "member-summary-row");

    const memberDetailContainer = document.createElement("div");
    memberDetailContainer.id = `memberDetail-${weekNumber}`; // Unique ID
    memberDetailContainer.classList.add("table", "accordion-content");

    // Container for the detailed activity table
    const detailHeaderDiv = document.createElement("div");
    detailHeaderDiv.classList.add("table-header", "member-detail-header");
    const detailRowDiv = document.createElement("div");
    detailRowDiv.classList.add("table-row", "member-activity-data");

    // Append the summary and detailed sections to the member report containers
    memberReportContainer.appendChild(summaryHeaderDiv);
    memberReportContainer.appendChild(summaryRowDiv);
    memberDetailContainer.appendChild(detailHeaderDiv); // Maybe add a title or separator if needed
    memberDetailContainer.appendChild(detailRowDiv);

    // Append the member report container to the week's report container
    weekReportContainer.appendChild(memberReportContainer);
    weekReportContainer.appendChild(memberDetailContainer);
}

function displayTableHeaders (headerList, tableID, selector){
    var tableHeaderDiv = document.getElementById(tableID).querySelector(selector);
    tableHeaderDiv.innerHTML = '';
    Object.values(headerList).forEach(headerValue => {
        const headerCell = document.createElement('span');
        headerCell.classList.add(headerValue.styleClass);
        let content = headerValue.headerText;
        headerCell.textContent = content != null ? content : '';
        tableHeaderDiv.appendChild(headerCell)
    })    
};
//display a single row of data
function displayDataRow (dataObject, dataList, tableID, selector){
    const tableRowDiv = document.getElementById(tableID).querySelector(selector);
    tableRowDiv.innerHTML = '';
    Object.values(dataList).forEach(dataItem => {
        const dataCell = document.createElement('span');
        dataCell.classList.add(dataItem.styleClass);
        let content;
            // Determine the format of the content
            switch (dataItem.format) {
                case 'currency':
                    content = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dataObject[dataItem.property]);
                    break;
                case 'amount':
                    content = new Intl.NumberFormat('en-US', { style: 'decimal',  maximumFractionDigits: 2, minimumFractionDigits: 2,}).format(dataObject[dataItem.property]);
                    break;
                case 'number':
                    content = new Intl.NumberFormat('en-US', { style: 'decimal',  maximumFractionDigits: 0, minimumFractionDigits: 0,}).format(dataObject[dataItem.property]);
                    break;                case 'text':
                default:
                    content = dataObject[dataItem.property];
            }
            dataCell.textContent = content != null ? content : '';
        tableRowDiv.appendChild(dataCell)
    })
}
//display multiple rows
function displayDataMemberRows(members, dataList, tableID, selector) {
    const tableDiv = document.getElementById(tableID).querySelector(selector);
    tableDiv.innerHTML = ''; 
    Object.values(members).forEach(member => {
        const memberRowDiv = document.createElement('div');
        memberRowDiv.classList.add('member-row'); // Add a class for styling?
        // Create a 'span' for each piece of data specified in the dataList array
        dataList.forEach(dataItem => {
            const dataSpan = document.createElement('span');
            dataSpan.classList.add(dataItem.styleClass);
            let content;
            // Determine the format of the content
            switch (dataItem.format) {
                case 'currency':
                    content = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(member[dataItem.property]);
                    break;
                case 'amount':
                    content = new Intl.NumberFormat('en-US', { style: 'decimal',  maximumFractionDigits: 2, minimumFractionDigits: 2,}).format(member[dataItem.property]);
                    break;
                case 'text':
                default:
                    content = member[dataItem.property];
            }
            dataSpan.textContent = content != null ? content : '';
            memberRowDiv.appendChild(dataSpan);
        });
        tableDiv.appendChild(memberRowDiv); // Append the new row div to the table row container
    });
}

// Function to update the date
function updateDate(day, date) {
    const dayField  = document.getElementById('currentDay'); //write today's date
    dayField.textContent = `${day}, ${date}`;
    document.getElementById('currentWeekNumber').textContent = currentWeekObj.weekNumber;
    }


//accordion header functionality
document.querySelectorAll('.accordion-section').forEach(toggle => {
    toggle.addEventListener('click', function() {
        // Target the sibling `.accordion-content` of this toggle
        const content = this.parentNode.querySelector('.accordion-content');
        // Toggle the content visibility
        if (content) {
            content.style.display = content.style.display === 'none' ? 'flex' : 'none';
            // Swap icons based on the content visibility
            const rightIcon = this.querySelector('.right-icon');
            const downIcon = this.querySelector('.down-icon');
            if (content.style.display === 'none') {
                rightIcon.style.display = 'inline-block';
                downIcon.style.display = 'none';
            } else {
                rightIcon.style.display = 'none';
                downIcon.style.display = 'inline-block';
            }
        }
    });
});

// SIMULATION PLAYBACK 

// Play button action
function playSimulation(playbackSpeed) {
    // Check if the simulation is already running
    if (!simulationInterval) {
        simulationInterval = setInterval(simulateStep, playbackSpeed); // Run at a particular speed
        document.getElementById('playButton').style.display = 'none'
        document.getElementById('pauseButton').style.display = 'inline-block'
    }
}

// Stop button action
function pauseSimulation() {
    document.getElementById('playButton').style.display = 'inline-block'
    document.getElementById('pauseButton').style.display = 'none';
    clearInterval(simulationInterval);
    simulationInterval = null; // Clear the interval ID
}

function setupPlaybackEventListeners() {
    document.getElementById('playButton').addEventListener('click', () => {
        playSimulation(playbackSpeed);
    });
    document.getElementById('pauseButton').addEventListener('click', () => {
        pauseSimulation();
    });
    document.getElementById('ffwdButton').addEventListener('click', () => {
        playSimulation(5);
    });
    document.getElementById('stepButton').addEventListener('click', () => {
        simulateStep();
    });
    document.getElementById('resetButton').addEventListener('click', () => {
        window.location.reload();
    });
}

// Function to initialize the simulation
function initSimulation() {
    // Generate 3 member instances
    generateMembers(foundingMembers);
    // Begin counting weeks 
    currentWeek = 1
    currentWeekObj = new Week(currentWeek);
    // Setup and display starting tables
    displayTableHeaders (currentWeekSummaryHeaders, 'current-week-summary', '.table-header')
    displayTableHeaders (currentMemberActivityHeaders, 'current-member-activity-headers', '.table-header')
}

// Start the simulation from scratch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initSimulation(); 
    setupPlaybackEventListeners(); 
});
