let apiRoot = "http://localhost:2020/api";
const constitutionsKey = "constitutions";
const yearsKey = "year";
const titlesKey = "titles";

let requestFromApi = (url, onSuccess, onError) => {
  $.ajax({
    url: `${apiRoot}/${url}`,
    success: onSuccess,
    error:
      onError ||
      ((e) => {
        console.log(e);
      }),
  });
};

let tag = (name, content, attributes) => {
  attributes = attributes || {};
  attributes = Object.keys(attributes).map((k) => ` ${k}="${attributes[k]}"`);
  attributes = attributes.reduce((a, b) => `${a} ${b}`, "");
  return `<${name}${attributes}>${content}</${name}>`;
};

let getTitles = (year, callback) => {
  callback = callback || ((d) => console.log(d));
  if (localStorage.getItem(constitutionsKey) == undefined)
    localStorage.setItem(constitutionsKey, {});
  let data = localStorage.getItem(constitutionsKey);
  //console.log(data);
  if (data[year]) {
    callback(data[year]);
  } else {
    requestFromApi(`constitution/${year}/titles`, (result) => {
      data[year] = result;
      localStorage.setItem(constitutionsKey, result);
      callback(result);
    });
  }
};
