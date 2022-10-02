function utter(message) {
  let voi = speechSynthesis.getVoices();
  let gotVoices = false;
  if (voi.length) {
    resolve(voi, message);
  } else {
    speechSynthesis.onvoiceschanged = () => {
      if (!gotVoices) {
        voi = speechSynthesis.getVoices();
        gotVoices = true;
        if (voi.length) resolve(voi, message);
      }
    };
  }
}

function resolve(voices, message) {
  var synth = window.speechSynthesis;
  let utter = new SpeechSynthesisUtterance();
  utter.lang = "en-US";
  utter.voice = voices[4];
  utter.text = message;
  utter.rate = 1;
  utter.pitch = 1.5;
  utter.volume = 0.5;
  synth.speak(utter);
}

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
  modelfull = await tf.loadLayersModel("junk/model.json");
  window.onload = ()=>{
    utter("Welcome to Food detector app.");
    utter(" ");
    utter(" The Model has been loaded");
  }
  console.log("loaded");
  document.getElementById('card').classList.remove('loading');
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
  utter("Image has been uploaded successfully, ready to predict.");
}
async function predict() {
  let food = document.getElementById("food");
  let name = food.nextElementSibling;
  let Protein = name.nextElementSibling;
  let Calcium = Protein.nextElementSibling;
  let Fat = Calcium.nextElementSibling;
  let Carbohydrate = Fat.nextElementSibling;
  let Vitamin = Carbohydrate.nextElementSibling;
  food.innerHTML = `Food          : loading`;
  name.innerHTML = `Name          : loading`;
  Calcium.innerHTML = `Calcium       : loading`;
  Fat.innerHTML = `Fat           : loading`;
  Carbohydrate.innerHTML = `Carbohydrate  : loading`;
  Vitamin.innerHTML = `Vitamin       : loading`;
  Protein.innerHTML = `Protein       : loading`;
  if (!modelLoaded) {
    utter("The model must be loaded first");
    setTimeout(()=>{
      alert("The model must be loaded first");
    },100)
    return;
  }
  if (!imageLoaded) {
    utter("Please select an image first");
    setTimeout(()=>{
      alert("Please select an image first");
    },100)
    return;
  }
  utter("Predicting the image, please wait");
  let tensor = tf.browser
    .fromPixels(image, 3)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .sub(tf.scalar(127.5))
    .div(tf.scalar(127.5))
    .expandDims();
  let prediction = await model.predict(tensor).data();
  // console.log(prediction);
  if (prediction[0] > prediction[1]) {
    let pr = document.getElementById("alignn").style;
    let pred = await modelfull.predict(tensor).data();
    let i = 0;
    let large = pred[i];
    let j = 0;
    for (i = 0; i <= 100; i++) {
      if (pred[i] > large) {
        j = i;
        large = pred[i];
        // console.log(i + ":" + pred[i] + "\n");
      }
    }
    pr.fontSize = "medium";
    fetch("./Nutrition.json")
      .then((response) => response.json())
      .then((json) => {
        food.innerHTML = "Food           : YES";
        name.innerHTML = `Name           : ${[json[j].name]}`;
        Protein.innerHTML = `Protein        : ${json[j].protein}`;
        Calcium.innerHTML = `Calcium        : ${json[j].calcium}`;
        Fat.innerHTML = `Fat            : ${json[j].fat}`;
        Carbohydrate.innerHTML = `Carbohydrate   : ${json[j].carbohydrates}`;
        Vitamin.innerHTML = `Vitamin        : ${json[j].vitamins}`;
        utter(`The uploaded image is of a food called ${[json[j].name]}, having protein of ${json[j].protein} percent, Calcium of ${json[j].calcium} percent, Fat of ${json[j].fat} percent, Carbohydrate of ${json[j].carbohydrates} percent, Vitamin of ${json[j].vitamins} percent. Thank you very much, have a good day!`)
      });
  } else {
    let food = document.getElementById("food");
    food.innerHTML = "Food          : NO ";
    name.innerHTML = `Name          : NA`;
    Calcium.innerHTML = `Calcium       : NA`;
    Fat.innerHTML = `Fat           : NA`;
    Carbohydrate.innerHTML = `Carbohydrate  : NA`;
    Vitamin.innerHTML = `Vitamin       : NA`;
    Protein.innerHTML = `Protein       : NA`;
    utter("The uploaded image is of not a food. Please try another image!")
  }
  imageLoaded = false;
}


