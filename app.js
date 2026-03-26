async function pesquisar() {
  // Seleciona a seção onde os resultados serão exibidos
  let section = document.getElementById("resultados-pesquisa");

  let campoPesquisa = document.getElementById("campo-pesquisa").value;

  // Se campoPesquisa for uma string sem nada
  if (!campoPesquisa.trim()) {
    section.innerHTML = "<p>Nada foi encontrado. Você não buscou por um jogo!</p>"
    return
  }

  const termo = campoPesquisa.toLowerCase();

  const API_KEY = "7009f826af2e4604acb5c5c40002b920";
  const resposta = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${termo}`);
  const dadosAPI = await resposta.json();

  // Incializa resultados
  let resultados = "";

  for (let jogo of dadosAPI.results) {
    resultados += `
        <div class="item-resultado">
          <h2>
            <a href="https://rawg.io/games/${jogo.slug}" target="blank">
            ${jogo.name}
            </a>
          </h2>
          <img src="${jogo.background_image}" width="200">
          <p>⭐ Nota: ${jogo.rating}</p>
          <p>📅 Lançamento: ${jogo.released}</p>
        </div>
      `;
  }

  if (!resultados) {
    resultados = "<p>Nada foi encontrado</p>"
  }

  // Atribui os resultados gerados à seção HTML
  section.innerHTML = resultados;
}

let timeout;

async function sugerir() {
  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    const campo = document.getElementById("campo-pesquisa");
    const sugestoesBox = document.getElementById("sugestoes");

    const termo = campo.value;

    if (!termo.trim()) {
      sugestoesBox.innerHTML = "";
      return;
    }

    const API_KEY = "7009f826af2e4604acb5c5c40002b920";

    const resposta = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=${termo}&page_size=5`
    );

    const dados = await resposta.json();

    let html = "";

    for (let jogo of dados.results) {
      html += `
        <div class="sugestao-item" onclick="selecionarSugestao(\`${jogo.name}\`)">
          ${jogo.name}
        </div>
      `;
    }

    sugestoesBox.innerHTML = html;
  }, 300);
}

function selecionarSugestao(nome) {
  document.getElementById("campo-pesquisa").value = nome;
  document.getElementById("sugestoes").innerHTML = "";
  pesquisar();
}

document.getElementById("campo-pesquisa")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Evita o comportamento estranho.
      pesquisar();
    }
  });

document.getElementById("campo-pesquisa")
  .addEventListener("input", sugerir);