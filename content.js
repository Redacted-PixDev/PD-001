(() => {
  console.log("[Roblox Auto Friend Accepter] Loaded.");

  // Create Start button
  const startBtn = document.createElement("button");
  startBtn.textContent = "▶ Start Auto Accept";
  Object.assign(startBtn.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: "99999",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#00b06f",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "background 0.2s",
  });
  startBtn.onmouseover = () => (startBtn.style.backgroundColor = "#00945c");
  startBtn.onmouseleave = () => (startBtn.style.backgroundColor = "#00b06f");

  document.body.appendChild(startBtn);

  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  // Detect dynamically loaded friend requests
  const getAcceptButtons = () => {
    const allButtons = Array.from(document.querySelectorAll("button"));

    // Match buttons with "accept" text or icons commonly used by Roblox
    return allButtons.filter((btn) => {
      const text = btn.textContent.trim().toLowerCase();
      return (
        text.includes("accept") ||
        btn.getAttribute("data-testid")?.includes("accept") ||
        btn.querySelector('svg[fill*="green"]')
      );
    });
  };

  startBtn.addEventListener("click", async () => {
    startBtn.disabled = true;
    startBtn.textContent = "⏳ Scanning...";
    console.log("[Roblox Auto Friend Accepter] Starting...");

    await wait(2000);

    // Wait up to 10 seconds for friend requests to load dynamically
    let buttons = [];
    for (let i = 0; i < 10 && buttons.length === 0; i++) {
      buttons = getAcceptButtons();
      if (buttons.length === 0) await wait(1000);
    }

    if (buttons.length === 0) {
      console.log("⚠️ No friend request Accept buttons found. The Roblox layout might have changed.");
      startBtn.textContent = "⚠️ None Found";
      startBtn.style.backgroundColor = "#ff4444";
      return;
    }

    console.log(`Found ${buttons.length} friend requests.`);
    startBtn.textContent = `⏳ Accepting (${buttons.length})...`;

    const acceptedLog = JSON.parse(localStorage.getItem("acceptedFriends") || "[]");
    let count = 0;

    for (const btn of buttons) {
      const container = btn.closest("[data-testid], [class*='friend']");
      const nameEl =
        container?.querySelector("a, span, div[data-testid*='name']") ||
        container?.querySelector("span");
      const username = nameEl ? nameEl.textContent.trim() : "Unknown";

      btn.click();
      console.log(`✅ Accepted: ${username}`);
      acceptedLog.push({ username, acceptedAt: new Date().toLocaleString() });

      count++;
      await wait(800 + Math.random() * 600);
    }

    localStorage.setItem("acceptedFriends", JSON.stringify(acceptedLog));
    console.log(`🎉 Done! Accepted ${count} friend requests.`);
    startBtn.textContent = `✅ Accepted ${count}`;
    startBtn.style.backgroundColor = "#0078ff";
  });
})();
