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
   "maths":
   "linear-gradient(135deg,#0052ff,#3b82f6)",
"français":"linear-gradient(135deg,#dc2626,#fb7185)",
"anglais":"linear-gradient(135deg,#16a34a,#4ade80)",
"arabe":"linear-gradient(135deg,#ea580c,#fdba74)",
"histoire":"linear-gradient(135deg,#7c3aed,#c084fc)",
"géographie":"linear-gradient(135deg,#9333ea,#e879f9)",
"éducation civique":"linear-gradient(135deg,#1e40af,#60a5fa)",
"physique":"linear-gradient(135deg,#0284c7,#67e8f9)",
"chimie":"linear-gradient(135deg,#0f766e,#5eead4)",
"svt":"linear-gradient(135deg,#15803d,#86efac)",
"informatique":"linear-gradient(135deg,#4338ca,#818cf8)",
"technologie":"linear-gradient(135deg,#db2777,#f9a8d4)",
"sport":"linear-gradient(135deg,#b91c1c,#f87171)",
"islamique":"linear-gradient(135deg,#65a30d,#d9f99d)",
"philosophie":"linear-gradient(135deg,#d97706,#fcd34d)",
"dessin":"linear-gradient(135deg,#c026d3,#f0abfc)",
"musique":"linear-gradient(135deg,#be185d,#f472b6)",
"espagnol":"linear-gradient(135deg,#e11d48,#fda4af)",
"allemand":"linear-gradient(135deg,#475569,#cbd5e1)",
"économie":"linear-gradient(135deg,#0284c7,#93c5fd)",
"gestion":"linear-gradient(135deg,#0369a1,#7dd3fc)",
"hyper nova":"linear-gradient(135deg,#ff0000,#ff7300,#ffd700)",
 "revision":"linear-gradient(135deg,#1500ff,#1f0045)",
 "aprendre":"linear-gradient(135deg,#ff0000,#00d5ec)",
"devoirs":"linear-gradient(135deg,#f59e0b,#fde68a)"
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