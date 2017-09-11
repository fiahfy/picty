<template>
  <div class="main-page">
    <div class="menu-bar">
      <mdc-icon icon="folder"/>
      <mdc-textfield
        label="Input path..."
        fullwidth
        :defaultValue="defaultPath"
        v-model="path"
        @keyupEnter="keyupEnter"
      />
    </div>
    <div class="content">
      <mdc-table>
        <mdc-table-header>
          <mdc-table-row>
            <mdc-table-header-column class="name">
              Name
            </mdc-table-header-column>
            <mdc-table-header-column class="modified-date">
              Modified Date
            </mdc-table-header-column>
          </mdc-table-row>
        </mdc-table-header>
        <mdc-table-body>
          <mdc-table-row v-for="file in files" :key="file.name" @click="rowClick(file)">
            <mdc-table-column class="name">
              <mdc-icon :icon="file.stats.isDirectory() ? 'folder' : 'note'"/>
              {{ file.name }}
            </mdc-table-column>
            <mdc-table-column class="modified-date">
              {{ file.stats.mtime | date }}
            </mdc-table-column>
          </mdc-table-row>
        </mdc-table-body>
      </mdc-table>
    </div>
  </div>
</template>

<script>
import path from 'path';
import MdcIcon from '../components/MdcIcon';
import MdcTextfield from '../components/MdcTextfield';
import MdcTable from '../components/MdcTable';
import MdcTableBody from '../components/MdcTableBody';
import MdcTableColumn from '../components/MdcTableColumn';
import MdcTableHeader from '../components/MdcTableHeader';
import MdcTableHeaderColumn from '../components/MdcTableHeaderColumn';
import MdcTableRow from '../components/MdcTableRow';

export default {
  name: 'main-page',
  components: {
    MdcIcon,
    MdcTextfield,
    MdcTable,
    MdcTableBody,
    MdcTableColumn,
    MdcTableHeader,
    MdcTableHeaderColumn,
    MdcTableRow,
  },
  data() {
    return {
      path: '',
    };
  },
  asyncData({ store }) {
    return store.dispatch('changePath', store.state.path);
  },
  computed: {
    defaultPath() {
      return this.$store.state.path;
    },
    files() {
      return this.$store.state.files;
    },
  },
  methods: {
    keyupEnter() {
      this.$store.dispatch('changePath', this.path);
    },
    rowClick(file) {
      if (file.stats.isDirectory()) {
        this.path = path.join(this.defaultPath, file.name);
        this.$store.dispatch('changePath', this.path);
      } else if (file.name.match(/.(jpe?g|gif|png)$/i)) {
        const filepath = path.join(this.defaultPath, file.name);
        this.$router.push({ name: 'viewer', params: { path: filepath } });
      }
    },
  },
  watch: {
    defaultPath() {
      this.$el.querySelector('.content').scrollTop = 0;
    },
  },
  filters: {
    date(value) {
      const date = new Date(value);
      const Y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const H = String(date.getHours()).padStart(2, '0');
      const i = String(date.getMinutes()).padStart(2, '0');
      return `${Y}/${m}/${d} ${H}:${i}`;
    },
  },
};
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.menu-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  padding: 4px;
}
.menu-bar .mdc-icon {
  padding: 4px;
}
.content {
  flex: 1;
  height: 100%;
  overflow-y: auto;
}
.mdc-textfield {
  border: none;
  font-size: smaller;
  height: 32px;
}
.mdc-table {
  table-layout: fixed;
}
.mdc-table-header-column {
  background-color: white;
  font-size: smaller;
  position: sticky;
  top: 0;
}
.mdc-table-header-column.modified-date {
  width: 128px;
}
.mdc-table-row {
  cursor: pointer;
}
.mdc-table-column {
  font-size: smaller;
  vertical-align: bottom;
  white-space: nowrap;
}
.mdc-table-column.name {
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: bottom;
}
.mdc-table-column .mdc-icon {
  padding: 0;
  vertical-align: bottom;
}
</style>
