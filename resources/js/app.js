/*document.addEventListener('DOMContentLoaded', function () {
  // Récupération des éléments
  const form = document.getElementById('register')
  const password = document.getElementById('password')
  const confirmPassword = document.getElementById('confirmPassword')
  const submitButton = document.getElementById('submit')
  const inputs = form.querySelectorAll('input')

  // Fonction de vérification des conditions
  function checkPasswords() {
    let allFilled = true
    const passwordValue = password.value
    const confirmPasswordValue = confirmPassword.value

    // Vérifie si les deux champs sont identiques et ont au moins 8 caractères
    inputs.forEach((input) => {
      if (!input.value) {
        allFilled = false
      }
    })
    if (passwordValue === confirmPasswordValue && passwordValue.length >= 8 && allFilled === true) {
      submitButton.classList.add('visible') // Afficher le bouton
      submitButton.style.display = 'inline'
    } else {
      submitButton.classList.remove('visible') // Cacher le bouton
    }
  }

  // Écouteurs d'événements sur les champs de mot de passe
  password.addEventListener('input', checkPasswords)
  confirmPassword.addEventListener('input', checkPasswords)

  // Vérification initiale pour afficher ou masquer le bouton
  checkPasswords()
})*/
