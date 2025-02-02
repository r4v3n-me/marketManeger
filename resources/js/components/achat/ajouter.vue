<template>
  <v-container>
    <v-card class="pa-4" :disabled="loading" :loading="loading">
      <v-toolbar flat>
        <v-toolbar-title> Nouveau Achat </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-btn link color="primary" dark class="mb-2" :to="{ name: 'achats' }">
          List
        </v-btn>
      </v-toolbar>

      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.ndbc"
              label="Numero de bon de commande"
              :error-messages="errors.ndbc[0]"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-select
              :items="fournisseurs"
              item-value="id"
              item-text="name"
              v-model="form.fournisseur"
              label="Fournisseur"
              :error-messages="errors.fournisseur[0]"
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="form.paymentMode"
              label="Mode de payment"
              :items="paymentMethods"
              :error-messages="errors.paymentMode[0]"
            ></v-select>
          </v-col>

          <v-col cols="12" v-if="checkField">
            <v-text-field
              v-model="form.checkNumber"
              label="Numero de chèque"
              :error-messages="errors.checkNumber[0]"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-menu
              ref="deadlineMenu"
              v-model="deadlineMenu"
              :close-on-content-click="false"
              :return-value.sync="form.deadline"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.deadline"
                  label="Date échéance"
                  :error-messages="errors.deadline[0]"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="form.deadline" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="deadlineMenu = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.deadlineMenu.save(form.deadline)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-divider></v-divider>
        <!-- =========================[items inputs:BEGIN]========================== -->
        <v-row>
          <v-col cols="12" md="5">
            <v-select
              label="Article"
              v-model="item.article_id"
              :loading="articlesLoading"
              :items="articles"
              item-text="name"
              item-value="id"
            ></v-select>
            <v-text-field label="Prix" type="number" v-model="item.price">
            </v-text-field>
            <v-text-field
              label="Quantité"
              type="number"
              v-model="item.quantity"
            >
            </v-text-field>
            <v-btn outlined color="secondary" text>Annuler</v-btn>
            <v-btn color="primary" @click="addToCart">ajouter</v-btn>
          </v-col>
          <!-- =========================[items inputs:END]========================== -->

          <!-- =========================[items table:begin]========================== -->
          <v-col cols="12" md="7">
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">DSG</th>
                    <th class="text-left">Prix</th>
                    <th class="text-left">Quantité</th>
                    <th class="text-left">Total</th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cartItems" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.total }}</td>
                    <td>
                      <v-btn
                        icon
                        color="error"
                        @click="removeFromCart(item.article_id)"
                      >
                        <v-icon>mdi-close-circle-outline</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <!-- =========================[items table:END]========================== -->
        </v-row>
        <v-row>
          <v-col offset-md="6">
            <h4 class="font-weight-light">total : {{ total }} Dh</h4>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined class="mr-4" @click="resetForm">Annuler</v-btn>
          <v-btn color="success" class="mr-4" type="submit" :loading="loading"
            >Enregistrer
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        ndbc: "",
        fournisseur: "",
        paymentMode: "",
        checkNumber: "",
        deadline: null,
      },
      item: {
        article_id: null,
        price: null,
        quantity: null,
      },
      cartItems: [],
      errors: {
        ndbc: [],
        fournisseur: [],
        paymentMode: [],
        checkNumber: [],
        deadline: [],
      },
      paymentMethods: ["Chèque", "èspece"],
      loading: false,
      deadlineMenu: false,
      checkField: this.paymentMode == "Chèque",
      articlesLoading: false,
    };
  },
  watch: {
    form: {
      handler(val) {
        val.paymentMode == "Chèque"
          ? (this.checkField = true)
          : (this.checkField = false);
      },
      deep: true,
    },
  },
  computed: {
    articles() {
      return this.$store.getters["achat/articles"];
    },
    fournisseurs() {
      return this.$store.getters["achat/fournisseurs"];
    },
    total() {
      let total = 0;
      this.cartItems.forEach((item) => {
        total += item.price * item.quantity;
      });
      return total.toFixed(2);
    },
  },
  methods: {
    addToCart() {
      if (this.item.article_id && this.item.price && this.item.quantity) {
        let article = this.articles
          .filter((article) => article.id == this.item.article_id)
          .shift();
        const exist = this.cartItems.some((el) => el.article_id == article.id);
        let othePrice = false;
        if (exist) {
          this.cartItems.map((element) => {
            if (
              element.article_id == article.id &&
              element.price == this.item.price
            ) {
              element.quantity =
                parseInt(this.item.quantity) + parseInt(element.quantity);
              element.total += this.item.price * this.item.quantity;
            } else if (element.price != this.item.price) {
              othePrice = true;
            }
            return element;
          });
          this.emptyItem();
        } else {
          const newItem = {
            article_id: article.id,
            name: article.name,
            price: this.item.price,
            quantity: this.item.quantity,
            total: (this.item.price * this.item.quantity).toFixed(2),
          };
          this.cartItems.push(newItem);
          this.emptyItem();
        }
        if (othePrice) {
          this.$store.dispatch("alert/show", {
            text: "Vous ne pouvez pas ajouter le même article à des prix différents",
            type: "error",
          });
        }
      } else {
        this.$store.dispatch("alert/show", {
          text: "Les données fournies sont invalides",
          type: "error",
        });
      }
    },
    emptyItem() {
      this.item = {
        article_id: null,
        price: null,
        quantity: null,
      };
    },
    removeFromCart(id) {
      this.cartItems = this.cartItems.filter(
        (element) => element.article_id != id
      );
    },
    handleSubmit() {
      if (!this.loading) {
        this.resetErrors();
        this.loading = true;
        this.$store
          .dispatch("achat/store", {
            form: this.form,
            amount: this.total,
            items: this.cartItems,
          })
          .then(() => {
            this.loading = false;
            this.resetForm();
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
            if (error.data) {
              error.data.errors.ndbc
                ? (this.errors.ndbc = error.data.errors.ndbc)
                : (this.errors.ndbc = []);

              error.data.errors.fournisseur
                ? (this.errors.fournisseur = error.data.errors.fournisseur)
                : (this.errors.fournisseur = []);

              error.data.errors.payment_mode
                ? (this.errors.paymentMode = error.data.errors.payment_mode)
                : (this.errors.paymentMode = []);

              error.data.errors.deadline
                ? (this.errors.deadline = error.data.errors.deadline)
                : (this.errors.deadline = []);
            }
          });
      }
    },
    resetErrors() {
      this.errors = {
        ndbc: [],
        fournisseur: [],
        paymentMode: [],
        checkNumber: [],
        deadline: [],
      };
    },
    resetForm() {
      this.cartItems = [];
      this.resetErrors();
      this.form = {
        ndbc: "",
        fournisseur: "",
        paymentMode: "",
        checkNumber: "",
        deadline: null,
      };
    },
    getData() {
      this.articlesLoading = true;
      this.$store.dispatch("achat/getCreateData").then(() => {
        this.articlesLoading = false;
      });
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style>
</style>