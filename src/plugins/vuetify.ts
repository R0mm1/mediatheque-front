import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import fr from 'vuetify/src/locale/fr';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      disable: true
  },
    lang: {
      locales: { fr },
      current: 'fr',
    },
  icons: {
    iconfont: 'fa',
  },
});
