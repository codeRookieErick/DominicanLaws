///

let cachedArticles = [];

let setTitle = (data) => {
  $("#mainContent").empty();
  //console.log(data);
  $("#mainContent").append(
    $(`
    <div class="const-title-panel">
    <div class="const-title-header">
        ${data[0].nombreTitulo}
    </div>
    <div class="const-title-subheader">
        ${data[0].textoTitulo}
    </div>
    </div>
  `)
  );

  requestFromApi(
    `constitution/${currentYear}/titles/${titleCode}/chapters`,
    (chapters) => {
      if (chapters.length == 0) {
        requestFromApi(
          `constitution/${currentYear}/titles/${titleCode}/articles`,
          (articles) => {
            cachedArticles = articles;
            articles.forEach((a) => {
              $("#mainContent").append(
                $(`
                <div class="const-article-panel">
                    <div class="const-article-header">
                        ${a.nomberArticulo}
                    </div>
                    <div class="const-article-body">
                        ${a.textoArticulo}
                    </div>
                    ${JSON.stringify(a)}
                </div>
                `)
              );
            });
          }
        );
      } else {
        chapters.forEach((c) => {
          $("#mainContent").append(
            $(`
                <div>
                    ${JSON.stringify(c)}
                </div>
            `)
          );
        });
      }
    }
  );
};

$(document).ready(() => {
  //alert("");
  requestFromApi(`constitution/${currentYear}/titles/${titleCode}`, setTitle);
});
