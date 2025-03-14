(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

function updateRating(value) {
  document.getElementById("ratingValue").textContent = value;
}

let toggle_button = document.querySelector(".form-check-input");
toggle_button.addEventListener("click",()=>{
    let tax_info = document.getElementsByClassName("tax-info");
    for(info of tax_info){
        if(info.style.display==""){
            info.style.display = "inline";
        } else {
            info.style.display ="";
        }
    }
})