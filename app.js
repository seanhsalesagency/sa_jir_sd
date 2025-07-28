// app.js
const LAMBDA_URL =
  "https://s4imtdlzhdq7cnnmor7bx4vcmm0banfo.lambda-url.us-east-1.on.aws/";

async function loadForms() {
  const status = document.getElementById("statusIndicators");
  const main   = document.getElementById("mainContent");

  try {
    status.innerHTML = `📡 Fetching forms…`;
    const resp = await fetch(LAMBDA_URL, { method: "GET", headers:{Accept:"application/json"}});
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const forms = await resp.json();
    if (!Array.isArray(forms) || forms.length===0) {
      throw new Error("No forms returned");
    }

    status.innerHTML = `✅ ${forms.length} Forms Loaded`;

    let html = '<div class="forms-container">';
    forms.forEach(f=>{
      html += `
        <div class="form-card">
          <div class="form-header">
            <h3 class="form-title">${f.title}</h3>
            <p class="form-description">${f.description}</p>
          </div>
          <div class="form-footer">
            <button class="form-button"
              onclick="openForm('${f.formType}')">
              Create ${f.title}
            </button>
          </div>
        </div>`;
    });
    html += '</div>';
    main.innerHTML = html;

  } catch(e) {
    console.error(e);
    status.innerHTML = `❌ Error: ${e.message}`;
    main.innerHTML = `
      <div class="error-container">
        <div class="error-title">Unable to load forms</div>
        <p>${e.message}</p>
      </div>`;
  }
}

function openForm(requestTypeId) {
  window.location.href = `/forms/new-employee-setup.html?type=${requestTypeId}`;
}

document.addEventListener("DOMContentLoaded", loadForms);

