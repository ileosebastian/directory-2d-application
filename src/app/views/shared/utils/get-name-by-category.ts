
const NAME_BY_CATETORY: { [key: string]: string } = {
    'audience': 'salon de autitorio',
    'bathroom': 'baños',
    'classroom': 'aula de clases',
    'data-center': 'centro de datos',
    'elevator': 'ascensor',
    'admin-office': 'oficina de administracion',
    'emergency': 'salida de emergencias',
    'profe-office': 'oficina de docentes',
    'stair': 'escaleras',
}

export const getNameByCategory = (category: string) => {
    return NAME_BY_CATETORY[category] || 'ambientes';
};