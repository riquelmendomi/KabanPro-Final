document.addEventListener("DOMContentLoaded", () => {
  if (typeof bootstrap === "undefined") {
    console.error("Bootstrap no está cargado aún.");
    return;
  }

  const modalEl = document.getElementById("socialConfirmModal");
  if (!modalEl) return;

  const providerNameEl = document.getElementById("socialProviderName");
  const acceptBtn = document.getElementById("socialAcceptBtn");

  const modal = new bootstrap.Modal(modalEl);
  modalEl.addEventListener("shown.bs.modal", () => {
    document.activeElement && document.activeElement.blur();
  });

  document.querySelectorAll(".auth-social-tile[data-provider]").forEach((btn) => {
    btn.addEventListener("click", () => {
      providerNameEl.textContent = btn.getAttribute("data-provider");
  
      // QUITA el foco del botón para que no quede "seleccionado"
      btn.blur();
      document.activeElement && document.activeElement.blur();
  
      modal.show();
    });
  });

  acceptBtn.addEventListener("click", () => {
    const provider = providerNameEl.textContent.trim().toLowerCase();
  
    // rutas sugeridas
    window.location.href = `/auth/${provider}`;
  });
});