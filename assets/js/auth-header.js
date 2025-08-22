// assets/js/auth-header.js
const API_BASE = "https://lailastreasures.onrender.com";

/**
 * Helper: add an <li> to the nav menu
 */
function addNavItem(html) {
  const li = document.createElement("li");
  li.className = "user-nav";
  li.innerHTML = html;
  document.getElementById("navMenu").appendChild(li);
  return li;
}

/**
 * Refresh the header (runs on every page load)
 */
async function refreshHeader() {
  const nav = document.getElementById("navMenu");
  if (!nav) return;

  // Remove any previously injected user-specific items
  nav.querySelectorAll(".user-nav").forEach(el => el.remove());

  try {
    const r = await fetch(`${API_BASE}/api/users/me`, {
      credentials: "include"
    });
    const me = r.ok ? await r.json() : { loggedIn: false };

    if (me.loggedIn) {
      // Show (Name) and Logout
      addNavItem(
        `<span style="font-weight:bold;color:yellow;">(${me.name || "User"})</span>`
      );
      const logoutLi = addNavItem(`<a href="#" id="logoutBtn">Logout</a>`);
      const btn = logoutLi.querySelector("#logoutBtn");
      btn.addEventListener("click", handleLogout);
    } else {
      // Show Login + Create Account
      addNavItem(`<a href="login.html">Login</a>`);
      addNavItem(`<a href="register.html">Create Account</a>`);
    }
  } catch (err) {
    console.error("Header refresh error:", err);
    // Fallback: show login links
    addNavItem(`<a href="login.html">Login</a>`);
    addNavItem(`<a href="register.html">Create Account</a>`);
  }
}

/**
 * Handle logout
 */
async function handleLogout(e) {
  e.preventDefault();
  try {
    await fetch(`${API_BASE}/api/users/logout`, {
      method: "POST",
      credentials: "include"
    });
  } catch (_) {}
  location.href = "login.html";
}

// Run after DOM is loaded
document.addEventListener("DOMContentLoaded", refreshHeader);