const express = require('express');
const app = express();
const port = 3030;

const bundles = [
  {
    id: 1,
    name: 'Bundle 1',
    chunks: [
      {
        order: 0,
        words: [
          { word: 'one', translation: 'uno' },
          { word: 'teaspoon', translation: 'cucharadita' },
          { word: 'to be', translation: 'ser' },
          { word: 'to be', translation: 'estar' },
          { word: 'to make', translation: 'hacer' },
          { word: 'to allow', translation: 'permitir' },
          { word: 'to deny', translation: 'prohibir' }
        ]
      },
      {
        order: 1,
        words: [
          { word: 'ten', translation: 'diez' },
          { word: 'coronel', translation: 'el coronel' },
          { word: 'lawyer', translation: 'el abogado' },
          { word: 'apartment', translation: 'el piso' },
          { word: 'house', translation: 'la casa' },
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Bundle 2',
    chunks: [
      {
        order: 0,
        words: [
          { word: 'clock', translation: 'el reloj' },
          { word: 'jar', translation: 'el tarro' },
          { word: 'wife', translation: 'la mujer' },
          { word: 'child', translation: 'el nino' },
          { word: 'head', translation: 'la cabeza' },
          { word: 'fist', translation: 'punado' },
          { word: 'sea', translation: 'el mar' },
          { word: 'juice', translation: 'naranja' },
          { word: 'word', translation: 'palabra' },
          { word: 'newspaper', translation: 'el periodico' },
          { word: 'to work', translation: 'trabajar' },
          { word: 'success', translation: 'exito' },
        ]
      },
      {
        order: 1,
        words: [
          { word: 'sun', translation: 'el sol' },
          { word: 'to walk', translation: 'caminar' },
          { word: 'to cook', translation: 'cocinar' },
          { word: 'girlfriend', translation: 'novia' },
          { word: 'sister', translation: 'hermana' },
        ]
      }
    ]
  }
]

app.get('/bundles', (req, res) => {
  res.json(bundles);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});