
let day = 1;
let money = 10000;
let stock = 50;
let employees = 2;
let price = 100;
let marketing = 1;
let rnd = 1;
let branches = 1;
let reputation = 50;
let business = "";

let history = {
    days: [1],
    money: [money],
    employees: [employees],
    stock: [stock]
};

let competitors = [
    { name: "Empresa A", price: 110, marketing: 2, rnd: 1 },
    { name: "Empresa B", price: 90, marketing: 1, rnd: 2 },
    { name: "Empresa C", price: 100, marketing: 3, rnd: 1 }
];

function startGame() {
    const type = document.getElementById("businessType").value;
    business = type;
    document.getElementById("setup").style.display = "none";
    document.getElementById("gameplay").style.display = "block";
    document.getElementById("businessName").innerText = type;

    // Carregar progresso
    loadGame();
    updateUI();
    updateChart();
    updateCompetitorTable();
}

function getRandomEvent() {
    const events = [
        { desc: "Crise econômica! Queda de vendas.", effect: () => money *= 0.9 },
        { desc: "Boom de mercado! Vendas aumentam.", effect: () => money *= 1.1 },
        { desc: "Inspeção fiscal! Multa de $500.", effect: () => money -= 500 },
        { desc: "Funcionário do mês! +1 funcionário.", effect: () => employees += 1 },
        { desc: "Campanha viral! Marketing +1.", effect: () => marketing += 1 },
        { desc: "Falha de produção! Estoque -10.", effect: () => stock = Math.max(stock - 10, 0) },
        { desc: "Cliente investidor! +$1000.", effect: () => money += 1000 },
        { desc: "Greve relâmpago! Produção zero hoje.", effect: () => productionBlocked = true },
        { desc: "Escândalo na mídia! Reputação -10.", effect: () => reputation = Math.max(0, reputation - 10) },
        { desc: "Prêmio de excelência! Reputação +10.", effect: () => reputation = Math.min(100, reputation + 10) }
    ];
    return events[Math.floor(Math.random() * events.length)];
}

function simulateCompetitors() {
    competitors.forEach(c => {
        if (Math.random() < 0.5) c.price += Math.random() < 0.5 ? -5 : 5;
        if (Math.random() < 0.3) c.marketing += 1;
        if (Math.random() < 0.2) c.rnd += 1;
    });
}

function calculateSalesWithClients() {
    const clientTypes = [
        { type: "Econômico", weight: 0.4, prefers: "preço" },
        { type: "Qualidade", weight: 0.3, prefers: "rnd" },
        { type: "Influenciado", weight: 0.3, prefers: "marketing" }
    ];

    let totalSales = 0;
    clientTypes.forEach(client => {
        let yourInfluence = 0;
        if (client.prefers === "preço") yourInfluence = Math.max(0, 200 - price);
        else if (client.prefers === "rnd") yourInfluence = rnd * 10;
        else if (client.prefers === "marketing") yourInfluence = marketing * 8;
        yourInfluence += reputation / 5;

        let totalInfluence = yourInfluence;
        competitors.forEach(c => {
            let cInfluence = 0;
            if (client.prefers === "preço") cInfluence = Math.max(0, 200 - c.price);
            else if (client.prefers === "rnd") cInfluence = c.rnd * 10;
            else if (client.prefers === "marketing") cInfluence = c.marketing * 8;
            totalInfluence += cInfluence;
        });

        let share = yourInfluence / totalInfluence;
        totalSales += Math.floor((share * 100 * branches) * client.weight);
    });

    return Math.min(stock, totalSales);
}

function nextDay() {
    let productionBlocked = false;
    const event = getRandomEvent();
    event.effect();
    simulateCompetitors();
    document.getElementById('event').innerText = event.desc;

    day++;
    const salaryCost = employees * 100;
    const expenses = salaryCost + (marketing * 100) + (rnd * 150);
    const sales = calculateSalesWithClients();
    const revenue = sales * price;
    const profit = revenue - expenses;

    money += profit;
    stock -= sales;

    if (!productionBlocked) {
        stock += employees * rnd;
    }

    history.days.push(day);
    history.money.push(Math.floor(money));
    history.employees.push(employees);
    history.stock.push(Math.floor(stock));

    saveGame();
    updateUI();
    updateChart();
    updateCompetitorTable();
}

function hire() {
    if (money >= 500) {
        employees++;
        money -= 500;
        updateUI();
    }
}

function fire() {
    if (employees > 0) {
        employees--;
        updateUI();
    }
}

function increasePrice() {
    price += 10;
    updateUI();
}

function decreasePrice() {
    if (price > 10) {
        price -= 10;
        updateUI();
    }
}

function investMarketing() {
    if (money >= 300) {
        marketing++;
        money -= 300;
        updateUI();
    }
}

function investRND() {
    if (money >= 500) {
        rnd++;
        money -= 500;
        updateUI();
    }
}

function openBranch() {
    if (money >= 3000) {
        branches++;
        money -= 3000;
        updateUI();
    }
}

function updateUI() {
    document.getElementById("day").innerText = day;
    document.getElementById("money").innerText = Math.floor(money);
    document.getElementById("stock").innerText = Math.floor(stock);
    document.getElementById("employees").innerText = employees;
    document.getElementById("price").innerText = price;
    document.getElementById("marketing").innerText = marketing;
    document.getElementById("rnd").innerText = rnd;
    document.getElementById("reputation").innerText = reputation;
    document.getElementById("branches").innerText = branches;
}

function updateCompetitorTable() {
    const tbody = document.getElementById("competitorTable");
    tbody.innerHTML = "";
    competitors.forEach(c => {
        const row = `<tr><td>${c.name}</td><td>$${c.price}</td><td>${c.marketing}</td><td>${c.rnd}</td></tr>`;
        tbody.innerHTML += row;
    });
}

let chart;

function updateChart() {
    if (!chart) {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: history.days,
                datasets: [
                    { label: 'Dinheiro', data: history.money, borderWidth: 2 },
                    { label: 'Funcionários', data: history.employees, borderWidth: 2 },
                    { label: 'Estoque', data: history.stock, borderWidth: 2 }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } else {
        chart.data.labels = history.days;
        chart.data.datasets[0].data = history.money;
        chart.data.datasets[1].data = history.employees;
        chart.data.datasets[2].data = history.stock;
        chart.update();
    }
}

// Salvamento de progresso
function saveGame() {
    const state = {
        day, money, stock, employees, price,
        marketing, rnd, branches, reputation, history
    };
    localStorage.setItem("simBusinessSave", JSON.stringify(state));
}

function loadGame() {
    const data = localStorage.getItem("simBusinessSave");
    if (data) {
        const state = JSON.parse(data);
        Object.assign(window, state);
    }
}



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
