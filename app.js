// ---------- helpers ----------
function collectForm(formEl) {
    const data = {};
    const fd = new FormData(formEl);
    for (const [name, value] of fd.entries()) {
        if (data[name]) {
            if (Array.isArray(data[name])) data[name].push(value);
            else data[name] = [data[name], value];
        } else data[name] = value;
    }
    formEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (!fd.has(cb.name)) data[cb.name] = [];
    });
    return data;
}
function sameSet(a = [], b = []) {
    const A = [...a].sort(); const B = [...b].sort();
    return JSON.stringify(A) === JSON.stringify(B);
}
function normalizeLower(s){ return (s||"").trim().toLowerCase(); }
function digitsOnly(s){ return (s||"").toString().replace(/\D/g,""); }

// ---------- correct answers ----------
const correct = {
    "out-nextto-cafe": "Pond",                     // Q1
    "out-starbucks": "19",                         // Q2 (digits only)
    "out-near-gym": "Building 1",                  // Q3
    "out-trail": "mission peak",                   // Q4 (case-insensitive)
    "out-animals": ["Turtles","Koi Fish"]          // Q5 (multi)
};

const REDIRECT_URL = "https://ohlonecicada.netlify.app/";

// ---------- overall checker ----------
function allAnswersCorrect(ans) {
    const q1 = (ans["out-nextto-cafe"] || "") === correct["out-nextto-cafe"];
    const q2 = digitsOnly(ans["out-starbucks"]) === correct["out-starbucks"];
    const q3 = (ans["out-near-gym"] || "") === correct["out-near-gym"];
    const q4 = normalizeLower(ans["out-trail"]) === correct["out-trail"];
    const q5 = sameSet(ans["out-animals"] || [], correct["out-animals"]);
    return q1 && q2 && q3 && q4 && q5;
}

// ---------- modal controls ----------
const overlay = document.getElementById("modal-overlay");
const modal = document.getElementById("access-modal");
const okBtn = document.getElementById("modal-ok");
function showModal(){ overlay.classList.remove("hidden"); modal.classList.remove("hidden"); overlay.setAttribute("aria-hidden","false"); }
function hideModal(){ overlay.classList.add("hidden"); modal.classList.add("hidden"); overlay.setAttribute("aria-hidden","true"); }

// ---------- wire up ----------
const form = document.getElementById("quiz-form");
const results = document.getElementById("results");
const resetAll = document.getElementById("resetAll");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = allAnswersCorrect(collectForm(form));
    results.textContent = ok ? "All correct! 🎉" : "Not quite — try again.";
    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (ok) showModal(); // shows PQND"
});

okBtn.addEventListener("click", () => {
    hideModal();
    window.location.href = REDIRECT_URL;
});

overlay.addEventListener("click", hideModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

resetAll.addEventListener("click", () => {
    form.reset();
    results.textContent = "";
    hideModal();
});
