const http = require("http");

const baseUrl = "http://localhost:5000/api/v1";

const postRequest = (url, body, token) => {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(body || {});
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
      res.on("data", (chunk) => responseBody += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(responseBody) }); }
        catch (e) { resolve({ status: res.statusCode, body: responseBody }); }
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
      res.on("data", (chunk) => responseBody += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(responseBody) }); }
        catch (e) { resolve({ status: res.statusCode, body: responseBody }); }
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
      res.on("data", (chunk) => responseBody += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(responseBody) }); }
        catch (e) { resolve({ status: res.statusCode, body: responseBody }); }
      });
    });
    req.on("error", reject);
    req.end();
  });
};

const runTests = async () => {
  console.log("=== Launching Manager Phase 4 Endpoint Validations ===");

  try {
    // 0. Perform Logins to retrieve tokens
    const loginEmp = await postRequest(`${baseUrl}/auth/login`, {
      email: "employee@company.com",
      password: "Password123",
    });
    const tokenEmp = loginEmp.body.data.accessToken;

    const loginMgr = await postRequest(`${baseUrl}/auth/login`, {
      email: "manager@company.com",
      password: "Password123",
    });
    const tokenMgr = loginMgr.body.data.accessToken;

    console.log("✔ Login tokens captured for Employee & Manager.");

    // 1. Role Security check (Standard employee blocked from manager endpoints)
    console.log("\n1. Testing Employee Access Block to Manager Dashboard (Forbidden check)...");
    const checkSec = await getRequest(`${baseUrl}/manager/dashboard`, tokenEmp);
    if (checkSec.status !== 403 || checkSec.body.success) {
      throw new Error("Security check failed: Standard employee was allowed to access manager endpoints!");
    }
    console.log("✔ standard employee request blocked with 403 Forbidden.");

    // 2. Fetch Initial stats
    console.log("\n2. Fetching Manager Dashboard statistics...");
    const statsInit = await getRequest(`${baseUrl}/manager/dashboard`, tokenMgr);
    console.log("Stats response:", JSON.stringify(statsInit.body.data, null, 2));
    if (statsInit.status !== 200 || !statsInit.body.success) {
      throw new Error("Failed to fetch dashboard stats.");
    }
    console.log("✔ Dashboard stats retrieved successfully.");

    // 3. Employee Submits Leave Request (starts with 12 available Annual days)
    console.log("\n3. Employee submitting leave request (4 working days)...");
    // 2026-08-10 (Mon) to 2026-08-13 (Thu) = 4 working days
    const apply = await postRequest(`${baseUrl}/leaves`, {
      leaveType: "Annual",
      startDate: "2026-08-10",
      endDate: "2026-08-13",
      reason: "Summer holiday trip with family details",
    }, tokenEmp);
    const leaveId = apply.body.data.id;
    console.log(`✔ Leave request LV-XXX submitted. ID: ${leaveId}. Status: Pending.`);

    // 4. Manager Approves Request
    console.log(`\n4. Manager Approving request ${leaveId}...`);
    const approveAction = await patchRequest(`${baseUrl}/manager/leave-requests/${leaveId}/approve`, {
      remarks: "Approved. Team cover is in place.",
    }, tokenMgr);
    console.log("Approve response:", JSON.stringify(approveAction.body, null, 2));
    if (approveAction.status !== 200 || !approveAction.body.success) {
      throw new Error("Manager approval action failed.");
    }
    console.log(`✔ Request ${leaveId} approved.`);

    // 5. Verify Leave Balance Deduction occurred in database
    console.log("\n5. Verifying leave balance is now deducted...");
    const balances = await getRequest(`${baseUrl}/leaves/balances`, tokenEmp);
    const annualBalance = balances.body.data.find(b => b.type === "Annual");
    console.log("Annual Balance Ledger status:", JSON.stringify(annualBalance, null, 2));
    if (annualBalance.available !== 8 || annualBalance.used !== 7) {
      throw new Error(`Deduction workflow failed! Available: ${annualBalance.available}, Used: ${annualBalance.used}`);
    }
    console.log("✔ Business rule validated: available balance deducted (available: 8, used: 7).");

    // 6. Block duplicate actions
    console.log("\n6. Testing duplicate action blocks (approving already approved leave)...");
    const dupApprove = await patchRequest(`${baseUrl}/manager/leave-requests/${leaveId}/approve`, {
      remarks: "Trying duplicate approval",
    }, tokenMgr);
    if (dupApprove.status !== 400 || dupApprove.body.success) {
      throw new Error("Duplicate action guard failed: Allowed duplicate approvals!");
    }
    console.log("✔ Duplicate approvals correctly blocked.");

    // 7. Employee submits second request for rejection tests
    console.log("\n7. Employee submitting second leave request (Sick Leave, 2 working days)...");
    const apply2 = await postRequest(`${baseUrl}/leaves`, {
      leaveType: "Sick",
      startDate: "2026-08-17",
      endDate: "2026-08-18",
      reason: "Medical health checkup details",
    }, tokenEmp);
    const leaveId2 = apply2.body.data.id;
    console.log(`✔ Second request submitted. ID: ${leaveId2}.`);

    // 8. Rejection validations (mandatory remarks checks)
    console.log(`\n8. Testing Rejection remarks length validator constraints for request ${leaveId2}...`);
    const failReject = await patchRequest(`${baseUrl}/manager/leave-requests/${leaveId2}/reject`, {
      remarks: "Short", // too short, requires min 10
    }, tokenMgr);
    if (failReject.status !== 400 || failReject.body.success) {
      throw new Error("Rejection validation failed: Accepted short remarks comments!");
    }
    console.log("✔ Rejected short remarks correctly.");

    console.log(`\n9. Manager Rejecting request ${leaveId2} with valid comments...`);
    const rejectAction = await patchRequest(`${baseUrl}/manager/leave-requests/${leaveId2}/reject`, {
      remarks: "Rejected due to project deadlines overlap.",
    }, tokenMgr);
    console.log("Reject response:", JSON.stringify(rejectAction.body, null, 2));
    if (rejectAction.status !== 200 || !rejectAction.body.success) {
      throw new Error("Rejection failed.");
    }
    console.log("✔ Second request rejected successfully.");

    // 9. Verify no deduction occurs on rejection
    console.log("\n10. Verifying leave balance remains unchanged after rejection...");
    const checkBalFinal = await getRequest(`${baseUrl}/leaves/balances`, tokenEmp);
    const sickBalance = checkBalFinal.body.data.find(b => b.type === "Sick");
    console.log("Sick Balance Ledger status:", JSON.stringify(sickBalance, null, 2));
    if (sickBalance.available !== 8 || sickBalance.used !== 2) {
      throw new Error("Rejection balance verification failed: available balance was changed!");
    }
    console.log("✔ Business rule validated: no balance deduction on rejection.");

    // 10. Fetch Team Calendar & Team Roster
    console.log("\n11. Fetching Team Roster (/manager/team)...");
    const team = await getRequest(`${baseUrl}/manager/team`, tokenMgr);
    console.log("Roster total:", team.body.data.total);
    if (team.status !== 200 || team.body.data.total === 0) {
      throw new Error("Failed to retrieve team members roster.");
    }
    console.log("✔ Team roster retrieved successfully.");

    console.log("\n12. Fetching Team Calendar events (/manager/calendar)...");
    const calendar = await getRequest(`${baseUrl}/manager/calendar?startDate=2026-08-01&endDate=2026-08-30`, tokenMgr);
    console.log("Events response count:", calendar.body.data.length);
    if (calendar.status !== 200) {
      throw new Error("Failed to retrieve team calendar events.");
    }
    console.log("✔ Team calendar events retrieved successfully.");

    console.log("\n=== ✅ All Manager Phase 4 Validations Passed Successfully ===");
    process.exit(0);
  } catch (error) {
    console.error(`\n=== ❌ Test Validation Failed: ${error.message} ===`);
    process.exit(1);
  }
};

runTests();
