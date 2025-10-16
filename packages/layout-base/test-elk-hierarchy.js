import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const graph = {
  id: 'root',
  layoutOptions: {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
  },
  children: [
    {
      id: 'container1',
      layoutOptions: {
        'elk.padding': '[top=30,left=30,bottom=30,right=30]',
      },
      children: [
        { id: 'A', width: 100, height: 60 },
        { id: 'B', width: 100, height: 60 },
      ],
      edges: [{ id: 'A->B', sources: ['A'], targets: ['B'] }],
    },
  ],
  edges: [],
};

console.log('Input graph:', JSON.stringify(graph, null, 2));

elk
  .layout(graph)
  .then((result) => {
    console.log('\nSuccess! Result:', JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error('\nError:', error);
  });
