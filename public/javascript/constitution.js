let currentYear = 0;

let setCurrentYear = (year) => {
  currentYear = year;
  $("#sideNavTitle").text(`año: ${year}`);
};

let setNav = (data) => {
  $("#mainNavLinks").empty();
  for (i in data) {
    //console.log(data[i]);
    $("#mainNavLinks").append(
      $(
        `<a href="javascript:requestConstitutionYear(${data[i].year})">
        ${data[i].description}
      </a>`
      )
    );
  }
};

let setConstitutionYear = (data) => {
  $("#sideNav").empty();
  for (let index in data) {
    let currentData = data[index];
    $("#sideNav").append(
      $(`
        <div class="const-title-card">
            <div class="const-title-card-body">
                <a 
                    class="const-title-card-title" 
                    href="javascript:requestTitle('${currentData.codigoTitulo}')"
                >${currentData.nombreTitulo}</a>
                <div class="const-title-card-text">${currentData.textoTitulo}</div>
            </div>
        </div>
    `)
    );
  }
};

let setTitle = (data) => {
  $("#mainContent").empty();
  console.log(data);
  $("#mainContent").append(`
        <div class="const-title-panel">
            <h5 class="const-title-panel-heading">
                <a href="#">${data[0].nombreTitulo}</a>
            </h5>
            <h6 class="const-title-panel-body">
                ${data[0].textoTitulo}
            </h6>
        </div>
    `);
};

let requestNav = () => {
  requestFromApi("constitution", setNav);
};

let requestConstitutionYear = (year) => {
  setCurrentYear(year);
  requestFromApi(`constitution/${year}/titles`, setConstitutionYear);
};

let requestTitle = (titleCode) => {
  requestFromApi(`constitution/${currentYear}/titles/${titleCode}`, setTitle);
};

$(document).ready(() => {
  requestNav();
});
