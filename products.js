import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

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
        productModal.show();
      } else if (isNew === 'edit') {
        this.currentProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        this.currentProduct = { ...item };
        delProductModal.show()
      }
    },
  },
});

// 分頁元件
app.component('pagination', {
  template: '#pagination',
  props: ['pages'],
  methods: {
    emitPages(item) {
      this.$emit('emit-pages', item);
    },
  },
});

// 產品新增/編輯元件 html element : <product-modal/>
app.component('productModal', {
  template: '#productModal',
  props: ['product', 'isNew'],
  data() {
    return {
      api_url: 'https://ec-course-api.hexschool.io',//'https://vue3-course-api.hexschool.io',
      api_path: 'joanhui',
    };
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
      backdrop: 'static'
    });
  },
  methods: {
    updateProduct() {
      // 新增商品
      let api = `${this.api_url}/v2/api/${this.api_path}/admin/product`;
      let httpMethod = 'post';//新增
      // 當不是新增商品時則切換成編輯商品 API
      if (!this.isNew) {
        api = `${this.api_url}/v2/api/${this.api_path}/admin/product/${this.product.id}`;
        httpMethod = 'put';//修改
      }

      axios[httpMethod](api, { data: this.product }).then((response) => {
        alert(response.data.message);
        this.hideModal();
        this.$emit('update');//通知父層要更新products
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    createImages() {
      this.product.imagesUrl = [];
      this.product.imagesUrl.push('');
    },
    openModal() {
      productModal.show();
    },
    hideModal() {
      productModal.hide();
    },
  },
})
// 產品刪除元件>>html element : <del-product-modal/>
app.component('delProductModal', {
  template: '#delProductModal',
  props: ['item'],
  data() {
    return {
        api_url: 'https://ec-course-api.hexschool.io',//'https://vue3-course-api.hexschool.io',
        api_path: 'joanhui',
    };
  },
  mounted() {
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
      backdrop: 'static',
    });
  },
  methods: {
    delProduct() {
      axios.delete(`${this.api_url}/v2/api/${this.api_path}/admin/product/${this.item.id}`).then((response) => {
        alert(response.data.message);
        this.hideModal();
        this.$emit('update');//通知父層要更新products
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    openModal() {
      delProductModal.show();
    },
    hideModal() {
      delProductModal.hide();
    },
  },
});

app.mount('#app');