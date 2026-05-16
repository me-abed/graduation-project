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

const userName = document.querySelector(".name");
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const signUp = document.querySelector("button");
const successEl = document.querySelector(".done");
const errorEl = document.querySelector(".erorr");

function showSignupError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove("d-none");
  successEl.classList.add("d-none");
}

function showSignupSuccess(message) {
  successEl.textContent = message;
  successEl.classList.remove("d-none");
  errorEl.classList.add("d-none");
}

function hideSignupMessages() {
  successEl.classList.add("d-none");
  errorEl.classList.add("d-none");
}

async function register() {
  const name = userName.value.trim();
  const emailVal = email.value.trim();
  const pass = password.value;

  if (!name || !emailVal || !pass) {
    showSignupError("Please fill in all fields.");
    return;
  }
  if (pass.length < 6) {
    showSignupError("Password must be at least 6 characters.");
    return;
  }

  hideSignupMessages();
  signUp.disabled = true;
  const label = signUp.textContent;
  signUp.textContent = "Signing up…";

  try {
    const { response, result } = await AuthApi.apiPost("/register", {
      name,
      email: emailVal,
      password: pass,
    });

    if (response.ok) {
      const payload = AuthApi.getAuthPayload(result);
      if (payload) AuthApi.saveAuth(payload);
      showSignupSuccess("Account created. Redirecting…");
      cleanInput();
      setTimeout(() => {
        const next = new URLSearchParams(window.location.search).get("next");
        window.location.href = next || "../index.html";
      }, 800);
      return;
    }

    showSignupError(
      AuthApi.getErrorMessage(result, "Registration failed. Please try again.")
    );
  } catch (err) {
    showSignupError("Network error: " + err.message);
  } finally {
    signUp.disabled = false;
    signUp.textContent = label;
  }
}

function cleanInput() {
  userName.value = "";
  email.value = "";
  password.value = "";
}

signUp.addEventListener("click", register);

password.addEventListener("keydown", (event) => {
  if (event.key === "Enter") register();
});
