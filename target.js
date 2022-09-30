var dict = {
  0: "apple_pie",
  1: "baby_back_ribs",
  2: "baklava",
  3: "beef_carpaccio",
  4: "beef_tartare",
  5: "beet_salad",
  6: "beignets",
  7: "bibimbap",
  8: "bread_pudding",
  9: "breakfast_burrito",
  10: "bruschetta",
  11: "caesar_salad",
  12: "cannoli",
  13: "caprese_salad",
  14: "carrot_cake",
  15: "ceviche",
  16: "cheese_plate",
  17: "cheesecake",
  18: "chicken_curry",
  19: "chicken_quesadilla",
  20: "chicken_wings",
  21: "chocolate_cake",
  22: "chocolate_mousse",
  23: "churros",
  24: "clam_chowder",
  25: "club_sandwich",
  26: "crab_cakes",
  27: "creme_brulee",
  28: "croque_madame",
  29: "cup_cakes",
  30: "deviled_eggs",
  31: "donuts",
  32: "dumplings",
  33: "edamame",
  34: "eggs_benedict",
  35: "escargots",
  36: "falafel",
  37: "filet_mignon",
  38: "fish_and_chips",
  39: "foie_gras",
  40: "french_fries",
  41: "french_onion_soup",
  42: "french_toast",
  43: "fried_calamari",
  44: "fried_rice",
  45: "frozen_yogurt",
  46: "garlic_bread",
  47: "gnocchi",
  48: "greek_salad",
  49: "grilled_cheese_sandwich",
  50: "grilled_salmon",
  51: "guacamole",
  52: "gyoza",
  53: "hamburger",
  54: "hot_and_sour_soup",
  55: "hot_dog",
  56: "huevos_rancheros",
  57: "hummus",
  58: "ice_cream",
  59: "lasagna",
  60: "lobster_bisque",
  61: "lobster_roll_sandwich",
  62: "macaroni_and_cheese",
  63: "macarons",
  64: "miso_soup",
  65: "mussels",
  66: "nachos",
  67: "omelette",
  68: "onion_rings",
  69: "oysters",
  70: "pad_thai",
  71: "paella",
  72: "pancakes",
  73: "panna_cotta",
  74: "peking_duck",
  75: "pho",
  76: "pizza",
  77: "pork_chop",
  78: "poutine",
  79: "prime_rib",
  80: "pulled_pork_sandwich",
  81: "ramen",
  82: "ravioli",
  83: "red_velvet_cake",
  84: "risotto",
  85: "samosa",
  86: "sashimi",
  87: "scallops",
  88: "seaweed_salad",
  89: "shrimp_and_grits",
  90: "spaghetti_bolognese",
  91: "spaghetti_carbonara",
  92: "spring_rolls",
  93: "steak",
  94: "strawberry_shortcake",
  95: "sushi",
  96: "tacos",
  97: "takoyaki",
  98: "tiramisu",
  99: "tuna_tartare",
  100: "waffles",
};

function labelhover() {
  let styles = document.querySelector("label").style;
  styles.backgroundColor = "rgb(209, 209, 209)";
  styles.color = "#000000";
  styles.border = "1px solid #000000";
}
function label() {
  let styles = document.querySelector("label").style;
  styles.backgroundColor = "#000000";
  styles.color = "#ffffff";
  styles.border = "1px solid rgb(209, 209, 209)";
}
let model;
let modelLoaded = false;
async function loadmodel() {
  model = await tf.loadLayersModel("bestmodel/model.json");
  modelfull = await tf.loadLayersModel("Junky/model.json");
  console.log("loaded");
  modelLoaded = true;
}
loadmodel();
let image = document.getElementById("image");
let imageLoaded = false;
function imageHandler(e) {
  // console.log("called");
  const reader = new FileReader();
  reader.onload = () => {
    if (reader.readyState === 2) {
      image.src = reader.result;
      imageLoaded = true;
    }
  };
  reader.readAsDataURL(e.target.files[0]);
}
async function predict() {
  let food = document.getElementById("food");
  let name = food.nextElementSibling;
  let Protein = name.nextElementSibling;
  let Calcium = Protein.nextElementSibling;
  let Fat = Calcium.nextElementSibling;
  let Carbohydrate = Fat.nextElementSibling;
  let Vitamin = Carbohydrate.nextElementSibling;
  food.innerHTML         = `Food          : loading`;
  name.innerHTML         = `Name          : loading`;
  Protein.innerHTML      = `Protein       : loading`;
  Calcium.innerHTML      = `Calcium       : loading`;
  Fat.innerHTML          = `Fat           : loading`;
  Carbohydrate.innerHTML = `Carbohydrate  : loading`;
  Vitamin.innerHTML      = `Vitamin       : loading`;
  if (!modelLoaded) {
    alert("The model must be loaded first");
    return;
  }
  if (!imageLoaded) {
    alert("Please select an image first");
    return;
  }
  let tensor = tf.browser
    .fromPixels(image, 3)
    .resizeNearestNeighbor([256, 256])
    .expandDims()
    .toFloat()
    .reverse(-1);
  let ten = tf.browser
    .fromPixels(image, 3)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .sub(tf.scalar(127.5))
    .div(tf.scalar(127.5))
    .expandDims();
  let prediction = await model.predict(tensor).data();
  // console.log(prediction);
  if (prediction[0] === 1) {
    let food = document.getElementById("food");
    let name = food.nextElementSibling;
    let Protein = name.nextElementSibling;
    let Calcium = Protein.nextElementSibling;
    let Fat = Calcium.nextElementSibling;
    let Carbohydrate = Fat.nextElementSibling;
    let Vitamin = Carbohydrate.nextElementSibling;
    let pr = document.getElementById("alignn").style;
    let pred = await modelfull.predict(ten).data();
    let j;
    for (i = 0; i < 100; i++)
      if (pred[i] >= 0.5) {
        j = i;
      }
    pr.fontSize = "medium";
    // console.log(dict[i] + ":" + pred[i] + "\n");
    fetch("./Nutrition.json")
      .then((response) => response.json())
      .then((json) => {
        // let c = json.map(getFullName);
        // function getFullName(item) {
        //   if(item.header === j)
        //     return [item.name,item.protein,item.calcium,item.fat,item.carbohydrates,item.vitamins];
        // }
        // console.log(json[j]);
        food.innerHTML = "Food           : YES";
        name.innerHTML = `Name           : ${dict[j]}`;
        Protein.innerHTML = `Protein        : ${json[j].protein}`;
        Calcium.innerHTML = `Calcium        : ${json[j].calcium}`;
        Fat.innerHTML = `Fat            : ${json[j].fat}`;
        Carbohydrate.innerHTML = `Carbohydrate   : ${json[j].carbohydrates}`;
        Vitamin.innerHTML = `Vitamin        : ${json[j].vitamins}`;
      });
  } else {
    let food = document.getElementById("food");
    food.innerHTML = "Food           : NO ";
  }
  imageLoaded = false;
}
