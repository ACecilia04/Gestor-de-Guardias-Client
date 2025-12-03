<template>
  <div class="table-container">
    <table class="table table-striped table-bordered table-hover table-clickable">
      <thead class="table-header">
        <tr>
          <th>{{ columns[0].label }}</th> <!-- Día -->
          <th v-for="col in columns.slice(1)" :key="col.key">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="groupByDay">
          <template v-for="(group, dayName) in grouped" :key="dayName">
            <!-- Fila de agrupación por día -->
            <tr class="day-row">
              <td class="day-cell" rowspan="1">{{ dayName }}</td>
              <td class="empty-cell" :colspan="columns.length - 1"></td>
            </tr>
            <!-- Filas de datos del día (sin la columna de día) -->
            <tr
              v-for="(item, idx) in group"
              :key="dayName + '-' + idx"
              :class="rowClass(idx)"
              class="row-click"
              @click="$emit('edit', item)"
            >
              <td></td> <!-- celda vacía donde estaría el día, para alinear -->
              <td v-for="col in columns.slice(1)" :key="col.key">{{ item[col.key] }}</td>
            </tr>
          </template>
        </template>
        <template v-else>
          <tr
            v-for="(item, idx) in rows"
            :key="idx"
            :class="rowClass(idx)"
            class="row-click"
            @click="$emit('edit', item)"
          >
            <td v-for="col in columns" :key="col.key">{{ item[col.key] }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rows: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  groupByDay: { type: Boolean, default: true }
})

defineEmits(['edit'])

const grouped = computed(() => {
  const map = {}
  for (const r of props.rows) {
    if (!map[r.day]) map[r.day] = []
    map[r.day].push(r)
  }
  return map
})

function rowClass(idx) {
  return idx % 2 === 0 ? 'row-even' : 'row-odd'
}
</script>