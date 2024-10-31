document.addEventListener('DOMContentLoaded', () => {
  const confettiContainer = document.getElementById('confetti-container')

  function createConfetti() {
    const confetti = document.createElement('div')
    confetti.classList.add('confetti')
    // console.log('confetti', confetti)
    // Colori casuali per i coriandoli
    const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#577590', '#43aa8b', '#4d908e']
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.minWidth = [Math.floor(Math.random() * colors.length)]
    confetti.style.minHeight = [Math.floor(Math.random() * colors.length)]
    // Genera una direzione casuale
    confetti.style.setProperty('--x', Math.random().toFixed(2))
    confetti.style.setProperty('--y', Math.random().toFixed(2))

    // Posiziona il coriandolo al centro e poi lo aggiunge al container
    confetti.style.left = '50%'
    confetti.style.top = '50%'
    confettiContainer.appendChild(confetti)

    // Rimuove il coriandolo dopo che l'animazione termina
    confetti.addEventListener('animationend', () => {
      confetti.remove()
    })
  }

  // Genera 100 coriandoli
  for (let i = 0; i < 1000; i++) {
    setTimeout(createConfetti, i * 30) // Delay per creare l'effetto di esplosione progressiva
  }
})
