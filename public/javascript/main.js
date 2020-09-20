let apiRoot = "api";

let tag = (name, content, attributes) => {
  attributes = attributes || {};
  attributes = Object.keys(attributes).map((k) => ` ${k}=${attributes[k]}`);
  attributes = attributes.reduce((a, b) => `${a} ${b}`, "");
  return `<${name}${attributes}>${content}</${name}>`;
};

let setTitles = (titles) => {
  titles.forEach((t) => {
    console.log(t);
    let control = tag("div", tag("strong", t.nombreTitulo) + t.textoTitulo, {
      class: "alert-info",
    });
    $("#subNav").append(control);
  });
};

let showTitles = () => {
  $("#subNav").empty();
  $.ajax(`${apiRoot}/titles`, {
    success: (data) => {
      setTitles(data);
    },
    error: () => {
      alert("fail");
    },
  });
};
