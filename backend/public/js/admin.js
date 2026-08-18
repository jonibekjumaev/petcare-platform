document.querySelectorAll(".status-form").forEach(function (form) {
  form.addEventListener("submit", function (e) {
    const select = form.querySelector("select");
    if (select.value === "DELETE") {
      const confirmed = confirm("Are you sure? This action cannot be undone.");
      if (!confirmed) e.preventDefault();
    }
  });
});