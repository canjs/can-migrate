Component.extend({
  tag: 'foo-bar',
  ViewModel: {},
  view: ``
});

Component.extend({
  tag: 'foo-baz',
  ViewModel: {},
  view: `<h1>HELLO</h1>`
});

const CustomScroll = Component.extend({
  tag: 'custom-scroll',
  ViewModel: {
    something: {
      type: 'string',
      get (lastSet, resolve) {
        resolve(true);
      }
    }
  },
  view: `
<h1>HELLO</h1>
`,
  events: {
    inserted () {
      const { viewModel } = this;
    }
  }
});
