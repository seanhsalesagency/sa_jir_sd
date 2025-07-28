// point this at your new Lambda URL
const LAMBDA_URL = "https://s4imtdlzhdq7cnnmor7bx4vcmm0banfo.lambda-url.us-east-1.on.aws/";

async function loadForms() {
  const status = document.getElementById("statusIndicators");
  const main   = document.getElementById("mainContent");

  try {
    status.innerHTML = `<span class="status-indicator status-loading">📡 Fetching forms…</span>`;

    const resp = await fetch(LAMBDA_URL, { method: "GET", headers: { Accept: "application/json" } });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const forms = await resp.json();
    if (!Array.isArray(forms) || forms.length === 0) {
      throw new Error("No forms returned");
    }

    status.innerHTML = `<span class="status-indicator status-success">✅ ${forms.length} Forms Loaded</span>`;

    // render them
    let html = '<div class="forms-container">';
    forms.forEach((f) => {
      html += `
        <div class="form-card">
          <div class="form-header">
            <h3 class="form-title">${f.title}</h3>
            <p class="form-description">${f.description || ""}</p>
          </div>
          <div class="form-footer">
            <button class="form-button" onclick="openForm('${f.id}')">
              Create ${f.title}
            </button>
          </div>
        </div>`;
    });
    html += "</div>";
    main.innerHTML = html;

  } catch (err) {
    console.error(err);
    status.innerHTML = `<span class="status-indicator status-error">❌ Error Loading Forms</span>`;
    main.innerHTML = `
      <div class="error-container">
        <div class="error-title">Unable to Load Forms</div>
        <p>${err.message}</p>
      </div>`;
  }
}

// when user clicks “Create …”:
function openForm(requestTypeId) {
  // assumes you have static HTML forms under /forms/<requestTypeId>.html
  window.location.href = `/forms/${requestTypeId}.html`;
}

document.addEventListener("DOMContentLoaded", loadForms);
