document.addEventListener('DOMContentLoaded', () => {
  const fonts = [
    'Arial',
    'Courier New',
    'Georgia',
    'Times New Roman',
    'Verdana',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
  ]

  function changeFont() {
    const message = document.querySelector('#birthday-message')

    setInterval(() => {
      const randomFont = fonts[Math.floor(Math.random() * fonts.length)]
      console.log('message', message)
      message.style.fontFamily = randomFont
    }, 300) // Cambia font ogni 0.3 secondi
  }

  // Chiamata della funzione per iniziare il cambiamento del font
  changeFont()
})
