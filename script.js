
let lang = 'pt';
const texts = {
    pt: {
        'Simulador de Negócios': 'Simulador de Negócios',
        'Escolha seu tipo de negócio:': 'Escolha seu tipo de negócio:',
        'Começar': 'Começar',
        'Próximo Dia': 'Próximo Dia',
        'Resetar Jogo': 'Resetar Jogo',
        'Idioma': 'Idioma'
    },
    en: {
        'Simulador de Negócios': 'Business Simulator',
        'Escolha seu tipo de negócio:': 'Choose your business type:',
        'Começar': 'Start',
        'Próximo Dia': 'Next Day',
        'Resetar Jogo': 'Reset Game',
        'Idioma': 'Language'
    }
};

function toggleLanguage() {
    lang = lang === 'pt' ? 'en' : 'pt';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = texts[lang][key] || key;
    });
}

function resetGame() {
    localStorage.removeItem("simBusinessSave");
    location.reload();
}

let missions = [
    { id: 1, title: "Alcance $50.000", check: () => money >= 50000, completed: false },
    { id: 2, title: "Tenha 10 funcionários", check: () => employees >= 10, completed: false },
    { id: 3, title: "Abra 3 filiais", check: () => branches >= 3, completed: false }
];

function checkMissions() {
    missions.forEach(m => {
        if (!m.completed && m.check()) {
            m.completed = true;
            const li = document.querySelector(`#mission-${m.id}`);
            if (li) li.style.textDecoration = 'line-through';
            alert("Missão Concluída: " + m.title);
        }
    });
}

function renderMissions() {
    const ul = document.getElementById("missionsList");
    if (!ul) return;
    ul.innerHTML = "";
    missions.forEach(m => {
        const li = document.createElement("li");
        li.id = `mission-${m.id}`;
        li.innerText = m.title;
        if (m.completed) li.style.textDecoration = "line-through";
        ul.appendChild(li);
    });
}

function startGame() {
    const type = document.getElementById("businessType").value;
    business = type;
    document.getElementById("setup").style.display = "none";
    document.getElementById("gameplay").style.display = "block";
    document.getElementById("businessName").innerText = type;
    renderMissions();
}
