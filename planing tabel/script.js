let currentPlanning = null;

let plannings =
JSON.parse(
localStorage.getItem("plannings")
|| "[]"
);

const planningList =
document.getElementById("planningList");

const planningBody =
document.getElementById("planningBody");

const planningTitle =
document.getElementById("planningTitle");

/* =========================
   SAUVEGARDE
========================= */

function savePlannings(){

    localStorage.setItem(
        "plannings",
        JSON.stringify(plannings)
    );
}

/* =========================
   RECHERCHE
========================= */

function searchPlannings(){

    const query =
    document.getElementById("search")
    .value
    .toLowerCase();

    loadPlannings(query);
}

/* =========================
   CHARGER LISTE
========================= */

function loadPlannings(search = ""){

    planningList.innerHTML = "";

    const sorted =
    [...plannings].sort(
        (a,b) =>
        b.favorite - a.favorite
    );

    sorted.forEach(planning => {

        if(
            !planning.name
            .toLowerCase()
            .includes(search)
        ){
            return;
        }

        const card =
        document.createElement("div");

        card.className = "card";

        card.style.borderLeft =
        `8px solid ${planning.color}`;

        card.innerHTML = `
            <div>
                ${
                  planning.favorite
                  ? "⭐"
                  : ""
                }
                ${planning.name}
            </div>

            <div class="actions">

                <button
                onclick="toggleFavorite(event,'${planning.id}')">
                ⭐
                </button>

                <button
                onclick="renamePlanning(event,'${planning.id}')">
                ✏️
                </button>

                <button
                onclick="deletePlanning(event,'${planning.id}')">
                🗑️
                </button>

            </div>
        `;

        card.onclick = () => {
            openPlanning(planning.id);
        };

        planningList.appendChild(card);
    });
}

/* =========================
   AJOUT
========================= */

function addPlanning(){

    const name =
    prompt(
        "Nom du planning :"
    );

    if(!name) return;

    if(
        plannings.some(
            p =>
            p.name.toLowerCase() ===
            name.toLowerCase()
        )
    ){
        alert("Ce nom existe déjà.");
        return;
    }

    const color =
    prompt(
        "Couleur CSS (#3b82f6 par exemple)",
        "#3b82f6"
    );

    const planning = {
        id: Date.now(),
        name,
        color,
        favorite:false
    };

    plannings.push(planning);

    savePlannings();

    loadPlannings();
}

/* =========================
   FAVORI
========================= */

function toggleFavorite(e,id){

    e.stopPropagation();

    const planning =
    plannings.find(
        p => p.id == id
    );

    planning.favorite =
    !planning.favorite;

    savePlannings();

    loadPlannings();
}

/* =========================
   RENOMMER
========================= */

function renamePlanning(e,id){

    e.stopPropagation();

    const planning =
    plannings.find(
        p => p.id == id
    );

    const newName =
    prompt(
        "Nouveau nom",
        planning.name
    );

    if(!newName) return;

    planning.name = newName;

    savePlannings();

    loadPlannings();
}

/* =========================
   SUPPRIMER
========================= */

function deletePlanning(e,id){

    e.stopPropagation();

    if(
        !confirm(
            "Supprimer ce planning ?"
        )
    ){
        return;
    }

    plannings =
    plannings.filter(
        p => p.id != id
    );

    savePlannings();

    loadPlannings();
}

/* =========================
   OUVRIR
========================= */

function openPlanning(id){

    currentPlanning = id;

    const planning =
    plannings.find(
        p => p.id == id
    );

    document.getElementById(
        "home"
    ).style.display = "none";

    document.getElementById(
        "planner"
    ).style.display = "block";

    planningTitle.textContent =
    planning.name;

    createSchedule();
}

/* =========================
   RETOUR
========================= */

function goHome(){

    document.getElementById(
        "planner"
    ).style.display = "none";

    document.getElementById(
        "home"
    ).style.display = "block";
}

/* =========================
   MODE SOMBRE
========================= */

function toggleTheme(){

    document.body.classList
    .toggle("light");

    const mode =
    document.body.classList
    .contains("light")
    ? "light"
    : "dark";

    localStorage.setItem(
        "theme",
        mode
    );
}

if(
    localStorage.getItem("theme")
    ===
    "light"
){
    document.body.classList
    .add("light");
}

/* =========================
   EXPORT PDF
========================= */

function exportPDF(){

    window.print();
}

/* =========================
   MATIERES
========================= */

const colors = {

    "maths":"#3b82f6",
    "français":"#ef4444",
    "anglais":"#22c55e",
    "arabe":"#ffa200",
    "histoire":"#8b5cf6",
    "géographie":"#8b5cf6",
    "éducation Civique":"#8b5cf6",
    "physique":"#bbac0b",
    "chimie":"#14b8a6",
    "svt":"#22c548",
    "informatique":"#6366f1",
    "technologie":"#c34c16",
    "sport":"#dc2626",
    "islamique":"#00ff66",
    "philosophie":"#f97316"
     
};

function getSubjectColor(subject){

    subject =
    subject.toLowerCase().trim();

    return (
        colors[subject]
        ||
        "#ffffff"
    );
}

/* =========================
   TABLEAU
========================= */

function createSchedule(){

    planningBody.innerHTML = "";

    for(let h=8; h<20; h++){

        const row =
        document.createElement("tr");

        const hour =
        document.createElement("td");

        hour.className = "hour";

        hour.textContent =
        `${h}:00 - ${h+1}:00`;

        row.appendChild(hour);

        for(let d=0; d<7; d++){

            const cell =
            document.createElement("td");

            cell.className =
            "course";

            const key =
            `${currentPlanning}-${d}-${h}`;

            const saved =
            localStorage.getItem(key);

            if(saved){

                cell.textContent =
                saved;

                const color =
                getSubjectColor(saved);

                cell.style.background =
                color;

                cell.style.color =
                color === "#ffffff"
                ? "#000"
                : "#fff";
            }

            cell.onclick = () => {

                const value =
                prompt(
                    "Matière :",
                    cell.textContent
                );

                if(value === null)
                return;

                if(
                    value.trim() === ""
                ){

                    localStorage.removeItem(
                        key
                    );

                    cell.textContent =
                    "";

                    cell.style.background =
                    "#fff";

                    return;
                }

                localStorage.setItem(
                    key,
                    value
                );

                cell.textContent =
                value;

                const color =
                getSubjectColor(value);

                cell.style.background =
                color;

                cell.style.color =
                color === "#ffffff"
                ? "#000"
                : "#fff";
            };

            row.appendChild(cell);
        }

        planningBody.appendChild(row);
    }
}

/* =========================
   INITIALISATION
========================= */

loadPlannings();