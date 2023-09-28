const listIngredients = require('./apiapp.js');

test('list ingredients', () => {
    expect(listIngredients(cocktail)).toBe('1 long strip Lemon peel');
});