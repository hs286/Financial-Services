const express = require("express");
const puppeteer = require("puppeteer");
const proxyChain = require('proxy-chain');
const cors = require("cors");
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PROXY_HOST = "gw.dataimpulse.com";
const PROXY_PORT = 10000;
const PROXY_USER = "66d5b7fbed1090c26f81";
const PROXY_PASSWORD = "c082ecb8450706d6";

async function getLocationByZip(zipCode) {
  try {
    const response = await axios.get(`http://api.zippopotam.us/us/${zipCode}`);
    if (response.status === 200) {
      const data = response.data;
      const city = data.places[0]?.["place name"]?.replace(" ", "").toLowerCase() || null;
      const state = data.places[0]?.["state"]?.replace(" ", "").toLowerCase() || null;
      return { city, state };
    }
  } catch (error) {
    console.error("Error fetching location data:", error.message);
    return { city: null, state: null };
  }
}

async function getPublicIP() {
  try {
    const response = await fetch('https://api.ipify.org/?format=json');
    if (!response.ok) {
      throw new Error(`Error fetching IP: ${response.statusText}`);
    }
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error(error);
    return null;
  }
}


app.post("/rqgq-qgqr", async (req, res) => {
  const formData = req.body;
  const {
    first_name,
    last_name,
    phone_home,
    address,
    zip_code,
    email_address,
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_ownership,
    currently_insured,
    current_insurance_company,
    gender,
    marital_status,
    coverage_type,
    occupation,
    education_level,
    vehicle_annual_mileage,
    sr22,
    dob,
  } = req.body;

  const requiredFields = [
    "first_name",
    "last_name",
    "phone_home",
    "address",
    "zip_code",
    "email_address",
    "vehicle_year",
    "vehicle_make",
    "vehicle_model",
    "vehicle_ownership",
    "currently_insured",
    "gender",
    "marital_status",
    "coverage_type",
    "occupation",
    "education_level",
    "vehicle_annual_mileage",
    "sr22",
    "dob",
  ];

  for (const field of requiredFields) {
    if (!formData[field]) {
      return res.status(400).json({ error: `${field} is required.` });
    }
  }
  if (currently_insured === "Yes") {
    if (!current_insurance_company) {
      return res.status(400).json({ error: "current_insurer is required." });
    }
  }

  let proxyChainUrl = null;
  let browser = null;
  let pageUrl = null;
  let page = null;

  try {
    const location = await getLocationByZip(zip_code);

    if (!location.city && !location.state) {
      return res.status(404).json({ message: "Enter valid zip code: " + zip_code });
    }

    function createProxyUrl(zipCode, city, state) {
      if (zipCode) {
        return `http://${PROXY_USER}__cr.us;state.${state}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;
      } else if (city) {
        return `http://${PROXY_USER}__cr.us;city.${city}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;
      } else if (state) {
        return `http://${PROXY_USER}__cr.us;zip.${zipCode}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;
      }
      throw "Enter valid zip code";
    }

    async function testProxy() {
      const proxyUrl = createProxyUrl(zip_code, location.city, location.state);

      proxyChainUrl = await proxyChain.anonymizeProxy(proxyUrl);

      browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        args: [`--proxy-server=${proxyChainUrl}`, "--disable-sync"],
      });

      page = await browser.newPage();
      pageUrl = "https://rapid-quote.co/get-a-quote.html";

      await page.goto(pageUrl, { waitUntil: "load", timeout: 300000 });
    }

    await testProxy();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const typeSlowly = async (page, selector, text) => {
  //      // Select the element to focus on
  // const element = await page.$(selector);
  // const boundingBox = await element.boundingBox();

  // // Starting random mouse position, a bit off from the target
  // const startX = Math.random() * 500 + 100;  // Random initial x position
  // const startY = Math.random() * 500 + 100;  // Random initial y position

  // const stepCount = 50; // Number of steps to move the mouse (more steps = smoother movement)
  // const maxDeviation = 20; // Maximum deviation for a human-like curve
  // const stepDelay = 5; // Delay between each mouse move in ms (adjust for smoothness)

  // // Calculate the direction of the movement
  // const targetX = boundingBox.x + boundingBox.width / 2;
  // const targetY = boundingBox.y + boundingBox.height / 2;

  // let currentX = startX;
  // let currentY = startY;

  // // Simulate a more human-like curve by adding small random variations to the movement
  // for (let i = 0; i < stepCount; i++) {
  //   // Create random variations for human-like curves and slowdowns
  //   const deviationX = Math.random() * maxDeviation - maxDeviation / 2;
  //   const deviationY = Math.random() * maxDeviation - maxDeviation / 2;
    
  //   // Move slightly towards the target with some randomness
  //   currentX += (targetX - currentX) / (stepCount - i) + deviationX;
  //   currentY += (targetY - currentY) / (stepCount - i) + deviationY;

  //   // Move the mouse
  //   await page.mouse.move(currentX, currentY);

  //   // Randomize the delay between steps to simulate varying speed
  //   const randomDelay = Math.random() * (stepDelay / 2) + stepDelay / 2;  // Random delay
  //   await new Promise(resolve => setTimeout(resolve, randomDelay));
  // }

  // // Hover over the target element
  // await page.mouse.move(targetX, targetY);

      const delays  = [1000, 600, 400];

      const randomDelay = delays[Math.floor(Math.random() * delays.length)];
    
      // Wait for the random delay to simulate more human-like behavior
      await new Promise((resolve) => setTimeout(resolve, randomDelay));

      await page.hover(selector);
      await page.waitForSelector(selector, { visible: true });
      await page.click(selector);
      for (const char of text) {
        await page.keyboard.type(char);
        const delays = [210, 172, 246, 194];
      const randomDelay = delays[Math.floor(Math.random() * delays.length)];
    
      // Wait for the random delay to simulate more human-like behavior
      await new Promise((resolve) => setTimeout(resolve, randomDelay)); 
      }
      let delaysEndSelect = [8000, 600, 300];
      let randomDelayEndSelect = delaysEndSelect[Math.floor(Math.random() * delaysEndSelect.length)];
    
      // Wait for the random delay to simulate more human-like behavior
      await new Promise((resolve) => setTimeout(resolve, randomDelayEndSelect));
    };

    const selectSlowly = async (page, selector, selected_value) => {
      // Hover over the select box to mimic mouse movement
  //      // Select the element to focus on
  // const element = await page.$(selector);
  // const boundingBox = await element.boundingBox();

  // // Starting random mouse position, a bit off from the target
  // const startX = Math.random() * 500 + 100;  // Random initial x position
  // const startY = Math.random() * 500 + 100;  // Random initial y position

  // const stepCount = 50; // Number of steps to move the mouse (more steps = smoother movement)
  // const maxDeviation = 20; // Maximum deviation for a human-like curve
  // const stepDelay = 5; // Delay between each mouse move in ms (adjust for smoothness)

  // // Calculate the direction of the movement
  // const targetX = boundingBox.x + boundingBox.width / 2;
  // const targetY = boundingBox.y + boundingBox.height / 2;

  // let currentX = startX;
  // let currentY = startY;

  // // Simulate a more human-like curve by adding small random variations to the movement
  // for (let i = 0; i < stepCount; i++) {
  //   // Create random variations for human-like curves and slowdowns
  //   const deviationX = Math.random() * maxDeviation - maxDeviation / 2;
  //   const deviationY = Math.random() * maxDeviation - maxDeviation / 2;
    
  //   // Move slightly towards the target with some randomness
  //   currentX += (targetX - currentX) / (stepCount - i) + deviationX;
  //   currentY += (targetY - currentY) / (stepCount - i) + deviationY;

  //   // Move the mouse
  //   await page.mouse.move(currentX, currentY);

  //   // Randomize the delay between steps to simulate varying speed
  //   const randomDelay = Math.random() * (stepDelay / 2) + stepDelay / 2;  // Random delay
  //   await new Promise(resolve => setTimeout(resolve, randomDelay));
  // }

  // // Hover over the target element
  // await page.mouse.move(targetX, targetY);

      await page.hover(selector);
      await page.waitForSelector(selector, { visible: true });
    
      // Click on the select to open the dropdown
      await page.click(selector);
    
      // Wait for the option elements to appear in the dropdown
      // await page.waitForSelector(`${selector} option`, { visible: true, timeout: 60000 }); // Increased timeout
    
      let delays = [ 35, 40, 32, 45, 42, 48, 37];
      let randomDelay = delays[Math.floor(Math.random() * delays.length)];
    
      // Wait for the random delay to simulate more human-like behavior
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
    
      // Find the option matching the selected value
      // const option = await page.$(`${selector} option[value="${selected_value}"]`);

      // if(option){

      //   const optionBoundingBox = await option.boundingBox();
        
      //   if(optionBoundingBox){
      //     await page.mouse.move(optionBoundingBox.x + optionBoundingBox.width / 2, optionBoundingBox.y + optionBoundingBox.height / 2);
      //   }
      //   // Hover over the option
      // }
      // Get the bounding box of the option element to calculate its position
            // Click the option to select it
      // await option.click();
      await page.select(selector, selected_value);

      await page.click('body');
    
      // Wait for a short delay to simulate human interaction
      let delaysEndSelect = [800, 600, 400];
      let randomDelayEndSelect = delaysEndSelect[Math.floor(Math.random() * delaysEndSelect.length)];
    
      // Wait for the random delay to simulate more human-like behavior
      await new Promise((resolve) => setTimeout(resolve, randomDelayEndSelect));
      // await new Promise((resolve) => setTimeout(resolve, 3000));
    
      // Optionally, you can close the dropdown by clicking outside
      // This depends on whether the dropdown closes automatically after selection.
      // If necessary, add a line to close the dropdown, like clicking outside.
      // await page.click('body');
    };

    await typeSlowly(page, "#first_name", first_name);

    await typeSlowly(page, "#last_name", last_name);

    await typeSlowly(page, "#phone_home", phone_home);

    await typeSlowly(page, "#address", address);

    await typeSlowly(page, "#zip_code", zip_code);

    await typeSlowly(page, "#email_address", email_address);
    await typeSlowly(page, "#vehicle_year", vehicle_year);

    await typeSlowly(page, "#vehicle_make", vehicle_make);

    await typeSlowly(page, "#vehicle_model", vehicle_model);

    await typeSlowly(page, "#vehicle_ownership", vehicle_ownership);

    // await page.select("#currently_insured", currently_insured);
    await selectSlowly(page, "#currently_insured", currently_insured)

    if (currently_insured === "Yes") {
      await selectSlowly(page, "#current_insurance_company", current_insurance_company)

      // await page.select("#current_insurance_company", current_insurance_company);
    }

    await selectSlowly(page, "#gender", gender)

    // await page.waitForSelector("#gender", { visible: true });
    // await page.select("#gender", gender);

    await selectSlowly(page, "#marital_status", marital_status)

    // await page.waitForSelector("#marital_status", { visible: true });
    // await page.select("#marital_status", marital_status);

    await selectSlowly(page, "#coverage_type", coverage_type)

    // await page.waitForSelector("#coverage_type", { visible: true });
    // await page.select("#coverage_type", coverage_type);

    await selectSlowly(page, "#occupation", occupation)

    // await page.waitForSelector("#occupation", { visible: true });
    // await page.select("#occupation", occupation);

    await selectSlowly(page, "#education_level", education_level)

    // await page.waitForSelector("#education_level", { visible: true });
    // await page.select("#education_level", education_level);
    await typeSlowly(page, "#vehicle_annual_mileage", vehicle_annual_mileage);

    await selectSlowly(page, "#sr22", sr22)


    // await page.waitForSelector("#sr22", { visible: true });
    // await page.select("#sr22", sr22);
    await typeSlowly(page, "#dob", dob);

    await page.waitForSelector("#leadid_tcpa_disclosure", { visible: true });
    await page.click("#leadid_tcpa_disclosure");
    await new Promise((resolve) => setTimeout(resolve, 3000));



    await page.waitForSelector("#submit", { visible: true });

    await page.click("#submit");
    await new Promise((resolve) => setTimeout(resolve, 7000));

    await browser.close();
    await proxyChain.closeAnonymizedProxy(proxyChainUrl, true);

    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error.message);

    if (browser) {
      await browser.close();
    }

    if (proxyChainUrl) {
      try {
        await proxyChain.closeAnonymizedProxy(proxyChainUrl, true);
      } catch (closeError) {
        console.error("Error closing proxy chain:", closeError.message);
      }
    }

    res.status(500).json({
      message: "Enter valid zip code",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  console.log("first", req.body);
  try {
    res.status(200).json("Pupee");

  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/financial-services/token", async (req, res) => {
  console.log(req);
  try {
    res.status(200).json("Send");

  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/financial-services", async (req, res) => {
  try {
    const {
      first_name,
      email,
      phone,
      zip_code,
      types_of_dept,
      other_dept_type,
      dept_owned,
    } = req.body;

    const browser = await puppeteer.launch({
      headless: "new",
    }); // Run Puppeteer in headless mode

    const page = await browser.newPage();
    const pageUrl = "https://elitefinancialservices.net/contact.html"; // Replace with your form URL

    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 }); // Increased timeout to 60 seconds

    const delayInSeconds = 5;
    await new Promise((resolve) => setTimeout(resolve, delayInSeconds * 1000));
    // Fill out the form fields
    await page.waitForSelector("#first_name");
    await page.type("#first_name", first_name);

    await page.waitForSelector("#email");
    await page.type("#email", email);

    await page.waitForSelector("#phone");
    await page.type("#phone", phone);

    await page.waitForSelector("#zip_code");
    await page.type("#zip_code", zip_code);

    await page.waitForSelector("#otherDebt");
    if (types_of_dept === "Other") {
      await page.type("#otherDebt", other_dept_type);
    } else {
      await page.type("#otherDebt", types_of_dept);
    }

    await page.waitForFunction(
      () => document.querySelectorAll("#menu_2 option").length > 0
    );
    await page.select("#menu_2", dept_owned);

    await page.click("#leadid_tcpa_disclosure"); // Click the checkbox

    await page.click("#submit"); // Submit the form

    await new Promise((resolve) => setTimeout(resolve, 40000));

    console.log("Form submitted successfully.");
    await browser.close();
    res.status(200).send("Form submitted successfully.");
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof puppeteer.errors.TimeoutError) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

app.post("/accidental-claim", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      city,
      state,
      zip_code,
      phone,
      accident_type,
      age_of_accident,
      dob,
      accident_month,
      email_address,
    } = req.body;
    console.log(req.body);
    const browser = await puppeteer.launch({ headless: "new" }); // Run Puppeteer in headless mode
    const page = await browser.newPage();

    const pageUrl = "https://accidentclaimspros.com/contact.html"; // Replace with your form URL

    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
    await page.waitForSelector("#floatingFirstName");
    await page.type("#floatingFirstName", first_name);

    await page.waitForSelector("#floatingLastName");
    await page.type("#floatingLastName", last_name);

    await page.waitForSelector("#floatingCity");
    await page.type("#floatingCity", city);

    await page.select("#floatingSelectGrid", state);

    await page.waitForSelector("#floatingZipCode");
    await page.type("#floatingZipCode", zip_code);

    await page.waitForSelector("#floatingPhoneNumber");
    await page.type("#floatingPhoneNumber", phone);

    await page.select("#floatingSelectGridd", accident_type);

    await page.waitForSelector("#age_of_accident");
    await page.type("#age_of_accident", age_of_accident);

    await page.waitForSelector("#floatingdob");
    await page.type("#floatingdob", dob);

    await page.waitForSelector("#floatingAcMo");
    await page.type("#floatingAcMo", accident_month);

    await page.waitForSelector("#floatingEmailAddress");
    await page.type("#floatingEmailAddress", email_address);

    await page.click("#leadid_tcpa_disclosure");

    await page.click("#submit");

    await new Promise((resolve) => setTimeout(resolve, 40000));
    console.log("Form submitted successfully.");
    await browser.close();
    res.status(200).send("Form submitted successfully.");
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof puppeteer.errors.TimeoutError) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

app.post("/medicare", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      zip_code,
      phone,
    } = req.body;
    console.log("firstsd", req.body);
    const browser = await puppeteer.launch({ headless: "new" }); // Run Puppeteer in headless mode
    const page = await browser.newPage();

    const formUrl = "https://elitemedicareassist.com/con.html"; // Replace with your form URL
    // const formUrl = "https://elitefinancialservices.net/a.html"; // Replace with your form URL

    await page.goto(formUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 15 * 1000));
    // Wait for all selectors to be present
    // Fill form fields
    await page.waitForSelector("#first_name"),
      await page.type("#first_name", first_name);

    await page.waitForSelector("#last_name"),
      await page.type("#last_name", last_name);

    await page.waitForSelector("#email"), await page.type("#email", email);

    await page.waitForSelector("#zip_code"),
      await page.type("#zip_code", zip_code);

    await page.waitForSelector("#phone"), await page.type("#phone", phone);

    // Check the disclosure checkbox
    await page.waitForSelector("#leadid_tcpa_disclosure"),
      await page.click("#leadid_tcpa_disclosure");
      // await new Promise((resolve) => setTimeout(resolve, 15000));

      await page.waitForSelector('#submit'); // Wait for the submit button to be visible
      await page.click('#submit');
      await new Promise((resolve) => setTimeout(resolve, 8000));

    // Submit the form
   

    
    console.log("Form submitted successfully.");
    await browser.close();
    res.status(200).send("Form submitted successfully.");
  } catch (error) {
    if (error instanceof puppeteer.errors.TimeoutError) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});


// Fetch city and state using ZIP code
async function getLocationByZip(zipCode) {
    try {
        const response = await axios.get(`http://api.zippopotam.us/us/${zipCode}`);
        if (response.status === 200) {
            const data = response.data;
            const city = data.places[0]['place name'].replace(" ", "").toLowerCase();
            const state = data.places[0]['state'].replace(" ", "").toLowerCase();
            return { city, state };
        }
    } catch (error) {
        console.error("Error fetching location data:", error);
        return null;
    }
}

function createProxyUrl(state = "Virginia", city = null,) {
  let locationInfo = city ? `city.${city}` : state ? `state.${state}` : null;

  if (locationInfo) {
    return `http://${PROXY_USER}__cr.us;${locationInfo}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;
  } else {
    return `http://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;
  }
}

app.post("/being-insured", async (req, res) => {
  try {
    const { Name, Email, Number, Zip_code, Insurance_type } = req.body;
    console.log(req.body);
    const location = await getLocationByZip(Zip_code);
    const proxyUrl = createProxyUrl(location.state, location.city)

    // const proxyUrl = 'http://35de24a5d8e618097121__cr.us;state.texas;city.abernathy:ec0ca1d7fa914869@gw.dataimpulse.com:823'

    const proxyChainUrl = await proxyChain.anonymizeProxy({url: proxyUrl, port: 8080});

    const browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      args: [`--proxy-server=${proxyChainUrl}`, '--disable-sync']
    });

    const page = await browser.newPage();
    const pageUrl = "https://being-insured.com/con.html"; // Replace with your form URL

    await page.goto(pageUrl, { waitUntil: "load", timeout: 60000 });

    await new Promise((resolve) => setTimeout(resolve, 4 * 1000));

    await page.waitForSelector("#Name");
    await page.type("#Name", Name);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay after typing Name

    await page.waitForSelector("#Email");
    await page.type("#Email", Email);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay after typing Name

    await page.waitForSelector("#Number");
    await page.type("#Number", Number);

    await page.waitForSelector("#Zip_code");
    await page.type("#Zip_code", Zip_code);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay after typing Name

    await page.waitForSelector("#Insurance_type");
    await page.select("#Insurance_type", Insurance_type);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay after typing Name

    await page.click("#leadid_tcpa_disclosure");
    await page.click("#submit");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    
    console.log("Form submitted successfully.");
    await browser.close();
    const { hostname, port } = new URL(proxyChainUrl);
    await proxyChain.closeTunnel(`${hostname}:${port}`);
    await proxyChain.closeAnonymizedProxy(proxyChainUrl, true);

    res.status(200).send("Form submitted successfully.");
  } catch (error) {
      res.status(500).send(error.message);
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
