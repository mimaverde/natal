<template>
  <div class="home">
    <Snow />
    <div class="card card__animate" v-bind:class="{ hidden: !showCard }">
      <canvas width="1000" height="1000" class="card__content" id="printMe"></canvas>
      <div class="card__controls">
        <a href="#" class="btn__generator btn__red" v-on:click="backToInfo">NOVO CARTÃO</a><a href="#" v-on:click="downloadImage" class="btn__generator">DOWNLOAD</a>
      </div>
    </div>
    <img src="../assets/images/sky-mask.svg" id="wave">
    <div class="home__figures">
      <img src="../assets/images/three.svg" id="three">
      <img src="../assets/images/gifts.svg" id="gifts">
    </div>
    <div class="home__container" id="content"  v-bind:class="{ hidden: showCard }">
      <div class="home__spacing">
        <div class="home__content content">
          <div class="home__title" id="title">
            <img src="../assets/images/banner.svg" id="banner" />
            <p class="home__subtitle">Escreva uma mensagem para alguém especial!</p>
          </div>
          <div>
            <form id="formInfos">
              <div class="home__form">
                <div class="home__toFrom">
                  <span class="msgDisplay">
                    <span class="error__msg">*Campo obrigatório</span>
                    <input id="msgFrom" placeholder="De:" maxlength="12" minlength="3" v-on:blur="handleBlur" required>
                  </span>
                  <span class="msgDisplay">
                    <span class="error__msg">*Campo obrigatório</span>
                    <input id="msgTo" placeholder="Para:" maxlength="12" minlength="3" v-on:blur="handleBlur" required>
                  </span>
                </div>
                <div>
                  <span class="msgDisplay">
                    <span class="error__msg">*Campo obrigatório</span>
                    <textarea id="msgText" placeholder="Mensagem" class="home__textarea" v-on:blur="handleBlur" v-on:keyup="counterCharacters" minlength="3" maxlength="140" required></textarea>
                    <span class="home__textMax"><span id="charactersLeft">{{ counter }}</span> caracteres</span>
                  </span>
                </div>
              </div>
              <div class="home__info">
                <span class="msgDisplay">
                  <span class="error__msg">*Selecione um modelo de cartão</span>
                  <p>Escolha o modelo do cartão:</p>
                  <ul class="home__list" id="cards">
                    <li>
                      <input type="checkbox" id="cb1" @change="check($event)" />
                      <label for="cb1">
                        <img src="../assets/images/card_01.png">
                      </label>
                      <!-- <span class="card__insideText">Boas Festas!</span> -->
                    </li>
                    <li>
                      <input type="checkbox" id="cb2" @change="check($event)" />
                      <label for="cb2">
                        <img src="../assets/images/card_02.png">
                      </label>
                      <!-- <span class="card__insideText">Feliz Natal!</span> -->
                    </li>
                    <li>
                      <input type="checkbox" id="cb3" @change="check($event)" />
                      <label for="cb3">
                        <img src="../assets/images/card_03.png">
                      </label>
                      <!-- <span class="card__insideText">Obrigado por tudo!</span> -->
                    </li>
                    <li>
                      <input type="checkbox" id="cb4" @change="check($event)" />
                      <label for="cb4">
                        <img src="../assets/images/card_04.png">
                      </label>
                      <!-- <span class="card__insideText">Curta as férias!</span> -->
                    </li>
                  </ul>
                </span>
                <div class="content__btn">
                  <a href="" class="btn__generator" v-on:click="validateInfo">CRIAR CARTÃO</a>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="home__footer footer">
          <div class="home__footerContent">
            <img src="../assets/images/logo.svg" >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import Snow from '../components/Snow';
import download from 'downloadjs';

export default {
  name: 'Home',
  components: {
    Snow,
  },
  data () {
    return {
      counter: 140,
      showCard: false,
      cardNameFrom: String,
      cardNameTo: String,
      cardMsg: HTMLElement,
      imgSrc: null,
    }
  },
  mounted: function(){
    const elementsAnimation = () => {
      gsap.to(".home__figures", 3, {autoAlpha: 1, delay: 1})
      gsap.to("#three", 1, {scaleX: 1, scaleY: 1})
      gsap.to("#gifts", 1, {scaleX: 1, scaleY: 1})
    }

    const contentAnimation = () => {
      gsap.to("#wave", 3, {y: 0, ease: 'power4.out', delay: 0.8});
      gsap.to("#content", 1, {y: 0, autoAlpha: 1, delay: 1.5})
      gsap.to("#title", 1, {y: 0, autoAlpha: 1, delay: 1.5, onComplete: elementsAnimation()})
    }

    contentAnimation();
  },
  methods: {
    handleBlur: function(e) {
      if(e.target.checkValidity()){
        e.target.parentNode.classList.remove('error');
      }
    },
    counterCharacters: function(e) {
      const maxCharacters = 140;
      const characters = e.target.value.length;
      this.counter =  maxCharacters - (characters);
    },
    validateInfo: function(e) {
      e.preventDefault();

      let cardSelected = false;
      const nameFrom = document.getElementById('msgFrom');
      const nameTo = document.getElementById('msgTo');
      const msg = document.getElementById('msgText');
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const cards = document.getElementById('cards');

      if(!nameFrom.checkValidity()){
        nameFrom.parentNode.classList.add('error');
      }

      if(!nameTo.checkValidity()){
        nameTo.parentNode.classList.add('error');
      }

      if(!msg.checkValidity()){
        msg.parentNode.classList.add('error');
      }

      if(!cardSelected){
        cards.parentNode.classList.add('error');
      }

      checkboxes.forEach(element => {
        if(element.checked == true){
          cardSelected = true;
          cards.parentNode.classList.remove('error');
        }
      });

      if(nameFrom.checkValidity() && nameTo.checkValidity() && msg.checkValidity() && cardSelected){
        this.createCard(nameFrom, nameTo, msg);
      }
    },
    loadImage: async function(url){
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = url;
      })
    },
    wrapText: function(context, text, x, y, maxWidth, lineHeight){
      const words = text.split(' ');
      let line = '';

      for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        }
        else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    },
    createCard: async function(cardNameFrom, cardNameTo, cardMsg) {
      this.cardNameFrom = cardNameFrom.value;
      this.cardNameTo = cardNameTo.value;
      this.cardMsg = cardMsg.value;
      // this.cardMsg = cardMsg.value.replace(/\r?\n/g, '<br/>');
      
      const canvas = document.getElementById('printMe');
      const bg = await this.loadImage(this.imgSrc);
      const ctx = canvas.getContext("2d");
      const [width, height] = [1000, 1000]
      const maxWidth = 550;
      const lineHeight = 50;
      const x = 300;
      const y = 250;
      const text = this.cardMsg;

      ctx.drawImage(bg, 0, 0, width, height);

      ctx.font = '42px segoeregular';
      ctx.textAlign = "start";
      ctx.fillText(this.cardNameTo, 300, 150);
      ctx.textAlign = "start";
      this.wrapText(ctx, text, x, y, maxWidth, lineHeight)
      ctx.textAlign = "end";
      ctx.fillText(this.cardNameFrom, 910, 670);

      this.showCardWithInfos();
    },
    showCardWithInfos: function() {
      this.showCard = true;
      
      gsap.to(".card__animate", 0.8, {top: '50%', autoAlpha: 1});
    },
    check: function(e) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const cards = document.getElementById('cards');
      const modelCard = e.target.id;

      checkboxes.forEach(element => {
        element.checked = false;
      });

      e.currentTarget.checked = true;
      cards.parentNode.classList.remove('error');

      this.imgSrc = require(`../assets/images/${modelCard}.png`);
    },
    backToInfo: function(e) {
      e.preventDefault();

      const hideCard = () => {
        setTimeout(() => {
          this.showCard = false;
        }, 200);   
      }

      gsap.to(".card__animate", 0.5, {top: '-50%', autoAlpha: 0, onComplete: hideCard()});

      // form.reset();
    },
    downloadImage: async function(e) {
      e.preventDefault();
      const elementToDownload = document.getElementById('printMe');
      
      elementToDownload.toBlob((blob) => {
        download(blob, 'Cartao-Natal-Bosch.png');
      });
    },
  },
}
</script>

<style lang="scss">
canvas {
  display: block;
  vertical-align: bottom;
}

.home {
  background: white;
  height: 100vh;
  position: relative;
}

.home__figures {
  position: absolute;
  top: 16vw;
  width: 100%;
  max-width: 1424px;
  left: 50%;
  opacity: 0;
  transform: translate(-50%, -20%);
}

.home__content {
  grid-area: content;
  // transform: translate(-50%, 0);
  top: 0;
  left: 50%;
  // position: absolute;
  width: 100%;
  max-width: 1024px;
  padding: 2vh 0;
  margin: auto;
}

.home__container {
  width: 100%;
  position: absolute;
  top: 0;
  height: 100%;
  z-index: 2;
}

.home__spacing {
  height: 100%;
  min-height: 46rem;
  position: relative;
  display: grid;
  grid-template-rows: 4fr .3fr;
  grid-template-areas:
   "content"
   "footer";
}

.home__subtitle {
  font-size: 22px;
  margin: 0 1vw 2vw;
}

.home__form {
  display: flex;
  max-width: 500px;
  margin: auto;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 1vh;
}

.home__toFrom {
  display: flex;
  flex-flow: column;

  input {
    font-family: $regular;
    padding: 0.4rem;
    width: 200px;
    border: 1px solid $gray;
    font-size: 0.8rem;
    margin-bottom: 10px;
  }
}

.home__textarea {
  font-family: $regular;
  padding: 0.4rem;
  border: 1px solid $gray;
  width: 250px;
  font-size: 0.8rem;
  height: 8vh;
}

.home__textMax {
  font-family: $regular;
  font-size: 0.7rem;
  display: block;
  margin-top: .5vh;
  text-align: left;
}

.home__list {
  display: flex;
  justify-content: space-between;
  margin: 1.5vh 0 2vh;
  list-style-type: none;

  li {
    display: inline-block;
  }

  input[type="checkbox"][id^="cb"] {
    display: none;
  }

  label {
    border: 1px solid #fff;
    display: block;
    position: relative;
    cursor: pointer;
  }

  label:before {
    background-color: white;
    color: white;
    content: " ";
    display: block;
    border-radius: 50%;
    border: 1px solid $blue;
    position: absolute;
    top: -10px;
    right: -10px;
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 28px;
    transition-duration: 0.4s;
    transform: scale(0);
    z-index: 1;
  }

  label img {
    width: 15vw;
    height: 15vw;
    max-height: 130px;
    max-width: 130px;
    transition-duration: 0.2s;
    transform-origin: 50% 50%;
  }

  :checked + label {
    border-color: $blue;
  }

  :checked + label:before {
    content: "✓";
    background-color: $blue;
    transform: scale(1);
  }

  :checked + label img {
    transform: scale(0.9);
    z-index: -1;
  }
}

.home__info {
  max-width: 39rem;
  margin: auto;
  text-align: left;
  padding: 0 1rem;
  box-sizing: content-box;
}

.home__footer { 
  grid-area: footer;
  pointer-events: none;
  bottom: 0;
  width: 100%;
  height: 6rem;
  position: absolute;
  z-index: 1;

  &:after {
    background-image: url(data:image/png;base64,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);
    content: " ";
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 16px;
    position: absolute; 
    bottom: 0;
    left: 0;
    width: 100%;
  }
}

.home__footerContent {
  width: 100%;
  max-width: 1024px;
  margin: auto;
  text-align: right;
  padding: 0 2rem;
  box-sizing: border-box;
  z-index: 1;

  img {
    width: 13rem;
  }
}

#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  z-index: 1;
}

#title {
  opacity: 0;
  transform: translateY(20px);
}

#content {
  opacity: 0;
}

#wave {
  width: 100%;
  transform: translateY(-1000px);
}

#three {
  position: absolute;
  left: 0;
  transform: scale(0.5);
}

#gifts {
  position: absolute;
  right: 0;
  transform: scale(0.5);
}

.card {
  width: 90vw;
  max-width: 40rem;
  position: absolute;
  top: 50%;
  z-index: 1;
  left: 50%;
  transform: translate(-50%, -50%);
}

.card__img {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.card__content {
  width: 100%;
  max-width: 90vw;
  height: 90vw;
  max-height: 40rem;
  background-image: url('~@/assets/images/cb2.png');
  background-size: 100%;
  position: relative;
}

.cb1{
  background-image: url('~@/assets/images/cb1.png');
}

.cb2{
  background-image: url('~@/assets/images/cb2.png');
}

.cb3{
  background-image: url('~@/assets/images/cb3.png');
}

.cb4{
  background-image: url('~@/assets/images/cb4.png');
}

.card__animate {
  opacity: 0;
  top: -50%;
}

.card__text {
  padding: 8vh 2vw;
  text-align: left;
  width: 28rem;
  position: absolute;
  right: 0;
}

.card__controls {
  padding: 2vh;
  display: flex;
  justify-content: space-evenly;
}

.card__insideText {
  font-size: 0.7rem;
  text-align: center;
  display: block;
  width: 14vw;
  max-width: 130px;
  margin: 1vh auto;
}

.card__message, .card__message-print {
  color: $black;
  font-size: 1.3rem;
}

.card__to {
  color: $black;
  font-size: 1.5rem;
  margin-bottom: 4vh;
}

.card__from {
  position: absolute;
  bottom: 13rem;
  right: 3.3rem;
  color: $black;
  font-size: 1.5rem
}

.btn__red {
  background: $red;
  border: 1px solid $redDark;
}

.btn__red:hover,
.btn__red:focus,
.btn__red:active {
 background: $redDark;
}

.hidden {
  display: none;
}

@media (max-width: $desktop) {
  .home__figures {
    top: 5vh !important;
  }
}

@media (max-width: $tablet) {
  .home__form {
    flex-flow: column;
  }

  .home__toFrom {
    align-items: center;
  }

  .home__textMax {
    text-align: center;
  }

  .home__figures {
    top: 15vh !important;
  }

  .home__footer { 
    bottom: 16px;
    padding-bottom: 1vh;
    padding-top: 3vh;
    position: relative;

    &:after {
      top: 100%;
    }
  }

  #banner {
    width: 90vw;
  }

  #three {
    width: 30vw;
    top: -12vh;
  }

  #gifts {
    width: 30vw;
    top: -12vh;
  }

  .card__from {
    position: absolute;
    bottom: 25vw;
    right: 8vw;
  }

  .card__text {
    width: 55vw;
  }

  .card__message {
    font-size: 12px;
    font-size: calc(0.2rem + 2.5vw);
  }

  .card__from, .card__to {
    font-size: 14px;
    font-size: calc(0.4rem + 2.5vw);
  }

  .home__spacing {
    min-height: 36rem;
  }

  .home__footer {
    height: 3rem;
    background-size: 100% 1.5rem;
  }

  .home__footerContent {
    text-align: center;

    img {
      width: 9rem;
    }
  }
}
</style>
