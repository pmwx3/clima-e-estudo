// Função principal que será executada quando a página carregar
async function carregarDadosClima() {
  // coordenadas para sengés - pr
  const latitude = -24.11;
  const longitute = -49.46;

  // 1 - Montar a URL da API com todos os dados que precisamos
  // Dados atuais, horários e diários em uma única chamada

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m,uv_index&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/Sao_Paulo`;

  try {
    // 2 - Fazer a requisição para a API
    const response = await fetch(apiUrl);
    const data = await response.json();

    // se a API retornar um erro, exibimos no console
    if (data.error) {
      throw new Error(data.reason);
    }

    atualizarDadosAtuais(data);
    atualizarPrevisaoHoraria(data);
    atualizarPrevisaoSemanal(data);
  } catch (error) {
    console.error("Erro ao buscar dados do clima:", error);
    alert(
      "Não foi possível carregar os dados do clima. Tente novamente mais tarde;"
    );
  }
}

// Função par atualizar o painel principal com os dados atuais
function atualizarDadosAtuais(data) {
  // vamos pegar os dados atuais do objeto 'data'
  const currentWeather = data.current;

  // Atualizar cada elemento no HTML com o ID correspondente
  document.getElementById("city-name").textContent = "Sengés, PR"; // Por hora é fixo
  document.getElementById("current-temp").textContent = `${Math.round(
    currentWeather.temperature_2m
  )}°`;
  document.getElementById("apparent-temp").textContent = `${Math.round(
    currentWeather.apparent_temperature
  )})°}`;
  document.getElementById(
    "rain-chance"
  ).textContent = `${currentWeather.precipitation_probability}%`;
  document.getElementById(
    "chance-of-rain-main"
  ).textContent = `Chance de Chuva ${currentWeather.precipitation_probability}%}`;
  document.getElementById(
    "wind-speed"
  ).textContent = `currentWeather.wind_speed_10m`;
  document.getElementById("uv-index").textContent = Math.round(
    currentWeather.uv_index
  );
}

//Função para gerar a previsão por hora
function atualizarPrevisaoHoraria(data) {
  const container = document.getElementById("hourly-forecast");
  container.innerHTML = ""; // limpa o container antes de adicionar novos itens

  const hourly = data.hourly;
  const agora = new Date();
  const horaAtual = agora.getHours();

  const startIndex = hourly.time.findIndex(
    (time) => new Date(time).getHours() === horaAtual
  );

  for (let i = startIndex; i < startIndex + 6; i++) {
    const hora = new Date(hourly.time[i]);
    const temperatura = Math.round(hourly.temperature_2m[i]);

    // cria o HTML para cada item da previsão
    const itemHtml = `
            <div class="hour-weather-item">
            <p>${hora.getHours()}:00</p>
            <img src="_cdn/img/sun-clouds.svg" alt="" title="" >
            <p>${temperatura}°</p>
        `;
    // adiciona o item criado ao container
    container.innerHTML += itemHtml;
  }
}
