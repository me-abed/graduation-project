(function (global) {
  function setShown(el, show) {
    if (!el) return;
    el.style.display = show ? "" : "none";
    if (show) el.removeAttribute("hidden");
    else el.setAttribute("hidden", "");
  }

  function renderNav(container) {
    const signup = container.querySelector(".auth-signup");
    const login = container.querySelector(".auth-login");
    const logout = container.querySelector(".auth-logout");
    const loggedIn = global.AuthApi && AuthApi.isLoggedIn();

    setShown(signup, !loggedIn);
    setShown(login, !loggedIn);
    setShown(logout, loggedIn);
  }

  function renderAuthGated() {
    const loggedIn = global.AuthApi && AuthApi.isLoggedIn();
    document.querySelectorAll(".auth-gated").forEach((el) => {
      setShown(el, loggedIn);
    });
  }

  async function handleLogout(button) {
    if (!global.AuthApi) return;

    button.disabled = true;
    const label = button.textContent;
    button.textContent = "Signing out…";

    try {
      await AuthApi.logout();
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  }

  function initAuthNav() {
    document.querySelectorAll("[data-auth-nav]").forEach((container) => {
      if (container.dataset.authBound !== "1") {
        container.dataset.authBound = "1";
        const logoutBtn = container.querySelector(".auth-logout");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            handleLogout(logoutBtn);
          });
        }
      }
      renderNav(container);
    });
    renderAuthGated();
  }

  global.initAuthNav = initAuthNav;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuthNav);
  } else {
    initAuthNav();
  }
})(window);
