export default  {
  template: '#productModal',
  props: ['product', 'isNew'],
  data() {
    return {
      api_url: 'https://ec-course-api.hexschool.io',//'https://vue3-course-api.hexschool.io',
      api_path: 'joanhui',
      modal: '',
    };
  },
  mounted() {
    this.modal = new bootstrap.Modal(document.getElementById('productModal'), {
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
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
}