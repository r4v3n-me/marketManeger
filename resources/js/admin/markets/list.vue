  <template>
  <v-card class="ma-4">
    <!-- delete dialog:BEGIN -->
    <delete v-if="deleteDialog"></delete>
    <!-- delete dialog:END -->
    <v-data-table
      :headers="headers"
      :search="search"
      :items="items"
      :loading="loading"
      @click:row="handleRowClick"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>List Des Marchés</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-btn
            link
            color="primary"
            dark
            class="mb-2"
            :to="{ name: 'adminCreateMarkets' }"
          >
            Créer un marché
          </v-btn>
        </v-toolbar>

        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            :loading="searchLoading"
          ></v-text-field>
        </v-card-title>
      </template>

      <!-- BEGIN:action column -->
      <template v-slot:item.actions="{ item }">
        <v-btn color="error" @click.stop="remove(item)" icon text small>
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </template>
      <!-- END:action column -->
    </v-data-table>
    <!-- BEGIN:pagination -->
    <v-pagination
      v-model="currentPage"
      class="py-4"
      :length="lastPage"
      :total-visible="8"
    ></v-pagination>
    <!-- END:pagination -->
  </v-card>
</template>

<script>
import Delete from "./delete.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Delete,
  },
  data() {
    return {
      headers: [
        { text: "Gérant", value: "manager.name" },
        { text: "Nom de marché", value: "name" },
        { text: "№ de marché", value: "market_number" },
        { text: "Date d'ordre service", value: "service_order_date" },
        { text: "Date délai", value: "deadline_date" },
        { text: "Actions", value: "actions" },
      ],
      searchLoading: false,
      loading: false,
    };
  },
  watch: {
    currentPage() {
      this.getData();
    },
    search() {
      this.handleSearch();
    },
  },
  computed: {
    ...mapGetters({
      deleteDialog: "admin/markets/deleteDialog",
      items: "admin/markets/markets",
      lastPage: "admin/markets/lastPage",
    }),
    currentPage: {
      get() {
        return this.$store.getters["admin/markets/currentPage"];
      },
      set(value) {
        this.$store.commit("admin/markets/setCurrentPage", { page: value });
      },
    },
    search: {
      get() {
        return this.$store.getters["admin/markets/search"];
      },
      set(value) {
        this.$store.commit("admin/markets/setSearch", { search: value });
      },
    },
  },
  methods: {
    getData() {
      this.loading = true;
      this.$store
        .dispatch("admin/markets/getData")
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSearch() {
      this.searchLoading = true;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        //action
        this.$store
          .dispatch("admin/markets/getData")
          // promis resolved
          .then(() => {
            this.searchLoading = false;
          });
      }, 500); // delay
    },
    remove(item) {
      this.$store.commit("admin/markets/setDelete", {
        id: item.id,
        number: item.market_number,
      });
    },
    handleRowClick({ id }) {
      this.$router.replace({
        name: "adminMarketsEdit",
        params: {
          id,
        },
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
