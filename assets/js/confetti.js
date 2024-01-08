// code by >> // https://codepen.io/aaroniker/pen/bGVGNrV
// Importa la libreria GSAP. Nota: il plugin Physics2DPlugin non sembra essere utilizzato qui.
// gsap.registerPlugin(Physics2DPlugin);

// Seleziona tutti gli elementi con classe "button" e aggiunge eventi a ciascun pulsante.
document.querySelectorAll(".button").forEach((button) => {
  // Ottieni le dimensioni e la posizione del pulsante.
  //   const bounding = button.getBoundingClientRect();

  //   // Aggiunge un gestore per l'evento "mousemove" al pulsante.
  //   button.addEventListener("mousemove", (e) => {
  //     // Calcola la variazione della coordinata y rispetto al centro del pulsante e applica un limite.
  //     let dy = (e.clientY - bounding.top - bounding.height / 2) / -1;
  //     dy = dy > 10 ? 10 : dy < -10 ? -10 : dy;

  //     // Calcola la variazione della coordinata x rispetto al centro del pulsante e applica un limite.
  //     let dx = (e.clientX - bounding.left - bounding.width / 2) / 10;
  //     dx = dx > 4 ? 4 : dx < -4 ? -4 : dx;

  //     // Imposta le proprietà CSS personalizzate "--rx" e "--ry" sul pulsante.
  //     button.style.setProperty("--rx", dy);
  //     button.style.setProperty("--ry", dx);
  //   });

  //   // Aggiunge un gestore per l'evento "mouseleave" al pulsante.
  //   button.addEventListener("mouseleave", (e) => {
  //     // Resetta le proprietà CSS personalizzate "--rx" e "--ry" del pulsante.
  //     button.style.setProperty("--rx", 0);
  //     button.style.setProperty("--ry", 0);
  //   });

  // Aggiunge un gestore per l'evento "click" al pulsante.
  button.addEventListener("click", (e) => {
    // Aggiunge la classe "success" al pulsante.
    button.classList.add("success");

    // Utilizza GSAP per animare alcune proprietà del pulsante e avviare la funzione "particles".
    gsap.to(button, {
      "--icon-x": -3,
      "--icon-y": 3,
      "--z-before": 0,
      duration: 0.2,
      onComplete() {
        // Chiamata alla funzione "particles" con alcuni parametri specifici.
        particles(button.querySelector(".emitter"), 100, -4, 6, -80, -50);

        // Seconda animazione GSAP dopo il completamento della prima animazione.
        gsap.to(button, {
          "--icon-x": 0,
          "--icon-y": 0,
          "--z-before": -6,
          duration: 1,
          ease: "elastic.out(1, .5)",
          onComplete() {
            // Rimuove la classe "success" dal pulsante dopo il completamento dell'ultima animazione.
            button.classList.remove("success");
          },
        });
      },
    });
  });
});

// Definizione della funzione "particles" che crea e anima particelle.
function particles(parent, quantity, x, y, minAngle, maxAngle) {
  // Array di colori delle particelle.
  let colors = ["#FFFF04", "#EA4C89", "#892AB8", "#4AF2FD"];

  // Ciclo per creare e animare le particelle.
  for (let i = quantity - 1; i >= 0; i--) {
    // Genera un angolo, una velocità e crea un elemento "div" per la particella.
    let angle = gsap.utils.random(minAngle, maxAngle),
      velocity = gsap.utils.random(70, 140),
      dot = document.createElement("div");

    // Imposta alcune proprietà CSS per la particella.
    dot.style.setProperty("--b", colors[Math.floor(gsap.utils.random(0, 4))]);
    parent.appendChild(dot);
    gsap.set(dot, {
      opacity: 0,
      x: x,
      y: y,
      scale: gsap.utils.random(0.4, 0.7),
    });

    // Crea una timeline GSAP per animare la particella.
    gsap
      .timeline({
        onComplete() {
          // Rimuove la particella dal DOM alla fine dell'animazione.
          dot.remove();
        },
      })
      // Animazione di opacità iniziale.
      .to(
        dot,
        {
          duration: 0.05,
          opacity: 1,
        },
        0
      )
      // Animazione principale di rotazione e fisica.
      .to(
        dot,
        {
          duration: 1.8,
          rotationX: `-=${gsap.utils.random(720, 1440)}`,
          rotationZ: `+=${gsap.utils.random(720, 1440)}`,
          physics2D: {
            angle: angle,
            velocity: velocity,
            gravity: 120,
          },
        },
        0
      )
      // Animazione di opacità finale.
      .to(
        dot,
        {
          duration: 1,
          opacity: 0,
        },
        0.8
      );
  }
}
