<template>
  <div class="p-6">
    <h1>Planificaciones</h1>

    <table class="table-auto w-full border mt-4">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2">Día</th>
          <th class="p-2">Horario</th>
          <th class="p-2">Carnet</th>
          <th class="p-2">Apellidos</th>
          <th class="p-2">Nombre</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="g in guardias" :key="g.id" class="border-b">
          <td class="p-2">{{ g.dia }}</td>
          <td class="p-2">{{ g.horario }}</td>
          <td class="p-2">{{ g.carnet }}</td>
          <td class="p-2">{{ g.apellidos }}</td>
          <td class="p-2">{{ g.nombre }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
//import { getPlanificacionById } from '@/api/planificaciones';
export default {
  data() {
    return {
      guardias: [
        {
          id: 1,
          dia: '23 Lunes',
          horario: '20:00 - 08:00',
          carnet: '01011186884',
          apellidos: 'Banegas Andrade',
          nombre: 'Marlon Roberto',
        },
        {
          id: 2,
          dia: '24 Martes',
          horario: '20:00 - 08:00',
          carnet: '01100144547',
          apellidos: 'Blakman Briones',
          nombre: 'Teodoro Ivan',
        },
      ],
    };
  },
};

</script>
