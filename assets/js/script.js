window.addEventListener("DOMContentLoaded", () => {
  const HBbtn = document.getElementById("HBbtn");
  HBbtn.onclick = handleButtonClick;
  startRecName();
});

let readDataInterval;
let initialOpacitiCandle = 100;

async function handleButtonClick() {
  const audioContextData = await initAudioContext();
  generateCandles();
  startRecording(audioContextData);
}

// Inizializzazione e ritorno dell'AudioContext come promessa
async function initAudioContext() {
  const context = new AudioContext();
  let gainWorkletNode;

  await context.audioWorklet.addModule("assets/js/gain-processor.js");
  gainWorkletNode = new AudioWorkletNode(context, "gain-processor");

  return { context, gainWorkletNode };
}

// Avvio della registrazione audio
function startRecording({ context, gainWorkletNode }) {
  if (!gainWorkletNode) {
    console.error("GainNode non inizializzato correttamente.");
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      // const audioContext = gainNode.context;
      const microphone = context.createMediaStreamSource(stream);

      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Connessione del microfono all'analizzatore
      microphone.connect(analyser);
      analyser.connect(gainWorkletNode);

      const recognition = new (window.webkitSpeechRecognition ||
        window.SpeechRecognition)();
      recognition.lang = "it-IT";

      recognition.onstart = () => {
        console.log("Registrazione avviata. Parla o soffia nel microfono.");

        // Legge continuamente i dati dell'analizzatore
        readDataInterval = setInterval(() => {
          readAnalyzerData(recognition, analyser, dataArray);
        }, 100);
        // // Imposta l'evento onaudioprocess dell'AudioWorkletNode per iniziare la lettura
        // gainWorkletNode.onaudioprocess = () => {
        //   readAnalyzerData(recognition, analyser, dataArray);
        // };
      };

      recognition.onerror = (event) => {
        console.error("Errore durante la registrazione:", event.error);
      };

      // setTimeout(() => {
      recognition.onend = () => {
        console.log("Registrazione terminata.");
      };
      // }, 5000);
      // Inizia la registrazione audio
      recognition.start();
    })
    .catch((error) => {
      console.error("Errore durante l'accesso al microfono:", error);
    });
}

// Lettura e analisi dei dati dell'analizzatore
function readAnalyzerData(recognition, analyser, dataArray) {
  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript.trim();
    console.log("Il tuo risultato:", result);
    console.log("Dati dell'analizzatore:", dataArray);
  };

  analyser.getByteFrequencyData(dataArray);
  // console.log(
  //   "Dati dell'analizzatore prima del calcolo del volume medio:",
  //   dataArray
  // );
  const averageVolume = Math.round(
    dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length
  );
  // console.log("Volume medio:", averageVolume);
  const threshold = 60;
  const backgroundNoise = 15;
  if (averageVolume < threshold && averageVolume > backgroundNoise) {
    // console.log("Rilevato soffio.");
    handleBlowDetection();
  } else {
    // console.log("Rilevato parlato o altro.");
  }
  // console.log(averageVolume, "Volume medio");
}

// Azioni da eseguire quando viene rilevato il soffio
function handleBlowDetection() {
  // console.log("Hai soffiato!");
  const flames = document.querySelectorAll(".flame");
  // console.log(`sulla torta ci sono ${flames.length} candele`);
  flames.forEach((flame) => {
    initialOpacitiCandle -= 0.5;
    flame.style.opacity = `${initialOpacitiCandle}%`;
    console.log(initialOpacitiCandle, "INITIAL VAL");
    if (flame.style.opacity <= 0) {
      flame.remove();
    }
  });
  console.log(flames, "flames");
  //resto del codice
  if (flames.length === 0) {
    window.location.href = "confetti.html";
  }
}

function generateCandles() {
  const cake = document.querySelector(".cake");
  const INPUTCandles = document.getElementById("numOfCandles");
  let numberOfCandles = INPUTCandles.value;
  cleanCake(cake);

  for (let i = 0; i < numberOfCandles; i++) {
    let candleContainer = document.createElement("div");
    candleContainer.className = "candleContainer fadeIn";
    candleContainer.innerHTML = `
        <div class="candleShadow"></div>
        <div class="candle">
        <div class="flame"></div>
        </div>
        `;
    cake.appendChild(candleContainer);
    settingAnimationDelay(candleContainer, i);
    randomizePosition(candleContainer);
  }
  INPUTCandles.value = "";
  printMessage(numberOfCandles);
}

function cleanCake(cake) {
  const existingCandles = cake.querySelectorAll(".candleContainer");
  existingCandles.forEach((candle) => {
    candle.remove();
  });
}

function randomizePosition(container) {
  const icing = document.querySelector(".icing");
  let candleHeigth = document.querySelector(".candle").offsetHeight;
  container.style.left = `${
    Math.random() * (icing.offsetWidth - candleHeigth)
  }px`;
  container.style.top =
    icing.offsetHeight - candleHeigth < icing.offsetHeight - 20
      ? `${Math.random() * (icing.offsetHeight - (candleHeigth + 30))}px`
      : `${Math.random() * (icing.offsetHeight - (candleHeigth + 60))}px`;
}

function settingAnimationDelay(element, indx) {
  // Imposta il nome dell'animazione in base all'indice
  const animationName = `fadeIn${indx}`;
  // Aggiungi la regola dell'animazione al foglio di stile
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(
    `
      @keyframes ${animationName} {
        from {
          opacity: 0;
          transform: translateY(-100px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
       `,
    styleSheet.cssRules.length
  );
  element.style.animation = `${animationName} 0.2s ease-in-out ${
    indx * 0.1
  }s forwards`;
}
function printMessage(value) {
  const blow = document.getElementById("blow");
  if (value !== 0 || value !== " ") {
    blow.style.display = "block";
  } else {
    blow.style.display = "none";
  }
}

// rec and print name or message
function startRecName() {
  if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
    recResult.innerText =
      "Spiacenti, il tuo browser non supporta l'API di riconoscimento vocale.";
    console.log(
      "Spiacenti, il tuo browser non supporta l'API di riconoscimento vocale."
    );
    return;
  }
  const recResult = document.getElementById("currentWord");

  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.lang = "it-IT";

  let currentWord = "";

  recognition.onresult = function (event) {
    currentWord = event.results[event.results.length - 1][0].transcript;
    recResult.textContent = currentWord;
  };

  recognition.onerror = function (event) {
    recResult.innerText = "Error :(";
    console.error("Error:", event.error);
  };

  let isRecognitionActive = false; //traccio lo stato del riconoscimento
  const btnREC = document.getElementById("sayYourName");

  btnREC.addEventListener("click", function () {
    if (!isRecognitionActive) {
      currentWord = "";
      recResult.textContent = currentWord;
      recognition.start();
      isRecognitionActive = true;
      btnREC.classList.add("pulse");
    } else {
      btnREC.classList.remove("pulse");
      recognition.stop();
      isRecognitionActive = false;
    }
  });

  recognition.onend = function () {
    isRecognitionActive = false;
  };
}

// DIDATTICA DEL CODICE
// #1. analyzer.fftSize
/*
La proprietà fftSize (Fast Fourier Transform Size) è una delle impostazioni dell'oggetto AnalyserNode nell'API Web Audio. 
Questa impostazione definisce la dimensione della finestra utilizzata per eseguire la trasformata di Fourier rapida (FFT) sul segnale audio. 
La FFT è un algoritmo che converte un segnale dal dominio del tempo a quello della frequenza, 
permettendo di analizzare le componenti frequenziali del segnale audio.

Quando si imposta fftSize, si sta essenzialmente specificando il numero di campioni audio che verranno utilizzati per calcolare la trasformata di Fourier. 
>>> Un valore maggiore di fftSize offre una maggiore risoluzione nelle frequenze, ma richiede più risorse computazionali.

Impostando fftSize su 256, verranno utilizzati 256 campioni audio per calcolare la trasformata di Fourier. 
Questo è un valore comune e sufficiente per molte applicazioni audio. 
Tuttavia, se si ha bisogno di una maggiore precisione nella visualizzazione delle frequenze, potresti aumentare il valore di fftSize.

In generale, sperimentando con diversi valori di fftSize per vedere come influiscono sulla tua applicazione e scegli il valore che meglio si adatta alle tue esigenze specifiche.
La proprietà fftSize può assumere solo valori potenze di 2, e il range tipico va da 32 a 32768. 
Quindi, puoi impostare fftSize su valori come 32, 64, 128, 256, 512, 1024, ecc. 
La scelta del valore dipende dalle tue esigenze specifiche e dalle prestazioni del sistema.
Il valore di fftSize influisce sulla dimensione dell'array restituito da getByteFrequencyData o getFloatFrequencyData dell'oggetto AnalyserNode. 
Se hai bisogno di dettagli più fini, potresti considerare valori più alti, ma devi bilanciare questo con le esigenze di prestazioni del tuo progetto.
*/

// #2. Ottenere il volume medio del suono registrato
/*
analyser.getByteFrequencyData(dataArray) ottiene i dati della frequenza audio in forma di array di byte. 
Successivamente, il codice utilizza .reduce() per sommare tutti i valori all'interno di questo array.
La funzione .reduce() calcola la media dei valori nell'array dataArray, 
che rappresenta il volume audio in un certo intervallo di frequenza. 
Il risultato, averageVolume, rappresenta il volume medio del suono rilevato dal microfono. 
La soglia (threshold) viene poi confrontata con questo valore per determinare se è stato rilevato un soffio.

Modificando il valore del threshold influiamo sul riconoscimento dei soffi rispetto alla normale voce.
*/
/*getBoundingClientRect() è un metodo fornito dall'API DOM che restituisce le dimensioni di un elemento e la sua posizione relativa alla finestra di visualizzazione (viewport). Il risultato è un oggetto che contiene le seguenti proprietà:

top: La distanza dall'elemento al lato superiore della finestra di visualizzazione.
right: La distanza dall'elemento al lato destro della finestra di visualizzazione.
bottom: La distanza dall'elemento al lato inferiore della finestra di visualizzazione.
left: La distanza dall'elemento al lato sinistro della finestra di visualizzazione.
width: La larghezza dell'elemento.
height: L'altezza dell'elemento.*/
