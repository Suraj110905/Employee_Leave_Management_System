const http = require("http");

const baseUrl = "http://localhost:5000/api/v1";

const postRequest = (url, body) => {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(body);
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": dataStr.length,
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: JSON.parse(responseBody),
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(dataStr);
    req.end();
  });
};

const getRequest = (url, token) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: JSON.parse(responseBody),
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
};

const runTests = async () => {
  console.log("=== Launching Auth Phase 2 Endpoint Validations ===");

  try {
    // Test 1: Valid Login
    console.log("\n1. Testing Valid Login (employee@company.com)...");
    const validLogin = await postRequest(`${baseUrl}/auth/login`, {
      email: "employee@company.com",
      password: "Password123",
    });
    console.log(`Status code: ${validLogin.status}`);
    console.log("Response structure:", JSON.stringify(validLogin.body, null, 2));

    if (validLogin.status !== 200 || !validLogin.body.success) {
      throw new Error("Valid login failed.");
    }
    const token = validLogin.body.data.accessToken;

    // Test 2: Invalid Login
    console.log("\n2. Testing Invalid Login (wrong password)...");
    const invalidLogin = await postRequest(`${baseUrl}/auth/login`, {
      email: "employee@company.com",
      password: "WrongPassword",
    });
    console.log(`Status code: ${invalidLogin.status}`);
    console.log("Response structure:", JSON.stringify(invalidLogin.body, null, 2));

    if (invalidLogin.status !== 401 || invalidLogin.body.success) {
      throw new Error("Invalid login allowed or format wrong.");
    }

    // Test 3: Get Profile (/me)
    console.log("\n3. Testing Get Profile details (/me)...");
    const profile = await getRequest(`${baseUrl}/auth/me`, token);
    console.log(`Status code: ${profile.status}`);
    console.log("Response structure:", JSON.stringify(profile.body, null, 2));

    if (profile.status !== 200 || !profile.body.success) {
      throw new Error("Retrieve profile /me failed.");
    }

    // Check no passwordHash leakage
    if (profile.body.data.user.passwordHash) {
      throw new Error("Security Alert: passwordHash exposed on /me profile payload!");
    }

    // Test 4: Verify session (/verify)
    console.log("\n4. Testing Session Verification (/verify)...");
    const verify = await getRequest(`${baseUrl}/auth/verify`, token);
    console.log(`Status code: ${verify.status}`);
    console.log("Response structure:", JSON.stringify(verify.body, null, 2));

    if (verify.status !== 200 || !verify.body.data.valid) {
      throw new Error("Verify session failed.");
    }

    // Test 5: Unauthorized Access (No Token)
    console.log("\n5. Testing Protected route without JWT token...");
    const unauthorized = await getRequest(`${baseUrl}/auth/me`, null);
    console.log(`Status code: ${unauthorized.status}`);
    console.log("Response structure:", JSON.stringify(unauthorized.body, null, 2));

    if (unauthorized.status !== 401 || unauthorized.body.success) {
      throw new Error("Unauthorized request allowed.");
    }

    console.log("\n=== ✅ All Auth Phase 2 Validations Succeeded Successfully ===");
    process.exit(0);
  } catch (error) {
    console.error(`\n=== ❌ Test Validation Failed: ${error.message} ===`);
    process.exit(1);
  }
};

runTests();
