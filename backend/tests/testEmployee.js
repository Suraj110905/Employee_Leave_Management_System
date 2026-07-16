const http = require("http");

const baseUrl = "http://localhost:5000/api/v1";

const postRequest = (url, body, token) => {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(body);
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(dataStr),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(responseBody),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: responseBody,
          });
        }
      });
    });

    req.on("error", reject);
    req.write(dataStr);
    req.end();
  });
};

const putRequest = (url, body, token) => {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(body);
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(dataStr),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(responseBody),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: responseBody,
          });
        }
      });
    });

    req.on("error", reject);
    req.write(dataStr);
    req.end();
  });
};

const patchRequest = (url, body, token) => {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(body || {});
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(dataStr),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(responseBody),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: responseBody,
          });
        }
      });
    });

    req.on("error", reject);
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
      path: parsedUrl.pathname + parsedUrl.search,
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
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(responseBody),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: responseBody,
          });
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
};

const runTests = async () => {
  console.log("=== Launching Employee Phase 3 Endpoint Validations ===");

  try {
    // 0. Login to retrieve token
    const login = await postRequest(`${baseUrl}/auth/login`, {
      email: "employee@company.com",
      password: "Password123",
    });
    const token = login.body.data.accessToken;
    console.log("✔ Login successful. Captured JWT.");

    // 1. JWT Security Validation
    console.log("\n1. Testing Protected Endpoint Access without Authorization...");
    const sec1 = await getRequest(`${baseUrl}/users/me`, null);
    if (sec1.status !== 401 || sec1.body.success) {
      throw new Error("Security check failed: Request allowed without Authorization header.");
    }
    console.log("✔ Protected endpoint blocked requests without headers.");

    console.log("\n2. Testing Protected Endpoint Access with Bad JWT...");
    const sec2 = await getRequest(`${baseUrl}/users/me`, "bad-token-value");
    if (sec2.status !== 401 || sec2.body.success) {
      throw new Error("Security check failed: Request allowed with malformed JWT.");
    }
    console.log("✔ Protected endpoint blocked requests with bad JWT.");

    // 2. Profile Fetch / Update
    console.log("\n3. Testing Retrieve Profile details (/users/me)...");
    const getMe = await getRequest(`${baseUrl}/users/me`, token);
    console.log("Profile Data:", JSON.stringify(getMe.body.data, null, 2));
    if (getMe.status !== 200 || !getMe.body.success) {
      throw new Error("Failed to fetch profile me.");
    }
    if (getMe.body.data.passwordHash) {
      throw new Error("Security Alert: passwordHash exposed!");
    }
    console.log("✔ Profile retrieved successfully and sensitive values hidden.");

    console.log("\n4. Testing Update Profile details (/users/me)...");
    const updateMe = await putRequest(`${baseUrl}/users/me`, {
      name: "John Updated",
      phone: "+1234567890",
      emailAlerts: true,
      smsAlerts: true,
    }, token);
    console.log("Update response:", JSON.stringify(updateMe.body, null, 2));
    if (updateMe.status !== 200 || updateMe.body.data.name !== "John Updated") {
      throw new Error("Failed to update profile.");
    }
    console.log("✔ Profile name and alert configurations updated.");

    console.log("\n5. Testing Profile update restrictions (attempting role edit)...");
    const hackMe = await putRequest(`${baseUrl}/users/me`, {
      role: "hr_admin",
      employeeId: "HACK-001",
    }, token);
    if (hackMe.status !== 400 || hackMe.body.success) {
      throw new Error("Security check failed: Employee was allowed to modify role/employeeId!");
    }
    console.log("✔ Blocked profile updates to forbidden fields (role, employeeId).");

    // 3. Leave Balances Retrieval
    console.log("\n6. Testing Fetch Leave Balances (/leaves/balances)...");
    const getBal = await getRequest(`${baseUrl}/leaves/balances`, token);
    console.log("Balances:", JSON.stringify(getBal.body.data, null, 2));
    const annualBalance = getBal.body.data.find(b => b.type === "Annual");
    if (!annualBalance || annualBalance.available !== 12) {
      throw new Error("Initial Annual Leave balance is incorrect. Expected: 12.");
    }
    console.log("✔ Leave balances retrieved successfully (Annual = 12 available).");

    // 4. Apply Leave validations & non-deduction test
    console.log("\n7. Testing Apply Leave with past dates (should fail)...");
    const failLeave1 = await postRequest(`${baseUrl}/leaves`, {
      leaveType: "Annual",
      startDate: "2026-01-01",
      endDate: "2026-01-05",
      reason: "Family vacation trip",
    }, token);
    if (failLeave1.status !== 400 || failLeave1.body.success) {
      throw new Error("Failed validation: past dates allowed.");
    }
    console.log("✔ Leave with past dates rejected successfully.");

    console.log("\n8. Testing Apply Leave with insufficient balance (should fail)...");
    const failLeave2 = await postRequest(`${baseUrl}/leaves`, {
      leaveType: "Annual",
      startDate: "2026-12-01",
      endDate: "2026-12-30", // 30 days exceeds Annual = 12 balance
      reason: "Long family vacation trip",
    }, token);
    if (failLeave2.status !== 400 || failLeave2.body.success) {
      throw new Error("Failed validation: insufficient balance leave request allowed.");
    }
    console.log("✔ Leave exceeding available balance rejected successfully.");

    console.log("\n9. Testing Apply Leave with valid parameters (working days = 4)...");
    // 2026-07-27 (Mon) to 2026-07-30 (Thu) = 4 working days
    const validLeave = await postRequest(`${baseUrl}/leaves`, {
      leaveType: "Annual",
      startDate: "2026-07-27",
      endDate: "2026-07-30",
      reason: "Short summer trip with family",
    }, token);
    console.log("Apply response:", JSON.stringify(validLeave.body, null, 2));
    if (validLeave.status !== 201 || !validLeave.body.success) {
      throw new Error("Apply valid leave failed.");
    }
    const leaveId = validLeave.body.data.id;
    console.log(`✔ Leave request submitted successfully. ID: ${leaveId}. Status: ${validLeave.body.data.status}`);

    console.log("\n10. Testing Leave Balance non-deduction rule on Pending requests...");
    const checkBalAfter = await getRequest(`${baseUrl}/leaves/balances`, token);
    const annualBalanceAfter = checkBalAfter.body.data.find(b => b.type === "Annual");
    if (annualBalanceAfter.available !== 12) {
      throw new Error(`Business rule violation: available balance was deducted for Pending request! Available: ${annualBalanceAfter.available}`);
    }
    console.log("✔ Verified available leave balance was NOT deducted while request is Pending.");

    console.log("\n11. Testing Overlapping request submission (should fail)...");
    const overlapLeave = await postRequest(`${baseUrl}/leaves`, {
      leaveType: "Annual",
      startDate: "2026-07-28", // overlaps with 27-30 July
      endDate: "2026-07-29",
      reason: "Overlapping request try",
    }, token);
    if (overlapLeave.status !== 400 || overlapLeave.body.success) {
      throw new Error("Overlap validation failed: overlapping request allowed.");
    }
    console.log("✔ Overlapping request rejected successfully.");

    // 5. Leave Details / History pagination
    console.log("\n12. Testing Fetch Leave History with filters (/leaves)...");
    const history = await getRequest(`${baseUrl}/leaves?status=Pending&type=Annual&limit=5`, token);
    console.log("History total:", history.body.data.total);
    if (history.status !== 200 || history.body.data.total === 0) {
      throw new Error("Failed to fetch filtered leave history.");
    }
    console.log("✔ Leave history retrieved and filtered successfully.");

    console.log(`\n13. Testing Fetch single leave details (/leaves/${leaveId})...`);
    const details = await getRequest(`${baseUrl}/leaves/${leaveId}`, token);
    console.log("Details response:", JSON.stringify(details.body, null, 2));
    if (details.status !== 200 || details.body.data.id !== leaveId) {
      throw new Error("Failed to fetch leave request details.");
    }
    console.log("✔ Leave details retrieved successfully.");

    // 6. Cancel pending leave request
    console.log(`\n14. Testing Cancel Leave Request (/leaves/${leaveId}/cancel)...`);
    const cancel = await patchRequest(`${baseUrl}/leaves/${leaveId}/cancel`, {}, token);
    console.log("Cancel response:", JSON.stringify(cancel.body, null, 2));
    if (cancel.status !== 200 || !cancel.body.success) {
      throw new Error("Cancel leave failed.");
    }

    const checkDetailsAfter = await getRequest(`${baseUrl}/leaves/${leaveId}`, token);
    if (checkDetailsAfter.body.data.status !== "Cancelled") {
      throw new Error("Leave request status was not updated to Cancelled.");
    }
    console.log("✔ Leave request cancelled successfully.");

    console.log("\n15. Testing Leave Balance remain unchanged after cancel...");
    const checkBalFinal = await getRequest(`${baseUrl}/leaves/balances`, token);
    const annualBalanceFinal = checkBalFinal.body.data.find(b => b.type === "Annual");
    if (annualBalanceFinal.available !== 12 || annualBalanceFinal.used !== 3) {
      throw new Error(`Leave balance corrupted after cancel. Available: ${annualBalanceFinal.available}`);
    }
    console.log("✔ Verified leave balance remains correct after cancelling the request.");

    console.log("\n=== ✅ All Employee Phase 3 Validations Passed Successfully ===");
    process.exit(0);
  } catch (error) {
    console.error(`\n=== ❌ Test Validation Failed: ${error.message} ===`);
    process.exit(1);
  }
};

runTests();
