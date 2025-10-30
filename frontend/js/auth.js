const authWrap   = document.getElementById("auth");
const loginEmail = document.getElementById("loginEmail");
const loginPass  = document.getElementById("loginPass");
const btnLogin   = document.getElementById("btnLogin");
const showSignup = document.getElementById("showSignup");
const signupCard = document.getElementById("signupCard");
const showLogin  = document.getElementById("showLogin");
const signupName = document.getElementById("signupName");
const signupEmail= document.getElementById("signupEmail");
const signupPass = document.getElementById("signupPass");
const signupRole = document.getElementById("signupRole");
const btnSignup  = document.getElementById("btnSignup");

(() => { if (loadSession()) window.location.href = "./app.html"; })();

btnLogin.addEventListener("click", async () => {
  try {
    const email = loginEmail.value.trim();
    const pass  = loginPass.value;
    if (!email || !pass) return alert("Preencha e-mail e senha.");

    const user = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, pass }) });
    saveSession(user);
    window.location.href = "./app.html";
  } catch (e) {
    alert("Falha no login: " + e.message);
  }
});

showSignup.addEventListener("click", () => signupCard.classList.remove("hidden"));
showLogin.addEventListener("click",  () => signupCard.classList.add("hidden"));

btnSignup.addEventListener("click", async () => {
  try {
    const name  = signupName.value.trim();
    const email = signupEmail.value.trim();
    const pass  = signupPass.value;
    const role  = signupRole.value;
    if (!name || !email || !pass) return alert("Preencha nome, e-mail e senha.");

    await api("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, pass, role }) });
    alert("Conta criada! Faça login.");
    signupCard.classList.add("hidden");
  } catch (e) {
    alert("Falha no cadastro: " + e.message);
  }
});
