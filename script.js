// ======================================
// CASE FILES - THE LAST SECRET
// SETH DETECTIVE SYSTEM 1.0
// ======================================

const $ = id => document.getElementById(id);

let discovered = new Set();
let seconds = 0;
let clock = null;
let gameStarted = false;

const suspects = [
  {
    name: "ASY",
    icon: "♟",
    role: "El observador",
    description: "Reservado. Afirma haber permanecido en la biblioteca.",
    testimony: "Escuché el reloj del despacho, pero no vi a nadie entrar.",
    secret: "Conocía una discusión entre Elias y otro invitado."
  },
  {
    name: "CANI",
    icon: "♜",
    role: "El invitado",
    description: "Encantador. Asegura haber estado en el salón.",
    testimony: "Estuve escuchando música durante casi toda la noche.",
    secret: "Su declaración sobre la música no coincide del todo con el registro."
  },
  {
    name: "KAY",
    icon: "♛",
    role: "El vampiro aristócrata",
    description: "Cabello plateado, ojos azul hielo. Elegante y distante.",
    testimony: "No tenía ningún motivo para acercarme al despacho.",
    secret: "Elias conservaba una carta relacionada con su familia."
  },
  {
    name: "ZAID",
    icon: "♞",
    role: "El vampiro enigmático",
    description: "Cabello negro, ojos carmesí. Seguro y reservado.",
    testimony: "Permanecí en el balcón durante el intervalo.",
    secret: "Conocía un pasadizo antiguo de la mansión."
  },
  {
    name: "LII",
    icon: "✦",
    role: "La heredera",
    description: "Cabello rubio ceniza y ojos violetas.",
    testimony: "Estaba revisando unos documentos en la galería.",
    secret: "Había discutido con Elias por una herencia."
  },
  {
    name: "ALEXANDER",
    icon: "♜",
    role: "El empresario",
    description: "Ojos ámbar, traje oscuro y carácter dominante.",
    testimony: "Salí de la mansión antes de las once y media.",
    secret: "Tenía una deuda pendiente con Elias."
  },
  {
    name: "VIOLET",
    icon: "❖",
    role: "La restauradora",
    description: "Cabello borgoña, ojos grises y estilo victoriano.",
    testimony: "No salí de la galería durante toda la noche.",
    secret: "Elias había descubierto irregularidades en una restauración."
  },
  {
    name: "DAMIEN",
    icon: "☽",
    role: "El desconocido",
    description: "Cabello blanco y ojos oscuros. Extremadamente reservado.",
    testimony: "Llegué tarde y apenas conocía a los invitados.",
    secret: "Su nombre no aparecía en la lista original."
  }
];

const clues = [
  {
    title: "01. EL RELOJ",
    text: "El reloj del despacho se detuvo a las 23:17. Sin embargo, el informe de mantenimiento indica que adelantaba once minutos.",
    hint: "No confundas la hora mostrada con la hora real."
  },
  {
    title: "02. EL REGISTRO MUSICAL",
    text: "El reproductor automático del salón registró una reproducción continua. No necesitaba que nadie permaneciera junto a él.",
    hint: "Una coartada basada en escuchar música no demuestra presencia."
  },
  {
    title: "03. EL LIBRO DEL INVERNADERO",
    text: "El registro de llaves muestra que alguien retiró una llave de servicio a las 22:55. La firma pertenece a VIOLET.",
    hint: "Compara el registro con la declaración de cada invitado."
  },
  {
    title: "04. EL FRAGMENTO",
    text: "Se encontró un fragmento de una carta. En él se lee: '...la restauración será examinada mañana. Ya conozco la verdad'.",
    hint: "¿Quién tenía motivos profesionales para temer esa revisión?"
  },
  {
    title: "05. EL INFORME DEL PASILLO",
    text: "El sensor registró actividad a las 23:06 y nuevamente a las 23:19. El sistema no identificó rostros.",
    hint: "Relaciona estos horarios con el reloj del despacho."
  },
  {
    title: "06. LA NOTA",
    text: "Una nota encontrada en la galería contiene una anotación: 'El informe debe desaparecer antes de medianoche'.",
    hint: "Busca quién tenía acceso al informe."
  },
  {
    title: "07. EL TESTIMONIO",
    text: "Un invitado recuerda haber visto a una persona con guantes borgoña cerca del corredor de servicio.",
    hint: "El color es una pista, no una identificación definitiva."
  },
  {
    title: "08. EL ARCHIVO DE RESTAURACIÓN",
    text: "El expediente profesional de Elias menciona una obra restaurada con documentación irregular. La responsable del trabajo fue VIOLET.",
    hint: "Conecta el motivo, el acceso y las contradicciones."
  }
];

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  $(id).classList.add("active");
  window.scrollTo({top: 0, behavior: "smooth"});
}

function startGame() {
  showScreen("briefing");

  const music = $("music");
  music.volume = 0.35;
  music.play().catch(() => {
    $("musicBtn").textContent = "♫ PLAY MUSIC";
  });

  if (!gameStarted) {
    gameStarted = true;
    clock = setInterval(() => {
      seconds++;
      const m = String(Math.floor(seconds / 60)).padStart(2,"0");
      const s = String(seconds % 60).padStart(2,"0");
      $("timer").textContent = `${m}:${s}`;
    }, 1000);
  }
}

function toggleMusic() {
  const music = $("music");

  if (music.paused) {
    music.play().then(() => {
      $("musicBtn").textContent = "♫ MUSIC ON";
    }).catch(() => {
      $("musicBtn").textContent = "♫ TAP TO PLAY";
    });
  } else {
    music.pause();
    $("musicBtn").textContent = "♫ MUSIC OFF";
  }
}

function renderSuspects() {
  const container = $("suspects");
  const select = $("culprit");

  suspects.forEach(person => {
    const card = document.createElement("button");
    card.className = "suspect-card";

    card.innerHTML = `
      <div class="avatar">${person.icon}</div>
      <h4>${person.name}</h4>
      <p>${person.role}</p>
      <p>${person.description}</p>
    `;

    card.addEventListener("click", () => {
      showDossier(person);
    });

    container.appendChild(card);

    const option = document.createElement("option");
    option.value = person.name;
    option.textContent = person.name;
    select.appendChild(option);
  });
}

function showDossier(person) {
  const message = `
PERSONAJE: ${person.name}

CLASIFICACIÓN: ${person.role}

DECLARACIÓN:
${person.testimony}

INFORMACIÓN RESERVADA:
${person.secret}
`;

  alert(message);
}

function renderClues() {
  const container = $("clues");

  clues.forEach((clue, index) => {
    const card = document.createElement("button");
    card.className = "clue-card";

    card.innerHTML = `
      <strong>${clue.title}</strong>
      <p>ARCHIVO CONFIDENCIAL</p>
      <small>ABRIR EVIDENCIA →</small>
    `;

    card.addEventListener("click", () => {
      if (!discovered.has(index)) {
        discovered.add(index);
        updateProgress();
        card.style.borderColor = "#b94b6c";
        card.querySelector("small").textContent = "✓ INVESTIGADA";
      }

      alert(
        clue.title + "\n\n" +
        clue.text + "\n\n" +
        "PISTA DE ANÁLISIS:\n" + clue.hint
      );
    });

    container.appendChild(card);
  });
}

function updateProgress() {
  $("clueCount").textContent = `${discovered.size}/8`;

  if (discovered.size === 8) {
    $("progressText").textContent =
      "Todas las evidencias han sido examinadas. Es momento de formular una teoría.";
  } else {
    $("progressText").textContent =
      `Has examinado ${discovered.size} de 8 evidencias.`;
  }
}

function submitAccusation() {
  const selected = $("culprit").value;
  const reason = $("reason").value.trim();

  if (!selected) {
    alert("ERROR: Debes seleccionar un sospechoso.");
    return;
  }

  if (reason.length < 30) {
    alert("Tu informe es demasiado breve. Explica tus deducciones.");
    return;
  }

  const correct = selected === "VIOLET";
  const total = discovered.size;

  clearInterval(clock);

  const result = $("resultContent");

  if (correct) {
    const perfect = total === 8 && reason.length >= 100;

    result.innerHTML = `
      <div class="reward">
        <p>SETH SYSTEM • CASE 008</p>
        <h1>CASE SOLVED</h1>
        <div class="ornament">✦ ━━━━━━━ ✦</div>
        <h2>SUPERASTE A SETH</h2>
        <h2>¡FELICIDADES!</h2>
        <p>
          ${perfect
            ? "MASTER DETECTIVE"
            : "DETECTIVE CLASS"}
        </p>
        <p>Has identificado correctamente al responsable.</p>
        <p>Evidencias examinadas: ${total}/8</p>
        <p>Tiempo de investigación: ${$("timer").textContent}</p>
        <p>THE LAST SECRET • WINNER EDITION</p>
        <button class="primary-btn" onclick="downloadCertificate('${perfect ? "MASTER DETECTIVE" : "DETECTIVE"}')">
          CLAIM YOUR REWARD
        </button>
      </div>
    `;
  } else {
    result.innerHTML = `
      <div class="paper">
        <h2 class="red-text">INVESTIGATION FAILED</h2>
        <p>Tu acusación no coincide con la solución del expediente.</p>
        <p>El caso permanece abierto.</p>
        <p>Evidencias examinadas: ${total}/8</p>
        <button class="secondary-btn" onclick="showScreen('investigation')">
          REVIEW THE EVIDENCE
        </button>
      </div>
    `;
  }

  showScreen("result");
}

function downloadCertificate(rank) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 850;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#10070b";
  ctx.fillRect(0, 0, 1200, 850);

  ctx.strokeStyle = "#bd2449";
  ctx.lineWidth = 8;
  ctx.strokeRect(35, 35, 1130, 780);

  ctx.strokeStyle = "#b79a72";
  ctx.lineWidth = 2;
  ctx.strokeRect(55, 55, 1090, 740);

  ctx.textAlign = "center";

  ctx.fillStyle = "#b79a72";
  ctx.font = "bold 32px Georgia";
  ctx.fillText("S E T H   •   D E T E C T I V E   S Y S T E M", 600, 160);

  ctx.fillStyle = "#e8dce0";
  ctx.font = "bold 78px Georgia";
  ctx.fillText("CASE SOLVED", 600, 300);

  ctx.fillStyle = "#bd2449";
  ctx.font = "bold 65px Georgia";
  ctx.fillText("SUPERASTE A SETH", 600, 415);

  ctx.fillStyle = "#e8dce0";
  ctx.font = "bold 48px Georgia";
  ctx.fillText("FELICIDADES", 600, 500);

  ctx.fillStyle = "#b79a72";
  ctx.font = "30px Georgia";
  ctx.fillText(rank, 600, 590);

  ctx.fillStyle = "#927b84";
  ctx.font = "23px Georgia";
  ctx.fillText("THE LAST SECRET • WINNER EDITION", 600, 690);
  ctx.fillText("CLASSIFIED INVESTIGATION UNIT", 600, 740);

  const link = document.createElement("a");
  link.download = "SETH-DETECTIVE-AWARD.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function createParticles() {
  const container = $("particles");

  for (let i = 0; i < 35; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = (6 + Math.random() * 12) + "s";
    particle.style.animationDelay = Math.random() * 10 + "s";
    particle.style.opacity = Math.random() * 0.7;
    container.appendChild(particle);
  }
}

renderSuspects();
renderClues();
createParticles();
