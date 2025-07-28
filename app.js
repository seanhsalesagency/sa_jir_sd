// point at your form‑metadata Lambda:
const LAMBDA_URL = 'https://s4imtdlzhdq7cnnmor7bx4vcmm0banfo.lambda-url.us-east-1.on.aws/';

async function loadForms() {
  const status = document.getElementById("statusIndicators");
  const main   = document.getElementById("mainContent");

  if (!status || !main) {
    console.error("Missing #statusIndicators or #mainContent!");
    return;
  }

  try {
    status.innerHTML = `📡 Fetching forms…`;
    const resp = await fetch(LAMBDA_URL, { method: 'GET', headers: { 'Accept':'application/json' } });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const { forms, totalForms } = await resp.json();

    if (!Array.isArray(forms) || forms.length === 0) {
      throw new Error("No forms returned");
    }

    status.innerHTML = `✅ ${totalForms} Forms Loaded`;

    // render cards
    let html = '<div class="forms-container">';
    forms.forEach(f => {
      html += `
        <div class="form-card">
          <div class="form-header">
            <h3 class="form-title">${f.title}</h3>
            <p class="form-description">${f.description}</p>
            <div class="form-meta">
              <span class="field-count">${f.fields.length} fields</span>
            </div>
          </div>
          <div class="form-footer">
            <button class="form-button" onclick="openForm('${f.id}')">
              Create ${f.title}
            </button>
          </div>
        </div>`;
    });
    html += '</div>';
    main.innerHTML = html;

  } catch (err) {
    console.error(err);
    status.innerHTML = `❌ Error Loading Forms`;
    main.innerHTML = `
      <div class="error-container">
        <div class="error-title">Unable to Load Forms</div>
        <p>${err.message}</p>
      </div>`;
  }
}

function openForm(formId) {
  // assumes each form’s static HTML lives at /forms/{formId}.html
  window.location.href = `/forms/${formId}.html`;
}

document.addEventListener("DOMContentLoaded", loadForms);
