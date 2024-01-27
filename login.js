import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      const api_url = 'https://ec-course-api.hexschool.io/v2/admin/signin';
      axios.post(api_url, this.user).then((response) => {
        const { token, expired } = response.data;
        // 寫入 cookie token
        // expires 設置有效時間
        document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
                console.log('punin--token='+token)
                window.location = 'products.html';
                //this.checkAdmin();
      }).catch((err) => {
        alert('登入失敗');
        //alert(err.response.data.message);
      });
    },
  },
}).mount('#app');