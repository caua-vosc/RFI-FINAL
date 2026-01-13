const sectionsDiv = document.getElementById("sections");

let state = {};
let sections = Array(30).fill("Seção");

function renderSections() {
  sections.forEach((section, i) => {
    const div = document.createElement("div");
    div.className = "section";

    div.innerHTML = `
      <h3>Seção ${i + 1}: ${section}</h3>
      <textarea name="text_${i}" placeholder="Observação..." required></textarea>
      <input type="file" name="photos_${i}" multiple />
      <div class="preview" id="preview_${i}"></div>
    `;

    sectionsDiv.appendChild(div);
  });
}

function previewImage(event, idx) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      document.getElementById(`preview_${idx}`).innerHTML = "";
      document.getElementById(`preview_${idx}`).appendChild(img);
      state[idx] = file;
    };
    reader.readAsDataURL(file);
  }
}

document.getElementById("uploadForm").onsubmit = async (e) => {
  e.preventDefault();
  const siteId = document.getElementById("siteId").value;
  const status = document.getElementById("status");

  if (!siteId) {
    alert("O ID do site é obrigatório!");
    return;
  }

  status.innerText = "Enviando fotos...";

  const formData = new FormData();
  formData.append("siteId", siteId);

  for (let i = 0; i < sections.length; i++) {
    if (state[i]) {
      formData.append("photos", state[i]);
      formData.append(`section_${i}`, sections[i]);
    }
  }

  try {
    const res = await fetch('https://meu-backend.vercel.app/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      status.innerText = "Relatório enviado com sucesso!";
    } else {
      status.innerText = "Erro no envio!";
    }
  } catch (error) {
    console.error(error);
    status.innerText = "Erro ao enviar o relatório.";
  }
};

renderSections();
