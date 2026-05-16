const passwordInput = document.getElementById("inputPassword5");
const toggleIcon = document.querySelector(".togglePassword");

toggleIcon.addEventListener("click", () => {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  toggleIcon.classList.toggle("fa-eye");
  toggleIcon.classList.toggle("fa-eye-slash");
});

VANTA.NET({
  el: "#right",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
  scale: 1.0,
  scaleMobile: 1.0,
  color: 0x3c5368,
  backgroundColor: 0x213448,
  points: 15.0,
  maxDistance: 27.0,
  spacing: 16.0,
});

const loginEmail = document.querySelector(".email");
const loginPass = document.querySelector(".pass");
const loginButton = document.querySelector("button");
const errorText = document.querySelector(".error");

function showLoginError(message) {
  errorText.textContent = message;
  errorText.classList.remove("d-none");
}

function hideLoginError() {
  errorText.classList.add("d-none");
}

async function login() {
  const email = loginEmail.value.trim();
  const password = loginPass.value;

  if (!email || !password) {
    showLoginError("Please enter your email and password.");
    return;
  }

  hideLoginError();
  loginButton.disabled = true;
  const label = loginButton.textContent;
  loginButton.textContent = "Logging in…";

  try {
    const { response, result } = await AuthApi.apiPost("/login", {
      email,
      password,
    });

    if (response.ok) {
      const payload = AuthApi.getAuthPayload(result);
      if (payload) AuthApi.saveAuth(payload);
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next || "../index.html";
      return;
    }

    const fallback =
      response.status === 401
        ? "Incorrect email or password."
        : response.status === 403
          ? "Your account is not active."
          : "Login failed.";
    showLoginError(AuthApi.getErrorMessage(result, fallback));
    clear();
  } catch (err) {
    showLoginError("Network error: " + err.message);
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = label;
  }
}

function clear() {
  loginEmail.value = "";
  loginPass.value = "";
}

loginButton.addEventListener("click", login);

loginPass.addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});

loginEmail.addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});
