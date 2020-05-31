var eventBus = new Vue();

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
  <div class="product">
    <div class="product-image">
      <img :src="image" alt="" />
    </div>
  <div class="product-info">
    <h1>{{sale}}</h1>
    <p v-if="inStock>5">In Stock</p>
    <p v-else-if="inStock>0 && inStock<=5">Almost Sold Out</p>
    <p v-else :class="{outOfStock: !inStock}">Out of Stock</p>
    <p>Shipping: {{ shipping }} </p>
    <a :href="link">more products..</a>
<product-details :details="details"> </product-details>
  <div
    class="color-box"
    v-for="(variant, index) in variants"
    :key="variant.variantId"
    :style="{backgroundColor: variant.variantColor}"
    @mouseover="updateProduct(index)"
  >
    <p>
      {{variant.variantColor}}
    </p>
  </div>
  <button
    v-on:click="addToCart"
    :disabled="!inStock"
    :class="{disabledButton: !inStock}"
  >
    Add to cart
  </button>
  <button @click="removeFormCart" 
  >
Remove from cart
</button>


</div>
<product-tabs :reviews="reviews"></product-tabs>
      
</div>
  </div>
  `,
  data() {
    return {
      product: "Shoes",
      brand: "Nike",
      // image: "./assets/nike-black.jpg",
      selectedVariant: 0,
      link: "https://www.nike.com/id/",
      // inStock: true,
      details: ["80% cotton", "20% polyster", "gender-neutral"],
      sizes: [40, 41, 42],
      variants: [
        {
          variantId: 1,
          variantColor: "blue",
          variantImage: "./assets/nike-blue.jpg",
          variantQuantity: 10,
        },
        {
          variantId: 2,
          variantColor: "black",
          variantImage: "./assets/nike-black.jpg",
          variantQuantity: 5,
        },
        {
          variantId: 3,
          variantColor: "gray",
          variantImage: "./assets/nike-gray.jpg",
          variantQuantity: 0,
        },
      ],
      cart: 0,
      onSale: true,
      reviews: [],
    };
  },
  methods: {
    addToCart() {
      // this.cart += 1;
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFormCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    decToCart() {
      if (this.cart > 0) {
        this.cart -= 1;
      }
    },
    updateProduct(index) {
      this.selectedVariant = index;
      console.log(index);
    },
    // addReview(productReview) {
    //   this.reviews.push(productReview);
    // },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) {
        return this.brand + " " + this.product;
      } else {
        return this.brand + " " + this.product;
      }
    },
    shipping() {
      if (this.premium) {
        return "free";
      }
      return 2.99;
    },
    mounted() {
      eventBus.$on("review-submitted", (productReview) => {
        this.reviews.push(productReview);
      });
    },
  },
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: false,
    },
  },
  template: `
    <div>
    
      <div>
        <span class="tabs" 
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              :key="index"
              @click="selectedTab = tab"
        >{{ tab }}</span>
      </div>

      <div v-show="selectedTab === 'Reviews'">
          <p v-if="!reviews.length">There are no reviews yet.</p>
          <ul v-else>
              <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating:{{ review.rating }}</p>
                <p>{{ review.review }}</p>
              </li>
          </ul>
      </div>

      <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
      </div>
  
    </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews",
    };
  },
});

Vue.component("product-review", {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
    
      <p class="error" v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
      }
    },
  },
});

Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
  <ul>
  <li v-for="detail in details">{{detail}}</li>
</ul>
  `,
});

var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id) {
      console.log(this.cart);
      this.cart.push(id);
    },
    removeItem(id) {
      for (var i = this.cart.length; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    },
  },
});
// let app = new Vue({
//   el: "#app",
//   data: {
//     product: "shoes",
//     brand: "nike",
//     // image: "./assets/nike-black.jpg",
//     selectedVariant: 0,
//     link: "https://www.nike.com/id/",
//     // inStock: true,
//     details: ["80% cotton", "20% polyster", "gender-neutral"],
//     sizes: [40, 41, 42],
//     variants: [
//       {
//         variantId: 1,
//         variantColor: "blue",
//         variantImage: "./assets/nike-blue.jpg",
//         variantQuantity: 10,
//       },
//       {
//         variantId: 2,
//         variantColor: "black",
//         variantImage: "./assets/nike-black.jpg",
//         variantQuantity: 5,
//       },
//       {
//         variantId: 3,
//         variantColor: "gray",
//         variantImage: "./assets/nike-gray.jpg",
//         variantQuantity: 0,
//       },
//     ],
//     cart: 0,
//     onSale: true,
//   },
//   methods: {
//     addToCart() {
//       this.cart += 1;
//     },
//     decToCart() {
//       if (this.cart > 0) {
//         this.cart -= 1;
//       }
//     },
//     updateProduct(index) {
//       this.selectedVariant = index;
//       console.log(index);
//     },
//   },
//   computed: {
//     title() {
//       return this.brand + " " + this.product;
//     },
//     image() {
//       return this.variants[this.selectedVariant].variantImage;
//     },
//     inStock() {
//       return this.variants[this.selectedVariant].variantQuantity;
//     },
//     sale() {
//       if (this.onSale) {
//         return this.brand + " " + this.product + " are on sale";
//       } else {
//         return this.brand + " " + this.product + " are not on sale";
//       }
//     },
//   },
// });
