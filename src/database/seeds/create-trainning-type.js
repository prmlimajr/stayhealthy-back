exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('trainning_type')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('trainning_type').insert([
        { type: 'A', description: 'Ombro/Peitoral/Tríceps' },
        { type: 'B', description: 'Bíceps/Dorsais/Trapézio' },
        { type: 'C', description: 'Glúteos/Perna' },
      ]);
    });
};
