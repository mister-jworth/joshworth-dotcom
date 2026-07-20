// Version note: BALANCED uses % comparison between capacity and a shoppers items

let myFont = 'Instrument Sans';
let currentTime = 0;
let growthSpeedSlider, playbackSpeedSlider, cutToleranceSlider;

let robotCapacityFCFS = 0;
let robotCapacityCuts = 0;
let robotCapacityBalanced = 0;

let peopleFCFS = [];
let peopleCuts = [];
let peopleBalanced = [];

let totalWaitTimeFCFS = 0;
let totalWaitTimeCuts = 0;
let totalWaitTimeBalanced = 0;

let averageWaitTimeFCFS = 0;
let averageWaitTimeCuts = 0;
let averageWaitTimeBalanced = 0;

let processedCountFCFS = 0; // Count of processed shoppers for FCFS
let processedCountCuts = 0; // Count of processed shoppers for Cuts Allowed
let processedCountBalanced = 0;

let totalShoppersProcessed = 0; // Track total shoppers processed
let initialCrowdsize = 40; // Initial crowd size

let cutsCountCuts = 0; // Count of cuts 
let cutsCountBalanced = 0;

let checkedOutFCFS = [];
let checkedOutCuts = [];
let checkedOutBalanced = [];

let canMoveFCFS = true; // Flag to control bar movement for FCFS
let canMoveCuts = true; // Flag to control bar movement for Cuts Allowed
let canMoveBalanced = true; // Flag to control bar movement for Cuts Allowed

let canvasHeight, canvasWidth; // dimensions of the canvas 
let visualizationWidth, visualizationHeight; // the overall dimensions of each viz
let chartHeight, chartWidth; // dimensions of just the chart part
let titleHeight = 80; // size of title area for each viz
let controlHeight = 80; // size of space for bottom controls
let barWidth = 20; // size of each bar bottom controls
let gapWidth = 3; // gap between bars 
let columnWidth = barWidth + gapWidth;

let visualizationCount = 3; // Three copies of the visualization for comparison

// Cut settings for balanced method
let jumpLimit = 10 //number of places a person can jump ahead
let maxCutsAllowed = 10; // number of times a person can be cut in front of
let thresholdFactor = 2.5; // How much of a difference between a persons items and threshold allows for cuts
//


function setup() {
  canvasWidth = windowWidth - (windowWidth * 0.03);
  canvasHeight = windowHeight - (windowHeight * 0.03);
  createCanvas(canvasWidth, canvasHeight);
  visualizationWidth = width;
  visualizationHeight = (canvasHeight - controlHeight) / visualizationCount;
  chartWidth = canvasWidth;
  chartHeight = visualizationHeight - titleHeight;

  // Create sliders to control growth and playback speeds
  growthSpeedSlider = createSlider(1, 100, 10); // Number of possible new items to add to threshold per cycle
  cutToleranceSlider = createSlider(0, initialCrowdsize, 10)
  playbackSpeedSlider = createSlider(1, 60, 10); // Playback speed from 1 to 60
  growthSpeedSlider.position(canvasWidth / 4 - 100, canvasHeight - 50); // Position for Growth speed slider
  growthSpeedSlider.addClass("sliderStyle");
  cutToleranceSlider.position(2 * canvasWidth / 4 - 100, canvasHeight - 50); // Position for Playback speed slider
  cutToleranceSlider.addClass("sliderStyle");
  playbackSpeedSlider.position(3 * canvasWidth / 4 - 100, canvasHeight - 50); // Position for Playback speed slider
  playbackSpeedSlider.addClass("sliderStyle");
  // Initialize the queues with the initial crowd size
  initializeCrowd(initialCrowdsize);
}

function initializeCrowd(crowdsize) {
  for (let i = 0; i < crowdsize; i++) {
    addNewShopper(i + 1); // Initialize shoppers with unique positions
  }
}

function addNewShopper(position) {
  let personFCFS = {
    items: Math.floor(random(1, 101)),
    waitTime: 0,
    originalPosition: position,
    processed: false,
    cutCount: 0  // Initialize cut counter
  };
  let personCuts = { ...personFCFS }; // Clone the people and their items for the other tests
  let personBalanced = { ...personFCFS };

  peopleFCFS.push(personFCFS);
  peopleCuts.push(personCuts);
  peopleBalanced.push(personBalanced);
}


function draw() {
  background(0); 

  // Adjust the frame rate according to the playback speed slider
  frameRate(playbackSpeedSlider.value());

  // Update robot capacities
  let capacityIncrease = Math.floor(random(1, growthSpeedSlider.value()));
  robotCapacityFCFS += capacityIncrease;
  robotCapacityCuts += capacityIncrease;
  robotCapacityBalanced += capacityIncrease;


   // Update cuts tolerance
   let cutTolerance = cutToleranceSlider.value();
   jumpLimit = cutTolerance;
   maxCutsAllowed += cutTolerance/2;
   //thresholdFactor += capacityIncrease; // map this value
   console.log(jumpLimit)

  // Process shoppers based on all methods
  processShoppersFCFS();
  processShoppersCutsAllowed();
  processShoppersBalanced();

  // Display the visualizations for both methods
  displayVisualization(0, "FCFS", peopleFCFS, checkedOutFCFS, robotCapacityFCFS, totalWaitTimeFCFS, averageWaitTimeFCFS, processedCountFCFS, canMoveFCFS, 0);
  displayVisualization(1, "Cuts Allowed", peopleCuts, checkedOutCuts, robotCapacityCuts, totalWaitTimeCuts, averageWaitTimeCuts, processedCountCuts, canMoveCuts, cutsCountCuts);
  displayVisualization(2, "Balanced", peopleBalanced, checkedOutBalanced, robotCapacityBalanced, totalWaitTimeBalanced, averageWaitTimeBalanced, processedCountBalanced, canMoveBalanced, cutsCountBalanced);

  // Display the labels for the sliders
  fill(150);
  textSize(13);
  textFont(myFont);
  textAlign(LEFT);
  text("Growth speed", growthSpeedSlider.x, canvasHeight - 30);
  text("Cuts tolerance", cutToleranceSlider.x, canvasHeight - 30);
  text("Playback speed", playbackSpeedSlider.x , canvasHeight - 30);
}
////////////////////////////////
function processShoppersFCFS() {
  // Increment the wait time for all people in the FCFS queue
  for (let i = 0; i < peopleFCFS.length; i++) {
    peopleFCFS[i].waitTime++;
  }

  // Process the first person if they can pass the barrier in the FCFS method
  if (peopleFCFS.length > 0) {
    let firstPerson = peopleFCFS[0];
    if (robotCapacityFCFS >= firstPerson.items) {
      robotCapacityFCFS -= firstPerson.items;
      totalWaitTimeFCFS += firstPerson.waitTime;
      firstPerson.processed = true;
      checkedOutFCFS.push(peopleFCFS.shift());
      processedCountFCFS++;
      canMoveFCFS = true;
    } else {
      canMoveFCFS = false;
    }
  }

  currentTime++;
  calculateStatisticsFCFS();
}
////////////////////////////////
function processShoppersCutsAllowed() {
  // Increment the wait time for all people in the Cuts Allowed queue
  for (let i = 0; i < peopleCuts.length; i++) {
    peopleCuts[i].waitTime++;
  }

  // Look for the first eligible person who can be processed in the Cuts Allowed method
  let indexToProcess = -1;
  for (let i = 0; i < peopleCuts.length; i++) {
    if (peopleCuts[i].items <= robotCapacityCuts) {
      indexToProcess = i;
      break;
    }
  }

  // Process the eligible person if found
  if (indexToProcess !== -1) {
    let personToProcess = peopleCuts[indexToProcess];
    robotCapacityCuts -= personToProcess.items;
    totalWaitTimeCuts += personToProcess.waitTime;
    personToProcess.processed = true;
    checkedOutCuts.push(peopleCuts.splice(indexToProcess, 1)[0]);
    processedCountCuts++;
    canMoveCuts = true;

    // Increment the cuts counter if the processed person is not the first in line
    if (indexToProcess > 0) {
      cutsCountCuts++;
    }
  } else {
    canMoveCuts = false;
  }

  currentTime++;
  calculateStatisticsCuts();
}

////////////////////////////////
function processShoppersBalanced() {
  if (peopleBalanced.length === 0) {
    canMoveBalanced = false;
    return;
  }

  peopleBalanced.forEach(person => person.waitTime++);
  calculateStatisticsBalanced();

  let firstPerson = peopleBalanced[0];
  let allowCut = firstPerson.items > robotCapacityBalanced * thresholdFactor;

  // Force process the first person if they have been cut in front of too many times
  if (firstPerson.cutCount >= maxCutsAllowed) {
    console.log(`Processing first person due to exceeding max cuts allowed of ${maxCutsAllowed}`);
    processPerson(0);
    canMoveBalanced = true;
  } else if (!allowCut && robotCapacityBalanced >= firstPerson.items) {
    // If no cuts are allowed, process the first person
    processPerson(0);
    canMoveBalanced = true;
  } else if (allowCut) {
    // If cuts are allowed, find the best candidate to process within the next 10 people
    let indexToProcess = findBestCandidateToProcess(jumpLimit);
    if (indexToProcess !== -1) {
      processPerson(indexToProcess);
      canMoveBalanced = true;

      // Increment the cut counter for the first person
      firstPerson.cutCount++;
    } else {
      console.log('Balanced - No eligible person found to process');
      canMoveBalanced = false;
    }
  }
}

function findBestCandidateToProcess(limit) {
  let highestScore = -Infinity;
  let indexToProcess = -1;

  for (let i = 0; i < Math.min(limit, peopleBalanced.length); i++) {
    let person = peopleBalanced[i];
    if (robotCapacityBalanced >= person.items) {
      let proximityScore = (peopleBalanced.length + i) / peopleBalanced.length;
      let itemScore = 1 / Math.sqrt(person.items);
      let cutPenalty = i * 0.5;
      let score = proximityScore + itemScore - cutPenalty;

      if (score > highestScore) {
        highestScore = score;
        indexToProcess = i;
      }
    }
  }

  return indexToProcess;
}

function processPerson(index) {
  let personToProcess = peopleBalanced[index];
  robotCapacityBalanced -= personToProcess.items;
  totalWaitTimeBalanced += personToProcess.waitTime;
  personToProcess.processed = true;
  checkedOutBalanced.push(peopleBalanced.splice(index, 1)[0]);
  processedCountBalanced++;

  // Track cuts if the selected person was not at the front of the line
  if (index > 0) {
    cutsCountBalanced++;
  }
  // Add a new shopper after processing
  totalShoppersProcessed++;
  addNewShopper(totalShoppersProcessed + initialCrowdsize); // Add a new shopper with a new position number
}

function calculateStatisticsBalanced() {
  averageWaitTimeBalanced = totalWaitTimeBalanced / checkedOutBalanced.length;
}

function calculateStatisticsFCFS() {
  averageWaitTimeFCFS = totalWaitTimeFCFS / checkedOutFCFS.length;
}

function calculateStatisticsCuts() {
  averageWaitTimeCuts = totalWaitTimeCuts / checkedOutCuts.length;
}

function calculateItemsProcessed(checkedOut) {
  let totalItems = 0;
  for (let i = 0; i < checkedOut.length; i++) {
    totalItems += checkedOut[i].items;
  }
  return totalItems;
}


function displayVisualization(index, methodName, people, checkedOut, robotCapacity, totalWaitTime, averageWaitTime, processedCount, canMove, cutsCount) {
  let xOffset = 0;
  let yOffset = 0 + (index * visualizationHeight);
  let chartStartY = titleHeight + yOffset;
  let chartEndY = chartStartY + chartHeight;
  // Calculate the total number of items processed
  let totalItemsProcessed = calculateItemsProcessed(checkedOut);  

  // Draw the method name and stats
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Method: ${methodName}`, xOffset, yOffset + 20);
  textSize(14);
  let statSpacing = (visualizationWidth / 7)
  fill('#D7D7D7');
  text(`Threshold: ${robotCapacity}`, 0, yOffset + 48);
  //text(`Cumulative wait time: ${totalWaitTime}`, statSpacing, yOffset + 48);
  text(`Avg wait time: ${averageWaitTime.toFixed(2)}`, statSpacing, yOffset + 48);
  text(`Cuts: ${cutsCount}`, statSpacing * 2, yOffset + 48);
  //let cutSavings = (averageWaitTimeFCFS - averageWaitTime)/cutsCount;
  let cutSavings = (totalWaitTimeFCFS - totalWaitTime)/cutsCount;
  text(`Wait saved per cut: ${cutSavings.toFixed(2)}`, statSpacing * 3, yOffset + 48);
  text(`$ processed: ${totalItemsProcessed}`, statSpacing*4, yOffset + 48);
  text(`Onboarded: ${checkedOut.length}`, statSpacing*5, yOffset + 48);
  let onboardRate = checkedOut.length/currentTime;
  text(`Onboard Rate: ${onboardRate.toFixed(5)}`, statSpacing*6, yOffset + 48);

  // Draw the top border
  stroke('#606060');
  line(0, chartStartY, chartWidth, chartStartY);
  // Draw the bottom border / 0 line
  stroke('#606060');
  line(0, chartEndY, chartWidth, chartEndY);

  // Draw the capacity barrier / processed zone
  let barrierStartX = chartWidth - 400;
  let barrierStartY = chartStartY;
  let capacity = map(robotCapacity, 0, 100, 0, chartHeight - 5);
  let barrierHeight = chartHeight - capacity;
  if (barrierHeight >= chartHeight) {
    barrierHeight = chartHeight;
  }
  if (barrierHeight <= 5) {
    barrierHeight = 5;
  }
  noStroke();
  // Draw the cleared zone
  fill(50);
  rect(barrierStartX, barrierStartY, chartWidth, chartHeight);
  // Draw the barrier zone
  fill(255);
  rect(barrierStartX, barrierStartY, barWidth, barrierHeight);

   // Draw the people's lines (unprocessed shoppers)
   for (let i = 0; i < people.length; i++) {
    let person = people[i];
    let lineHeight = map(person.items, 0, 100, 0, chartHeight - 5);
    fill(robotCapacity >= person.items ? '#00C3FF' : '#007AFF'); // Lighter blue for those who can pass
    let moveOffset = canMove ? columnWidth : 0;
    // Stop the bars at the barrier
    let barX = max(barrierStartX - (i * columnWidth) - columnWidth - moveOffset, barrierStartX - chartWidth + 400);
    rect(barX, chartEndY, barWidth, lineHeight * -1);
    textAlign(LEFT, TOP);
    textSize(10);
    fill(0);
    text(`${person.originalPosition}`, barX + 2, chartEndY + lineHeight * -1);
  }

  // Draw the checked-out shoppers (processed)
  for (let i = 0; i < checkedOut.length; i++) {
    let person = checkedOut[i];
    let lineHeight = map(person.items, 0, 100, 0, chartHeight - 5);
    fill(150); // Gray for processed shoppers
    // Position the processed bars to the right of the barrier, and shift them as new shoppers are processed
    let barX = barrierStartX + ((processedCount - i) * columnWidth);
    rect(barX, chartEndY, barWidth, lineHeight * -1);
    textAlign(LEFT, TOP);
    textSize(10);
    fill(0);
    text(`${person.originalPosition}`, barX + 2, chartEndY + lineHeight * -1);
  }
}

// Automatically resize the canvas when the window is resized
function windowResized() {
  //resizeCanvas(windowWidth - (windowWidth * 0.03), windowHeight - (windowHeight * 0.03));
  canvasWidth = windowWidth - (windowWidth * 0.03);
  canvasHeight = windowHeight - (windowHeight * 0.03);
  resizeCanvas(canvasWidth, canvasHeight);
  visualizationWidth = width;
  visualizationHeight = (canvasHeight - controlHeight) / visualizationCount;
  chartWidth = canvasWidth;
  chartHeight = visualizationHeight - titleHeight;
  growthSpeedSlider.position(canvasWidth / 4 - 100, canvasHeight - 50);
  playbackSpeedSlider.position(3 * canvasWidth / 4 - 100, canvasHeight - 50);
  cutToleranceSlider.position(2 * canvasWidth / 4 - 100, canvasHeight - 50); // Position for Playback speed slider
}

console.log("Cuts Allowed Processing...");
console.log("Balanced Processing...");