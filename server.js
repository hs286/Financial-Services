// const express = require("express");
// const puppeteer = require("puppeteer");
// const cors = require("cors");

// const app = express();
// const port = 4000; // Change this to your desired port

// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello, World! This is your Node.js app for live.');
// });

// // Handle form submission
// app.post("/financial-services", async (req, res) => {
//   console.log(req.body);
//   const {
//     first_name,
//     email,
//     phone,
//     zip_code,
//     types_of_dept,
//     other_dept_type,
//     dept_owned,
//   } = req.body;
//   const browser = await puppeteer.launch({ headless: "new" });
//   const page = await browser.newPage();

//   // Replace with the URL of your HTML page
//   const pageUrl = "https://elitefinancialservices.net/contact.html";

//   try {
//     // await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
//     await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 50000 }); // 60 seconds timeout

//     // Fill out the form fields
//     await page.waitForSelector("#first_name");
//     await page.type("#first_name", first_name);

//     // // await page.type("#first_name", "John");
//     await page.waitForSelector("#email");
//     await page.type("#email", email);
//     // await page.waitForSelector("#dynamic");

//     await page.waitForSelector("#phone");

//     await page.type("#phone", phone);
//     await page.waitForSelector("#zip_code");

//     await page.type("#zip_code", zip_code);
//     await page.waitForSelector("#otherDebt");

//     if (types_of_dept === "Other") {
//       await page.type("#otherDebt", other_dept_type);
//     } else {
//       await page.type("#otherDebt", types_of_dept);
//     }
//     await page.waitForFunction(
//       () => document.querySelectorAll("#menu_2 option").length > 0
//     );
//     await page.select("#menu_2", dept_owned);

//     // Click the checkbox
//     await page.click("#PublisherCheckBox");

//     // Submit the form
//     await page.click("#submit");
//     // await page.waitForSelector("#subissionElement", { visible: true });

//     // Wait for a while (adjust this as needed)
//     await page.waitForTimeout(5000);

//     console.log("Form submitted successfully.");
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     setTimeout(async () => {
//       await browser.close();
//       console.log("Browser closed after 10 seconds.");
//     }, 40000);
//   }
//   res.send("Form submitted successfully.");
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  console.log("first", req.body)
  res.status(200).json("Pupeeter 1");
});

app.post("/financial-services/token", async (req, res) => {
  console.log(req);
  res.status(200).json("Send");
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
    res.status(500).send("Error occurred while submitting the form.");
  }
});

app.post('/accidental-claim', async (req, res) => {
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
    console.log(req.body)
    const browser = await puppeteer.launch({ headless: 'new' }); // Run Puppeteer in headless mode
    const page = await browser.newPage();

    const pageUrl = 'https://accidentclaimspros.com/contact.html'; // Replace with your form URL

    await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
    await page.waitForSelector('#floatingFirstName');
    await page.type('#floatingFirstName', first_name);

    await page.waitForSelector('#floatingLastName');
    await page.type('#floatingLastName', last_name);

    await page.waitForSelector('#floatingCity');
    await page.type('#floatingCity', city);

    await page.select('#floatingSelectGrid', state);

    await page.waitForSelector('#floatingZipCode');
    await page.type('#floatingZipCode', zip_code);

    await page.waitForSelector('#floatingPhoneNumber');
    await page.type('#floatingPhoneNumber', phone);

    await page.select('#floatingSelectGridd', accident_type);

    await page.waitForSelector('#age_of_accident');
    await page.type('#age_of_accident', age_of_accident);

    await page.waitForSelector('#floatingdob');
    await page.type('#floatingdob', dob);

    await page.waitForSelector('#floatingAcMo');
    await page.type('#floatingAcMo', accident_month);

    await page.waitForSelector('#floatingEmailAddress');
    await page.type('#floatingEmailAddress', email_address);

  
      await page.click('#leadid_tcpa_disclosure');
    

    await page.click('#submit');

    await new Promise((resolve) => setTimeout(resolve, 40000));
    console.log('Form submitted successfully.');
    await browser.close();
    res.status(200).send('Form submitted successfully.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred while submitting the form.');
  }
});


app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
