const inputElements = document.querySelectorAll(".js-field-input");

// Toggle label focus
inputElements.forEach(inputEl => {
  const labelEl = inputEl.previousElementSibling;

  inputEl.addEventListener("focus", () => {
    labelEl.classList.add("active");
  });
  inputEl.addEventListener("blur", () => {
    labelEl.classList.remove("active");
  });
});
