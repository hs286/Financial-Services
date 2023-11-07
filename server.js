const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.post("/being-insured", async (req, res) => {
  try {
    const { Name, Email, Number, Zip_code, Insurance_type } = req.body;
    console.log(req.body);
    const browser = await puppeteer.launch({
      headless: "new",
      ignoreHTTPSErrors: true,
    }); // Run Puppeteer in headless mode

    const page = await browser.newPage();
    const pageUrl = "https://being-insured.com/con.html"; // Replace with your form URL

    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

    await new Promise((resolve) => setTimeout(resolve, 16 * 1000));

    await page.waitForSelector("#Name");
    await page.type("#Name", Name);

    await page.waitForSelector("#Email");
    await page.type("#Email", Email);

    await page.waitForSelector("#Number");
    await page.type("#Number", Number);

    await page.waitForSelector("#Zip_code");
    await page.type("#Zip_code", Zip_code);

    await page.waitForSelector("#Insurance_type");
    await page.select("#Insurance_type", Insurance_type);

    await page.click("#leadid_tcpa_disclosure");
    await page.click("#submit");

    await new Promise((resolve) => setTimeout(resolve, 8000));

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

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
