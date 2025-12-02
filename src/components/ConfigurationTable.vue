<template>
  <div class="table-container">
    <table class="table table-striped table-bordered table-hover table-clickable">
      <thead class="table-header">
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="groupByDay">
          <!-- Corregido: v-for con :key como atributo separado -->
          <template v-for="(group, dayName) in grouped" :key="dayName">
            <tr class="day-row">
              <td class="day-cell" rowspan="1">{{ dayName }}</td>
              <td class="empty-cell" colspan="4"></td>
            </tr>
            <tr
              v-for="(item, idx) in group"
              :key="dayName + '-' + idx"
              :class="rowClass(idx)"
              class="row-click"
              @click="$emit('edit', item)"
            >
              <td class="day-spacer"></td>
              <td>{{ item.time }}</td>
              <td>{{ item.persons }}</td>
              <td>{{ item.sex }}</td>
              <td>{{ item.break }}</td>
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
            <td>{{ item.day }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.persons }}</td>
            <td>{{ item.sex }}</td>
            <td>{{ item.break }}</td>
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

// Agrupar por día para simular la estructura visual
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
