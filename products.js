import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './pagination.js';
import productModal from './productModal.js';
import delProductModal from './delProductModal.js';

//let productModal = null;
//let delProductModal = null;

const app =createApp({
  data() {
    return {
     api_url: 'https://ec-course-api.hexschool.io',//"https://vue3-course-api.hexschool.io",
     api_path: 'joanhui',
     products: [],
     currentProduct: {
      imagesUrl: [],
     },
    pagination: {},
    isNew: false,
    }
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common["Authorization"] = token;
    console.log(token);
    this.checkAdmin();
  },
  // components: {
  //   delProductModal,
  // },
  methods: {
    checkAdmin() {
      const url = `${this.api_url}/v2/api/user/check`;
    //const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.post(url)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          console.log(err.response.data.message)
          alert('身份驗證失敗，請重新登入');
          window.location = 'login.html';
        })
    },
    getProducts(page = 1) {
       //`${this.api_url}/v2/api/${this.api_path}/admin/products/all` >>沒有分頁時取用
      const url = `${this.api_url}/v2/api/${this.api_path}/admin/products?page=${page}`;

      axios.get(url)
        .then((response) => {
          const { products, pagination } = response.data;
          this.products = products;
          this.pagination = pagination;
        }).catch((err) => {
          alert(err.response.data.message);
          window.location = 'login.html';
        })
    },
    openModal(isNew, item) {
      if (isNew === 'new') {
        this.currentProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        this.$refs.prodModal.openModal();
        //productModal.show();
      } else if (isNew === 'edit') {
        this.currentProduct = { ...item };
        this.isNew = false;
        this.$refs.prodModal.openModal();
        //productModal.show();
      } else if (isNew === 'delete') {
        this.currentProduct = { ...item };
        this.$refs.delProdModal.openModal();
        //delProductModal.show()
        
      }
    },
  },
});

// 分頁元件
// app.component('pagination', {
//   template: '#pagination',
//   props: ['pages'],
//   methods: {
//     emitPages(item) {
//       this.$emit('emit-pages', item);
//     },
//   },
// });
app.component('pagination', pagination);

// 產品新增/編輯元件 html element : <product-modal/>
app.component('productModal',productModal);
// 產品刪除元件>>html element : <del-product-modal/>
//app.component('delProductModal', delProductModal);
app.component('delProductModal', delProductModal);

app.mount('#app');