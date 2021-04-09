<template>
  <div class="card">
    <div class="card__content">
      <div class="card__text">
        <h1 class="card__to">{{ nameTo }}</h1>
        <div class="card__message">
          {{ msg }}
        </div>
      </div>
      <h3 class="card__from">{{ nameFrom }}</h3>
    </div>
    <div class="card__controls">
      <a href="#" class="btn__generator btn__red" v-on:click="createCard">NOVO CARTÃO</a><a href="#" class="btn__generator">DOWNLOAD</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    nameTo: String,
    nameFrom: String,
    msg: String
  }
}
</script>
<style scoped lang="scss">
.card {
  width: 90vw;
  max-width: 40rem;
  position: absolute;
  top: 50%;
  z-index: 1;
  left: 50%;
  transform: translate(-50%, -50%);
}

.card__content {
  width: 90vw;
  height: 90vw;
  max-height: 40rem;
  background: url('~@/assets/images/card_full_02.png');
  background-size: 100%;
  width: 100%;
  position: relative;
}

.card__text {
  padding: 2rem;
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

.btn__red {
  background: $red;
  border: 1px solid $redDark;
}

.btn__red:before {
  background: $redDark;
}

.card__message {
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

@media (max-width: $tablet) {
  .card__from {
    position: absolute;
    bottom: 25vw;
    right: 8vw;
  }

  .card__text {
    width: 55vw;
  }

  .card__message {
    font-size: calc(0.2rem + 2.5vw);
  }

  .card__from, .card__to {
    font-size: calc(0.5rem + 2.5vw);
  }
}
</style>
